import { useState } from "react";

export default function Ej3() {
  const [visible, setVisible] = useState(false);

  return (
    <div style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "12px", maxWidth: "500px" }}>
      <h3>¿Qué es JSX?</h3>
      <button onClick={() => setVisible(!visible)}>
        {visible ? "Ocultar respuesta" : "Mostrar respuesta"}
      </button>
      {visible && (
        <p>
          Una sintaxis que permite escribir estructura parecida a HTML dentro de
          JavaScript. Se transforma en llamadas a funciones de React.
        </p>
      )}
    </div>
  );
}