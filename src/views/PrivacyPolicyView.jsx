import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicyView = () => {
  return (
    <div className="pt-32 pb-20 min-h-screen bg-studio-bg flex justify-center items-start">
      <div className="w-full max-w-7xl px-4 md:px-10 flex flex-col md:flex-row gap-10 items-start">
        <main className="flex-1 space-y-12">
          <header>
            <p className="text-[10px] font-black text-studio-primary uppercase tracking-[0.4em] mb-2">Legal</p>
            <h1 className="text-5xl font-black text-studio-text-title uppercase italic tracking-tighter">Política de <span className="text-studio-primary">Privacidad</span></h1>
            {/* ✅ MEJORA 2: Fecha de entrada en vigor */}
            <p className="text-xs text-studio-secondary mt-3">
              <strong>Fecha de entrada en vigor:</strong> 1 de enero de 2025
            </p>
          </header>

          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-studio-text-title">1. Información que Recopilamos</h2>
              <p className="text-sm text-studio-secondary leading-relaxed">
                Recopilamos información personal cuando usted crea una cuenta, realiza compras o interactúa con nuestros servicios:
              </p>
              <ul className="list-disc pl-6 text-sm text-studio-secondary space-y-2">
                <li>Nombre completo y dirección de correo electrónico</li>
                <li>Información de pago y facturación</li>
                <li>Dirección de envío (para productos físicos)</li>
                <li>Historial de compras y descargas</li>
                <li>Dirección IP y datos de navegación</li>
                <li>Preferencias y configuraciones de usuario</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-studio-text-title">2. Cómo Usamos su Información</h2>
              <p className="text-sm text-studio-secondary leading-relaxed">
                Utilizamos su información personal para:
              </p>
              <ul className="list-disc pl-6 text-sm text-studio-secondary space-y-2">
                <li>Procesar sus pedidos y entregas</li>
                <li>Proporcionar soporte técnico</li>
                <li>Mejorar nuestros productos y servicios</li>
                <li>Enviar comunicaciones importantes sobre su cuenta</li>
                <li>Personalizar su experiencia en nuestra plataforma</li>
                <li>Cumplir con obligaciones legales y fiscales</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-studio-text-title">3. Compartición de Información</h2>
              <p className="text-sm text-studio-secondary leading-relaxed">
                No vendemos, alquilamos ni compartimos su información personal con terceros para fines comerciales, excepto:
              </p>
              <ul className="list-disc pl-6 text-sm text-studio-secondary space-y-2">
                <li>Proveedores de pago para procesar transacciones</li>
                <li>Servicios de envío para entregar productos físicos</li>
                <li>Autoridades gubernamentales cuando sea requerido por ley</li>
                <li>Proveedores de servicios técnicos bajo confidencialidad</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-studio-text-title">4. Almacenamiento y Seguridad</h2>
              <p className="text-sm text-studio-secondary leading-relaxed">
                Implementamos medidas de seguridad apropiadas para proteger su información:
              </p>
              <ul className="list-disc pl-6 text-sm text-studio-secondary space-y-2">
                <li>Cifrado de datos sensibles</li>
                <li>Acceso restringido a información personal</li>
                <li>Monitoreo constante de actividades sospechosas</li>
                <li>Actualizaciones regulares de sistemas de seguridad</li>
                <li>Copias de seguridad seguras de datos importantes</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-studio-text-title">5. Cookies y Tecnologías de Seguimiento</h2>
              <p className="text-sm text-studio-secondary leading-relaxed">
                Utilizamos cookies y tecnologías similares para:
              </p>
              <ul className="list-disc pl-6 text-sm text-studio-secondary space-y-2">
                <li>Mantener su sesión activa</li>
                <li>Recordar sus preferencias</li>
                <li>Analizar el uso de nuestro sitio</li>
                <li>Mejorar el rendimiento y la experiencia del usuario</li>
              </ul>
              <p className="text-sm text-studio-secondary leading-relaxed">
                Puede administrar las cookies a través de la configuración de su navegador.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-studio-text-title">6. Google AdSense y Publicidad</h2>
              <p className="text-sm text-studio-secondary leading-relaxed">
                Utilizamos Google AdSense para mostrar anuncios en nuestro sitio. Esto implica:
              </p>
              <ul className="list-disc pl-6 text-sm text-studio-secondary space-y-2">
                <li>Uso de cookies de publicidad de Google</li>
                <li>Recopilación de datos sobre intereses y comportamiento de navegación</li>
                <li>Personalización de anuncios basada en sus preferencias</li>
                <li>Seguimiento de interacciones con anuncios mostrados</li>
              </ul>
              <p className="text-sm text-studio-secondary leading-relaxed">
                Google puede utilizar estos datos para mostrar anuncios relevantes en otros sitios web 
                que visite. Puede desactivar la personalización de anuncios visitando:
              </p>
              <div className="bg-studio-bg p-4 rounded-xl border border-gray-100 space-y-2">
                <p className="text-sm text-studio-secondary">
                  <strong>Configuración de anuncios de Google:</strong> 
                  <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-studio-primary hover:underline ml-2">
                    adssettings.google.com
                  </a>
                </p>
                <p className="text-sm text-studio-secondary">
                  <strong>Política de privacidad de Google:</strong> 
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-studio-primary hover:underline ml-2">
                    policies.google.com/privacy
                  </a>
                </p>
              </div>
              <p className="text-sm text-studio-secondary leading-relaxed">
                Tenga en cuenta que al desactivar las cookies de publicidad, 
                seguirá viendo anuncios, pero estos no serán personalizados según sus intereses.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-studio-text-title">7. Derechos del Usuario</h2>
              <p className="text-sm text-studio-secondary leading-relaxed">
                Usted tiene derecho a:
              </p>
              <ul className="list-disc pl-6 text-sm text-studio-secondary space-y-2">
                <li>Acceder a su información personal</li>
                <li>Corregir datos incorrectos o incompletos</li>
                <li>Solicitar eliminación de su información</li>
                <li>Limitar el procesamiento de sus datos</li>
                <li>Portar sus datos a otro servicio</li>
                <li>Oponerse al procesamiento de información</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-studio-text-title">8. Retención de Datos</h2>
              <p className="text-sm text-studio-secondary leading-relaxed">
                Conservamos su información personal solo durante el tiempo necesario para:
              </p>
              <ul className="list-disc pl-6 text-sm text-studio-secondary space-y-2">
                <li>Cumplir con los fines para los que fue recopilada</li>
                <li>Satisfacer requisitos legales y fiscales</li>
                <li>Resolver disputas y proteger nuestros derechos</li>
                <li>Mantener registros comerciales necesarios</li>
              </ul>
              <p className="text-sm text-studio-secondary leading-relaxed">
                Los datos de cuentas inactivas pueden ser eliminados después de 2 años.
              </p>
            </section>

            {/* ✅ MEJORA 1: Cambiado de 13 a 18 años */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-studio-text-title">9. Menores de Edad</h2>
              <p className="text-sm text-studio-secondary leading-relaxed">
                Nuestros servicios no están dirigidos a menores de 18 años. 
                No recopilamos intencionadamente información de menores. 
                Si descubrimos que hemos recopilado información de un menor de 18 años, 
                tomaremos medidas para eliminarla inmediatamente. Si usted es padre o tutor 
                y cree que su hijo nos ha proporcionado información personal, contáctenos 
                a aybstudio2026@gmail.com.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-studio-text-title">10. Transferencias Internacionales</h2>
              <p className="text-sm text-studio-secondary leading-relaxed">
                Su información puede ser transferida y procesada en servidores ubicados 
                en diferentes países. Nos aseguramos de que todas las transferencias 
                cumplan con las leyes de protección de datos aplicables y mantengan 
                el mismo nivel de seguridad.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-studio-text-title">11. Cambios en esta Política</h2>
              <p className="text-sm text-studio-secondary leading-relaxed">
                Podemos actualizar esta política de privacidad periódicamente. 
                Le notificaremos cualquier cambio importante a través de:
              </p>
              <ul className="list-disc pl-6 text-sm text-studio-secondary space-y-2">
                <li>Correo electrónico a su dirección registrada</li>
                <li>Notificaciones en nuestra plataforma</li>
                <li>Publicación en esta página con fecha de actualización</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-studio-text-title">12. Contacto para Privacidad</h2>
              <p className="text-sm text-studio-secondary leading-relaxed">
                Para ejercer sus derechos de privacidad o hacer preguntas sobre esta política:
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

export default PrivacyPolicyView;