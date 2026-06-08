import { LegalPage } from "@/components/legal-page";
import { COMPANY } from "@/lib/company";

export default function PrivacyPage() {
  return (
    <LegalPage title="Aviso de Privacidad">
      <p>{COMPANY.name}, con atencion en {COMPANY.location}, es responsable del tratamiento y proteccion de los datos personales que proporciona mediante este sitio web.</p>
      <h2>Datos que recopilamos</h2>
      <p>Podemos solicitar nombre, correo electronico, telefono, direccion de entrega, ciudad, estado, codigo postal y metodo de contacto preferido. Para pagos, los datos sensibles se procesaran mediante Stripe Checkout; no almacenamos numeros completos de tarjeta.</p>
      <h2>Finalidades</h2>
      <p>Utilizamos sus datos para responder solicitudes, elaborar cotizaciones, gestionar pedidos, coordinar entregas, emitir facturas cuando se soliciten y brindar atencion antes y despues de la compra.</p>
      <h2>Transferencias y conservacion</h2>
      <p>Podemos compartir la informacion estrictamente necesaria con proveedores de pago, logistica o servicios relacionados con su pedido. Conservaremos los datos durante el tiempo necesario para atender la operacion y cumplir obligaciones legales.</p>
      <h2>Derechos ARCO</h2>
      <p>Puede solicitar acceso, rectificacion, cancelacion u oposicion al tratamiento de sus datos escribiendo a <a href={`mailto:${COMPANY.emails[0]}`}>{COMPANY.emails[0]}</a>. Indique su nombre, medio de contacto y la solicitud concreta.</p>
      <h2>Actualizaciones</h2>
      <p>Este aviso puede actualizarse para reflejar cambios operativos o legales. La version vigente estara disponible permanentemente en esta pagina.</p>
    </LegalPage>
  );
}
