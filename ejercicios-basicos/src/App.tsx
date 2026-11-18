import Ej1 from "./Ej1";
import Ej2 from "./Ej2";
import Ej3 from "./Ej3";
import Ej4 from "./Ej4";
import Ej5 from "./Ej5";
import Ej6 from "./Ej6";
import Ej7 from "./Ej7";

export default function App() {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px", fontFamily: "sans-serif" }}>
      <h1>React desde cero</h1>

      <section style={{ marginBottom: "32px" }}>
        <h2>1) Tarjetas de producto</h2>
        <Ej1 />
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2>2) Contador con límites</h2>
        <Ej2 />
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2>3) Mostrar y ocultar</h2>
        <Ej3 />
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2>4) Conversor de temperatura</h2>
        <Ej4 />
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2>5) Lista de compras</h2>
        <Ej5 />
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2>6) Buscador</h2>
        <Ej6 />
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2>7) Tipar con TypeScript</h2>
        <Ej7 />
      </section>
    </div>
  );
}