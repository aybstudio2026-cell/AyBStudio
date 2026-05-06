import React from 'react';
import { Link } from 'react-router-dom';

const TermsAndConditionsView = () => {
  return (
    <div className="pt-32 pb-20 min-h-screen bg-studio-bg flex justify-center items-start">
      <div className="w-full max-w-7xl px-4 md:px-10 flex flex-col md:flex-row gap-10 items-start">
        <main className="flex-1 space-y-12">
          <header>
            <p className="text-[10px] font-black text-studio-primary uppercase tracking-[0.4em] mb-2">Legal</p>
            <h1 className="text-5xl font-black text-studio-text-title uppercase italic tracking-tighter">Términos y <span className="text-studio-primary">Condiciones</span></h1>
          </header>

          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-studio-text-title">1. Aceptación de los Términos</h2>
              <p className="text-sm text-studio-secondary leading-relaxed">
                Al acceder y utilizar los servicios de AyBStudio, usted acepta y se compromete a cumplir 
                con los siguientes términos y condiciones. Si no está de acuerdo con alguno de estos términos, 
                le recomendamos que no utilice nuestros servicios.
              </p>
              <p className="text-sm text-studio-secondary leading-relaxed">
                Estos términos pueden ser modificados periódicamente. Le recomendamos revisar esta página 
                regularmente para estar informado de cualquier cambio.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-studio-text-title">2. Descripción de los Servicios</h2>
              <p className="text-sm text-studio-secondary leading-relaxed">
                AyBStudio es una plataforma digital que ofrece:
              </p>
              <ul className="list-disc pl-6 text-sm text-studio-secondary space-y-2">
                <li>Venta de productos digitales y físicos</li>
                <li>Herramientas de desarrollo y diseño</li>
                <li>Servicios de consultoría técnica</li>
                <li>Recursos educativos y tutoriales</li>
                <li>Soporte técnico y atención al cliente</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-studio-text-title">3. Registro y Cuenta de Usuario</h2>
              <p className="text-sm text-studio-secondary leading-relaxed">
                Para acceder a ciertos servicios, deberá crear una cuenta de usuario. Al registrarse, usted:
              </p>
              <ul className="list-disc pl-6 text-sm text-studio-secondary space-y-2">
                <li>Proporcionará información veraz, actualizada y completa</li>
                <li>Es responsable de mantener la confidencialidad de su contraseña</li>
                <li>Acepta la responsabilidad de todas las actividades bajo su cuenta</li>
                <li>Notificará inmediatamente cualquier uso no autorizado de su cuenta</li>
              </ul>
              <p className="text-sm text-studio-secondary leading-relaxed">
                Nos reservamos el derecho de suspender o cancelar cuentas que violen estos términos.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-studio-text-title">4. Propiedad Intelectual</h2>
              <p className="text-sm text-studio-secondary leading-relaxed">
                Todo el contenido disponible en AyBStudio, incluyendo:
              </p>
              <ul className="list-disc pl-6 text-sm text-studio-secondary space-y-2">
                <li>Diseños gráficos y logotipos</li>
                <li>Textos, artículos y tutoriales</li>
                <li>Código fuente y herramientas</li>
                <li>Imágenes y videos</li>
                <li>Base de datos y arquitectura del sitio</li>
              </ul>
              <p className="text-sm text-studio-secondary leading-relaxed">
                Está protegido por derechos de autor y otras leyes de propiedad intelectual. 
                No está permitido copiar, distribuir o modificar nuestro contenido sin autorización expresa.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-studio-text-title">5. Compra de Productos y Servicios</h2>
              <p className="text-sm text-studio-secondary leading-relaxed">
                Al realizar compras en nuestra plataforma, usted acepta:
              </p>
              <ul className="list-disc pl-6 text-sm text-studio-secondary space-y-2">
                <li>Proporcionar información de pago válida</li>
                <li>Pagar el precio completo de los productos seleccionados</li>
                <li>No realizar cargos fraudulentos o no autorizados</li>
              </ul>
              <p className="text-sm text-studio-secondary leading-relaxed">
                Los productos digitales se entregan instantáneamente después del pago confirmado. 
                Los productos físicos se envían según los tiempos de entrega especificados.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-studio-text-title">6. Privacidad y Protección de Datos</h2>
              <p className="text-sm text-studio-secondary leading-relaxed">
                Nos comprometemos a proteger su privacidad de acuerdo con nuestra 
                <Link to="/privacy-policy" className="text-studio-primary hover:underline">
                  {" "}Política de Privacidad
                </Link>. 
                Recopilamos y utilizamos su información personal únicamente para:
              </p>
              <ul className="list-disc pl-6 text-sm text-studio-secondary space-y-2">
                <li>Prestar nuestros servicios</li>
                <li>Mejorar la experiencia del usuario</li>
                <li>Enviar comunicaciones relevantes</li>
                <li>Cumplir con obligaciones legales</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-studio-text-title">7. Conducta del Usuario</h2>
              <p className="text-sm text-studio-secondary leading-relaxed">
                Al utilizar nuestros servicios, usted se compromete a:
              </p>
              <ul className="list-disc pl-6 text-sm text-studio-secondary space-y-2">
                <li>No realizar actividades ilegales o no autorizadas</li>
                <li>No distribuir malware, virus o software malicioso</li>
                <li>No violar la privacidad de otros usuarios</li>
                <li>No enviar spam o comunicaciones no solicitadas</li>
                <li>Respetar los derechos de propiedad intelectual de terceros</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-studio-text-title">8. Limitación de Responsabilidad</h2>
              <p className="text-sm text-studio-secondary leading-relaxed">
                AyBStudio no será responsable por:
              </p>
              <ul className="list-disc pl-6 text-sm text-studio-secondary space-y-2">
                <li>Daños indirectos, incidentales o consecuentes</li>
                <li>Pérdida de datos o información</li>
                <li>Interrupciones del servicio</li>
                <li>Errores técnicos o fallas del sistema</li>
              </ul>
              <p className="text-sm text-studio-secondary leading-relaxed">
                Nuestra responsabilidad máxima se limita al monto pagado por el servicio específico.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-studio-text-title">9. Terminación del Servicio</h2>
              <p className="text-sm text-studio-secondary leading-relaxed">
                Nos reservamos el derecho de:
              </p>
              <ul className="list-disc pl-6 text-sm text-studio-secondary space-y-2">
                <li>Suspender o terminar cuentas que violen estos términos</li>
                <li>Interrumpir temporalmente el servicio por mantenimiento</li>
                <li>Modificar o discontinuar servicios sin previo aviso</li>
              </ul>
              <p className="text-sm text-studio-secondary leading-relaxed">
                Los usuarios pueden cerrar su cuenta en cualquier momento siguiendo el procedimiento 
                establecido en la configuración de su perfil.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-studio-text-title">10. Ley Aplicable y Jurisdicción</h2>
              <p className="text-sm text-studio-secondary leading-relaxed">
                Estos términos se rigen por las leyes del país donde opera AyBStudio. 
                Cualquier disputa será resuelta mediante negociación amistosa o, 
                en su defecto, mediante los tribunales competentes.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-studio-text-title">11. Contacto</h2>
              <p className="text-sm text-studio-secondary leading-relaxed">
                Para ejercer sus derechos de privacidad o hacer preguntas sobre estos términos:
              </p>
              <div className="bg-studio-bg p-4 rounded-xl border border-gray-100">
                <p className="text-sm text-studio-secondary mb-2">
                  <strong>Email:</strong> aybstudio2026@gmail.com
                </p>
                <p className="text-sm text-studio-secondary">
                  <strong>Respuesta:</strong> Dentro de 30 días hábiles
                </p>
              </div>
            </section>
            <div className="pt-6 border-t border-gray-100 space-y-1">
              {/* ✅ MEJORA 2: Ambas fechas visibles */}
              <p className="text-[10px] font-bold text-studio-secondary uppercase tracking-widest text-center">
                Fecha de entrada en vigor: 1 de enero de 2026
              </p>
              <p className="text-[10px] font-bold text-studio-secondary uppercase tracking-widest text-center">
                Última actualización: 6 de mayo de 2026
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TermsAndConditionsView;
