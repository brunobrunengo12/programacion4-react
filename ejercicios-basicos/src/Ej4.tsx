import { useState } from "react";

export default function Ej4() {
  const [celsius, setCelsius] = useState("0");

  const numCelsius = Number(celsius);
  const fahrenheit = (numCelsius * 9) / 5 + 32;

  return (
    <div>
      <input
        type="number"
        value={celsius}
        onChange={(e) => setCelsius(e.target.value)}
        placeholder="Grados Celsius"
      />
      <h2>{fahrenheit.toFixed(1)} °F</h2>
      {numCelsius > 30 && <p>Hace calor</p>}
    </div>
  );
}