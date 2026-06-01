import { LegalPage } from "@/components/legal-page";
import { COMPANY } from "@/lib/company";

export default function ShippingPage() {
  return (
    <LegalPage title="Política de Envíos">
      <p>{COMPANY.shippingText} Cada entrega se coordina de acuerdo con las características del equipo y el destino solicitado.</p>
      <h2>Cobertura</h2>
      <p>Realizamos envíos dentro de México. La disponibilidad de entrega puede variar según zona, accesibilidad, peso, volumen y maniobras necesarias para descarga.</p>
      <h2>Cotización del envío</h2>
      <p>El costo de envío se cotiza de forma personalizada antes del despacho. En maquinaria pesada, montacargas y equipos voluminosos podremos solicitar información adicional sobre el lugar de entrega.</p>
      <h2>Tiempos de entrega</h2>
      <p>El plazo estimado se confirma al validar disponibilidad y pago. Los tiempos pueden variar por distancia, condiciones logísticas o causas fuera de nuestro control.</p>
      <h2>Recepción</h2>
      <p>El cliente debe revisar el estado exterior del equipo al recibirlo y reportar cualquier daño visible dentro de las primeras 48 horas. Cuando la descarga requiera equipo o maniobras especiales, se acordará previamente.</p>
      <h2>Contacto</h2>
      <p>Para revisar cobertura y costos escriba a <a href={`mailto:${COMPANY.emails[1]}`}>{COMPANY.emails[1]}</a>.</p>
    </LegalPage>
  );
}
