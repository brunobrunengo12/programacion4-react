import { useEffect, useState } from "react";
import type { FormEvent } from "react";

interface User {
  id: number;
  name: string;
}

interface Country {
  id: number;
  name: string;
}

interface Role {
  id: number;
  name: string;
}

interface UserDetail extends User {
  email: string;
  age: number;
  country: Country | null;
  roles: Role[];
}

interface UserListProps {
  token: string;
  onUnauthorized: () => void;
}

export function UserList({ token, onUnauthorized }: UserListProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [searchText, setSearchText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [onlyAdults, setOnlyAdults] = useState(false);
  const [reloadCount, setReloadCount] = useState(0);

  // Estados del formulario de alta
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [countryId, setCountryId] = useState("1");
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    let url = `${import.meta.env.VITE_API_URL}/user`;
    if (searchQuery) {
      url = `${import.meta.env.VITE_API_URL}/user/search/${encodeURIComponent(searchQuery)}`;
    } else if (onlyAdults) {
      url = `${import.meta.env.VITE_API_URL}/user_mayores`;
    }

    fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (respuesta) => {
        if (respuesta.status === 401) {
          onUnauthorized();
          return;
        }
        const data = await respuesta.json();
        if (!respuesta.ok) {
          setError(data.detail ?? `Error ${respuesta.status}`);
          return;
        }
        setUsers(data);
      })
      .catch(() => {
        setError("No se pudo conectar con la API.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token, searchQuery, onlyAdults, reloadCount, onUnauthorized]);

  useEffect(() => {
    if (selectedId === null) return;

    fetch(`${import.meta.env.VITE_API_URL}/user/${selectedId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(async (respuesta) => {
      if (respuesta.status === 401) {
        onUnauthorized();
        return;
      }
      if (!respuesta.ok) return;
      const data: UserDetail = await respuesta.json();
      setSelectedUser(data);
    });
  }, [selectedId, token, onUnauthorized]);

  function handleSearch(event: FormEvent) {
    event.preventDefault();
    setOnlyAdults(false);
    setSearchQuery(searchText.trim());
  }

  function handleClear() {
    setSearchText("");
    setSearchQuery("");
    setOnlyAdults(false);
  }

  function handleToggleAdults() {
    setSearchText("");
    setSearchQuery("");
    setOnlyAdults((prev) => !prev);
  }

  async function handleCreateUser(event: FormEvent) {
    event.preventDefault();
    setCreateError(null);

    try {
      const respuesta = await fetch(`${import.meta.env.VITE_API_URL}/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          age: Number(age),
          email,
          password,
          country_id: Number(countryId),
        }),
      });

      if (respuesta.status === 401) {
        onUnauthorized();
        return;
      }

      const data = await respuesta.json();

      if (!respuesta.ok) {
        if (Array.isArray(data.detail)) {
          setCreateError(
            data.detail
              .map((e: { loc?: unknown[]; msg?: string }) =>
                `${e.loc?.at(-1) ?? "campo"}: ${e.msg ?? "inválido"}`
              )
              .join(" · ")
          );
        } else {
          setCreateError(data.detail ?? `Error ${respuesta.status}`);
        }
        return;
      }

      setName("");
      setAge("");
      setEmail("");
      setPassword("");
      setCountryId("1");
      setReloadCount((c) => c + 1);
    } catch {
      setCreateError("No se pudo conectar con la API.");
    }
  }

  async function handleDelete(user: User) {
    const confirmed = window.confirm(
      `¿Seguro que querés borrar a ${user.name}?`
    );
    if (!confirmed) return;

    setDeleteError(null);

    try {
      const respuesta = await fetch(
        `${import.meta.env.VITE_API_URL}/user/${user.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (respuesta.status === 401) {
        onUnauthorized();
        return;
      }

      const data = await respuesta.json();

      if (!respuesta.ok) {
        setDeleteError(data.detail ?? `Error ${respuesta.status}`);
        return;
      }

      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      if (selectedId === user.id) {
        setSelectedId(null);
        setSelectedUser(null);
      }
    } catch {
      setDeleteError("No se pudo conectar con la API.");
    }
  }

  return (
    <div>
      <h2>Nuevo usuario</h2>
      <form onSubmit={handleCreateUser}>
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Edad"
          min="0"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña (mín. 4)"
          minLength={4}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select
          value={countryId}
          onChange={(e) => setCountryId(e.target.value)}
        >
          <option value="1">Argentina</option>
          <option value="2">Brasil</option>
        </select>
        <button type="submit">Crear usuario</button>
      </form>
      {createError && <p style={{ color: "crimson" }}>{createError}</p>}

      <h2>Lista de usuarios {onlyAdults ? "(Solo mayores)" : ""}</h2>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button type="submit">Buscar</button>
        <button type="button" onClick={handleClear}>
          Limpiar
        </button>
        <button type="button" onClick={handleToggleAdults}>
          {onlyAdults ? "Todos" : "Solo mayores"}
        </button>
      </form>

      {deleteError && <p style={{ color: "crimson" }}>{deleteError}</p>}

      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p style={{ color: "crimson" }}>{error}</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <button type="button" onClick={() => setSelectedId(user.id)}>
                {user.name}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(user)}
                style={{ marginLeft: "8px" }}
              >
                Borrar
              </button>
            </li>
          ))}
        </ul>
      )}

      {selectedUser && (
        <div
          style={{
            marginTop: "16px",
            padding: "16px",
            background: "#ffffff",
            border: "1px solid #d8dde5",
            borderRadius: "8px",
          }}
        >
          <h3>Detalle de {selectedUser.name}</h3>
          <p>Email: {selectedUser.email}</p>
          <p>Edad: {selectedUser.age}</p>
          <p>País: {selectedUser.country?.name ?? "Sin país"}</p>
          <p>
            Roles:{" "}
            {selectedUser.roles.length > 0
              ? selectedUser.roles.map((r) => r.name).join(", ")
              : "Sin roles"}
          </p>
        </div>
      )}
    </div>
  );
}