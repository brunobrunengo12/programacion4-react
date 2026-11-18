import { useState } from "react";

interface ItemCompra {
  id: number;
  nombre: string;
}

export default function Ej5() {
  const [items, setItems] = useState<ItemCompra[]>([]);
  const [texto, setTexto] = useState("");

  const agregar = () => {
    if (texto.trim() === "") return;
    const nuevo: ItemCompra = {
      id: Date.now(),
      nombre: texto.trim(),
    };
    setItems([...items, nuevo]);
    setTexto("");
  };

  const eliminar = (id: number) => {
    setItems(items.filter((i) => i.id !== id));
  };

  return (
    <div>
      <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
        <input
          type="text"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Ej: yerba"
        />
        <button onClick={agregar}>Agregar</button>
      </div>

      {items.length === 0 ? (
        <p>No hay nada para comprar</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id} style={{ marginBottom: "6px" }}>
              {item.nombre}{" "}
              <button onClick={() => eliminar(item.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}