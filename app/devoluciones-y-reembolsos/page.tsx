import { LegalPage } from "@/components/legal-page";
import { COMPANY } from "@/lib/company";

export default function ReturnsPage() {
  return (
    <LegalPage title="Devoluciones y Reembolsos">
      <p>Debido a la naturaleza industrial de nuestros equipos, cada solicitud de devolución se revisa de forma individual. Nuestro objetivo es atender incidencias con claridad y ofrecer una solución adecuada.</p>
      <h2>Reporte de incidencias</h2>
      <p>Si un equipo presenta daño visible al recibirlo, repórtelo dentro de las primeras 48 horas posteriores a la entrega. Incluya fotografías, número de pedido y una descripción del problema.</p>
      <h2>Condiciones de devolución</h2>
      <p>Para solicitar devolución, el equipo debe conservar sus componentes, accesorios y documentación. No aplican devoluciones por daños derivados de uso indebido, instalación incorrecta, desgaste normal, modificaciones o operación fuera de especificaciones.</p>
      <h2>Equipos usados o seminuevos</h2>
      <p>Los equipos usados o seminuevos se venden conforme a las condiciones informadas y aceptadas durante la compra. Cualquier garantía o revisión aplicable se indicará expresamente en la cotización.</p>
      <h2>Reembolsos</h2>
      <p>Cuando una devolución sea autorizada, informaremos el procedimiento y plazo estimado. Los costos logísticos podrán descontarse cuando correspondan y se comunicarán antes de procesar el reembolso.</p>
      <h2>Solicitudes</h2>
      <p>Escriba a <a href={`mailto:${COMPANY.emails[1]}`}>{COMPANY.emails[1]}</a> para iniciar una revisión.</p>
    </LegalPage>
  );
}
