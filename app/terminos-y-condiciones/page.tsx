import { LegalPage } from "@/components/legal-page";
import { COMPANY } from "@/lib/company";

export default function TermsPage() {
  return (
    <LegalPage title="Términos y Condiciones">
      <p>Estos términos regulan el uso de maquinariasmarmol.com.mx y las compras realizadas con {COMPANY.name}. Al generar un pedido, el cliente declara haber leído y aceptado estas condiciones.</p>
      <h2>Catálogo y cotizaciones</h2>
      <p>Las imágenes son ilustrativas de cada tipo de equipo. La disponibilidad, condiciones de entrega y características específicas se confirman durante el proceso de compra o cotización. Los precios se muestran en pesos mexicanos e indican IVA incluido cuando así se especifica.</p>
      <h2>Pedidos y pagos</h2>
      <p>Un pedido se considera confirmado una vez que el pago haya sido autorizado y validado. Podremos solicitar información adicional cuando sea necesaria para proteger al cliente o verificar la operación. Los métodos disponibles pueden incluir tarjeta, SPEI y OXXO Pay mediante Conekta.</p>
      <h2>Entrega</h2>
      <p>El costo, modalidad y plazo de envío dependen del tipo de maquinaria, peso, volumen y destino. Estos datos se confirman antes de despachar el equipo.</p>
      <h2>Uso responsable</h2>
      <p>El comprador es responsable de utilizar la maquinaria conforme a sus manuales, capacidad nominal, normas de seguridad y legislación aplicable. La operación debe realizarse por personal capacitado.</p>
      <h2>Contacto</h2>
      <p>Para resolver dudas sobre estas condiciones puede escribir a <a href={`mailto:${COMPANY.emails[1]}`}>{COMPANY.emails[1]}</a>.</p>
    </LegalPage>
  );
}
