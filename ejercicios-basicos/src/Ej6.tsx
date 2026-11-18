import { useState } from "react";

const LENGUAJES = [
  "JavaScript",
  "Python",
  "Java",
  "TypeScript",
  "C#",
  "C++",
  "Ruby",
  "Go",
  "Rust",
  "PHP",
];

export default function Ej6() {
  const [busqueda, setBusqueda] = useState("");

  const filtrados = LENGUAJES.filter((l) =>
    l.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar lenguaje..."
      />
      <p>{filtrados.length} resultados</p>
      <ul>
        {filtrados.map((lenguaje) => (
          <li key={lenguaje}>{lenguaje}</li>
        ))}
      </ul>
    </div>
  );
}