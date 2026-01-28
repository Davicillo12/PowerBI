# Sently MVP (Demo)

Este directorio contiene un prototipo funcional básico del backend y frontend web para Sently.

## Requisitos
- Node.js 18+

## Cómo ejecutar
```bash
npm install
npm run dev
```

Luego abre `http://localhost:3000`.

## Qué incluye
- API en memoria con Express para eventos, invitaciones, chat, regalos con apertura programada y adjuntos.
- Interfaz web estática para crear eventos y enviar regalos.

## Notas
- Los datos viven en memoria: al reiniciar el servidor se pierden.
- Los archivos subidos se guardan en `uploads/`.
