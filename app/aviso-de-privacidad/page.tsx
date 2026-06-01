import { LegalPage } from "@/components/legal-page";
import { COMPANY } from "@/lib/company";

export default function PrivacyPage() {
  return (
    <LegalPage title="Aviso de Privacidad">
      <p>{COMPANY.name}, con atención en {COMPANY.location}, es responsable del tratamiento y protección de los datos personales que proporciona mediante este sitio web.</p>
      <h2>Datos que recopilamos</h2>
      <p>Podemos solicitar nombre, correo electrónico, teléfono, dirección de entrega, ciudad, estado, código postal y método de contacto preferido. Para pagos con tarjeta, los datos sensibles se procesarán mediante la plataforma segura de Conekta; no almacenamos números completos de tarjeta.</p>
      <h2>Finalidades</h2>
      <p>Utilizamos sus datos para responder solicitudes, elaborar cotizaciones, gestionar pedidos, coordinar entregas, emitir facturas cuando se soliciten y brindar atención antes y después de la compra.</p>
      <h2>Transferencias y conservación</h2>
      <p>Podemos compartir la información estrictamente necesaria con proveedores de pago, logística o servicios relacionados con su pedido. Conservaremos los datos durante el tiempo necesario para atender la operación y cumplir obligaciones legales.</p>
      <h2>Derechos ARCO</h2>
      <p>Puede solicitar acceso, rectificación, cancelación u oposición al tratamiento de sus datos escribiendo a <a href={`mailto:${COMPANY.emails[0]}`}>{COMPANY.emails[0]}</a>. Indique su nombre, medio de contacto y la solicitud concreta.</p>
      <h2>Actualizaciones</h2>
      <p>Este aviso puede actualizarse para reflejar cambios operativos o legales. La versión vigente estará disponible permanentemente en esta página.</p>
    </LegalPage>
  );
}
