const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { randomUUID } = require("crypto");
const { store } = require("./data/store");

const app = express();
const PORT = process.env.PORT || 3000;
const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 25 * 1024 * 1024 }
});

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const findEvent = (eventId) => store.events.find((event) => event.id === eventId);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/events", (req, res) => {
  res.json(store.events);
});

app.post("/api/events", (req, res) => {
  const { title, description, dateTime, location, privacy, hostName } = req.body;

  if (!title || !dateTime) {
    return res.status(400).json({ error: "Title and dateTime are required." });
  }

  const event = {
    id: randomUUID(),
    title,
    description: description || "",
    dateTime,
    location: location || "",
    privacy: privacy || "private",
    hostName: hostName || "",
    createdAt: new Date().toISOString()
  };

  store.events.push(event);
  res.status(201).json(event);
});

app.get("/api/events/:eventId", (req, res) => {
  const event = findEvent(req.params.eventId);

  if (!event) {
    return res.status(404).json({ error: "Event not found." });
  }

  res.json(event);
});

app.post("/api/events/:eventId/invitations", (req, res) => {
  const event = findEvent(req.params.eventId);

  if (!event) {
    return res.status(404).json({ error: "Event not found." });
  }

  const { inviteeName, status } = req.body;

  if (!inviteeName) {
    return res.status(400).json({ error: "inviteeName is required." });
  }

  const invitation = {
    id: randomUUID(),
    eventId: event.id,
    inviteeName,
    status: status || "pending",
    respondedAt: null
  };

  store.invitations.push(invitation);
  res.status(201).json(invitation);
});

app.get("/api/events/:eventId/invitations", (req, res) => {
  const invitations = store.invitations.filter(
    (invitation) => invitation.eventId === req.params.eventId
  );
  res.json(invitations);
});

app.patch("/api/invitations/:invitationId", (req, res) => {
  const invitation = store.invitations.find(
    (item) => item.id === req.params.invitationId
  );

  if (!invitation) {
    return res.status(404).json({ error: "Invitation not found." });
  }

  const { status } = req.body;

  invitation.status = status || invitation.status;
  invitation.respondedAt = new Date().toISOString();
  res.json(invitation);
});

app.post("/api/events/:eventId/messages", (req, res) => {
  const event = findEvent(req.params.eventId);

  if (!event) {
    return res.status(404).json({ error: "Event not found." });
  }

  const { author, content } = req.body;

  if (!author || !content) {
    return res.status(400).json({ error: "author and content are required." });
  }

  const message = {
    id: randomUUID(),
    eventId: event.id,
    author,
    content,
    createdAt: new Date().toISOString()
  };

  store.messages.push(message);
  res.status(201).json(message);
});

app.get("/api/events/:eventId/messages", (req, res) => {
  const messages = store.messages.filter(
    (message) => message.eventId === req.params.eventId
  );
  res.json(messages);
});

app.post("/api/events/:eventId/gifts", (req, res) => {
  const event = findEvent(req.params.eventId);

  if (!event) {
    return res.status(404).json({ error: "Event not found." });
  }

  const { sender, recipient, note, openAt, assetUrl } = req.body;

  if (!sender || !recipient || !openAt) {
    return res
      .status(400)
      .json({ error: "sender, recipient, and openAt are required." });
  }

  const gift = {
    id: randomUUID(),
    eventId: event.id,
    sender,
    recipient,
    note: note || "",
    assetUrl: assetUrl || "",
    openAt,
    createdAt: new Date().toISOString()
  };

  store.gifts.push(gift);
  res.status(201).json(gift);
});

app.get("/api/events/:eventId/gifts", (req, res) => {
  const now = new Date();
  const gifts = store.gifts
    .filter((gift) => gift.eventId === req.params.eventId)
    .map((gift) => {
      const canOpen = now >= new Date(gift.openAt);
      return {
        ...gift,
        locked: !canOpen,
        assetUrl: canOpen ? gift.assetUrl : "",
        note: canOpen ? gift.note : ""
      };
    });

  res.json(gifts);
});

app.post("/api/events/:eventId/attachments", upload.single("file"), (req, res) => {
  const event = findEvent(req.params.eventId);

  if (!event) {
    return res.status(404).json({ error: "Event not found." });
  }

  if (!req.file) {
    return res.status(400).json({ error: "file is required." });
  }

  const attachment = {
    id: randomUUID(),
    eventId: event.id,
    originalName: req.file.originalname,
    fileName: req.file.filename,
    mimeType: req.file.mimetype,
    size: req.file.size,
    uploadedAt: new Date().toISOString()
  };

  store.attachments.push(attachment);
  res.status(201).json(attachment);
});

app.get("/api/events/:eventId/attachments", (req, res) => {
  const attachments = store.attachments.filter(
    (attachment) => attachment.eventId === req.params.eventId
  );
  res.json(attachments);
});

app.get("/api/attachments/:attachmentId/download", (req, res) => {
  const attachment = store.attachments.find(
    (item) => item.id === req.params.attachmentId
  );

  if (!attachment) {
    return res.status(404).json({ error: "Attachment not found." });
  }

  res.download(path.join(uploadDir, attachment.fileName), attachment.originalName);
});

app.listen(PORT, () => {
  console.log(`Sently server running on http://localhost:${PORT}`);
});
