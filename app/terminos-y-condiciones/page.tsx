import { LegalPage } from "@/components/legal-page";
import { COMPANY } from "@/lib/company";

export default function TermsPage() {
  return (
    <LegalPage title="Terminos y Condiciones">
      <p>Estos terminos regulan el uso de maquinariasmarmol.com.mx y las compras realizadas con {COMPANY.name}. Al generar un pedido, el cliente declara haber leido y aceptado estas condiciones.</p>
      <h2>Catalogo y cotizaciones</h2>
      <p>Las imagenes son ilustrativas de cada tipo de equipo. La disponibilidad, condiciones de entrega y caracteristicas especificas se confirman durante el proceso de compra o cotizacion. Los precios se muestran en pesos mexicanos e indican IVA incluido cuando asi se especifica.</p>
      <h2>Pedidos y pagos</h2>
      <p>Un pedido se considera confirmado una vez que el pago haya sido autorizado y validado. Podremos solicitar informacion adicional cuando sea necesaria para proteger al cliente o verificar la operacion. Los pagos se procesan mediante Stripe Checkout cuando la pasarela este disponible.</p>
      <h2>Entrega</h2>
      <p>El costo, modalidad y plazo de envio dependen del tipo de maquinaria, peso, volumen y destino. Estos datos se confirman antes de despachar el equipo.</p>
      <h2>Uso responsable</h2>
      <p>El comprador es responsable de utilizar la maquinaria conforme a sus manuales, capacidad nominal, normas de seguridad y legislacion aplicable. La operacion debe realizarse por personal capacitado.</p>
      <h2>Contacto</h2>
      <p>Para resolver dudas sobre estas condiciones puede escribir a <a href={`mailto:${COMPANY.emails[1]}`}>{COMPANY.emails[1]}</a>.</p>
    </LegalPage>
  );
}
