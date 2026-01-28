# Sently — Especificación de producto

## Visión
Sently es una app social para organizar eventos (cumpleaños, quedadas, cenas, planes de ocio) donde los usuarios puedan **crear eventos**, **invitar**, **confirmar asistencia**, **chatear**, y **enviar regalos digitales** con apertura programada (time-locked). Además, permite adjuntar documentos, fotos, música y otros archivos relevantes.

## Objetivos clave
- Hacer **simple** la organización de eventos personales.
- Crear una experiencia **emocional** con regalos que se abren en una fecha y hora específicas.
- Centralizar la comunicación del evento con chat y confirmaciones.

## Público objetivo
- Personas que organizan eventos casuales (amigos, familia, parejas).
- Usuarios que desean sorprender con regalos digitales programados.

---

## Funcionalidades principales (MVP)
1. **Gestión de eventos**
   - Crear evento: título, descripción, fecha/hora, lugar, privacidad.
   - Invitaciones por enlace o lista de contactos.
   - Confirmación de asistencia (Sí/No/Tal vez).

2. **Chat del evento**
   - Mensajería en tiempo real para todos los invitados.
   - Notificaciones push.

3. **Regalos con apertura programada**
   - Enviar regalos digitales (entradas, cupones, PDFs, tarjetas regalo).
   - El receptor **no puede abrir** el regalo hasta la fecha/hora marcada.
   - Mensaje personalizado del remitente.

4. **Adjuntos**
   - Subida de fotos, música, documentos.
   - Acceso según permisos del evento.

---

## Funcionalidades avanzadas (Post-MVP)
- Integraciones con proveedores de entradas (teatro, conciertos).
- Listas de deseos del cumpleañero.
- Pagos integrados para regalos en grupo.
- Álbum colaborativo del evento.

---

## Flujos principales de usuario
### 1) Crear evento
1. Abrir app → “Nuevo evento”.
2. Completar datos (título, fecha, lugar, descripción).
3. Elegir privacidad.
4. Invitar contactos o generar enlace.
5. Publicar evento.

### 2) Enviar regalo programado
1. Entrar a un evento.
2. Seleccionar “Enviar regalo”.
3. Subir archivo o comprar producto digital.
4. Elegir fecha/hora de apertura.
5. Enviar.

### 3) Confirmar asistencia
1. Recibir invitación.
2. Ver detalles del evento.
3. Responder Sí/No/Tal vez.

---

## Modelo de datos (alto nivel)
### Usuario
- id
- nombre
- email
- avatar
- contactos

### Evento
- id
- título
- descripción
- fecha_hora
- lugar
- creador_id
- privacidad

### Invitación
- id
- evento_id
- usuario_id
- estado (Sí/No/Tal vez)

### Mensaje
- id
- evento_id
- usuario_id
- contenido
- timestamp

### Regalo
- id
- evento_id
- remitente_id
- destinatario_id
- archivo_url
- fecha_apertura
- estado (bloqueado / abierto)

### Archivo
- id
- evento_id
- usuario_id
- tipo
- url

---

## Seguridad y privacidad
- Archivos encriptados en almacenamiento.
- Acceso condicionado por permisos del evento.
- Regalos “time-locked” con control de acceso por servidor.

---

## Experiencia de UI (ideas)
- **Home:** lista de eventos activos y próximos.
- **Evento:** pestañas: Detalles, Chat, Invitados, Regalos.
- **Regalos:** caja cerrada que se “desbloquea” en la fecha programada.

---

## Roadmap sugerido
1. **MVP**: eventos + invitaciones + chat + regalos programados.
2. **V1**: integraciones de pagos y compras digitales.
3. **V2**: marketplace de regalos + álbumes colaborativos.

---

## Tecnologías recomendadas
- **Frontend móvil**: React Native / Flutter.
- **Backend**: Node.js + PostgreSQL.
- **Tiempo real**: WebSockets.
- **Almacenamiento archivos**: S3-compatible.
- **Notificaciones**: Firebase / OneSignal.

---

## Próximos pasos
- Validar MVP con usuarios objetivo.
- Definir branding y diseño UI.
- Prototipo en Figma.
- Desarrollo iterativo.
