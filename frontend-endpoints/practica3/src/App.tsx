import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { UserList } from "./UserList";

interface User {
  id: number;
  name: string;
}

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (!token) return;

    fetch(`${import.meta.env.VITE_API_URL}/user/me/id`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return null;
        return fetch(`${import.meta.env.VITE_API_URL}/user/${data.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then((res) => (res && res.ok ? res.json() : null))
      .then((userData: User | null) => {
        if (userData) setCurrentUser(userData);
      });
  }, [token]);

  async function handleSubmit(evento: FormEvent) {
    evento.preventDefault();
    setError(null);
    const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.detail);
      return;
    }
    localStorage.setItem("token", data.token);
    setToken(data.token);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setToken(null);
    setCurrentUser(null);
  }

  if (token) {
    return (
      <div>
        <header>
          <span>{currentUser ? `Hola, ${currentUser.name}` : "Cargando..."}</span>
          <button type="button" onClick={handleLogout}>
            Salir
          </button>
        </header>
        <UserList token={token} />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Ingresar</button>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
    </form>
  );
}