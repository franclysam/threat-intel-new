require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const reportRoutes = require("./routes/reportRoutes");
const scanRoutes = require("./routes/scanRoutes");
const rewardRoutes = require("./routes/rewardRoutes");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});
app.set("io", io);

app.use(cors());
app.use(express.json());

// Root route (ADD THIS)
app.get("/", (req, res) => {
  res.send("Threat Intel API running");
});
app.use('/api/scan', scanRoutes)

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/threat-intel")
  .then(() => console.log("MongoDB connected successfully to:", process.env.MONGO_URI ? "Atlas/Remote" : "Localhost"))
  .catch((err) => {
    console.error("MongoDB Connection Error:");
    console.error("Make sure your MONGO_URI is set correctly in your .env or Render dashboard.");
    console.error(err);
  });

// Routes
app.use("/api/reports", reportRoutes);
app.use("/api/rewards", rewardRoutes);

const ChatMessage = require("./models/ChatMessage");

// ... (middleware and routes remain same)

// WebSocket
io.on("connection", async (socket) => {
  console.log("User connected:", socket.id);

  // Send last 50 messages to newly connected client
  try {
    const history = await ChatMessage.find().sort({ timestamp: -1 }).limit(50);
    // History is in reverse chronological order, reverse it for the client
    const formattedHistory = history.reverse().map(msg => ({
      user: msg.sender,
      text: msg.text,
      time: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOfficial: msg.isOfficial,
    }));
    socket.emit("history", formattedHistory);
  } catch (err) {
    console.error("Error fetching chat history:", err);
  }

  socket.on("message", async (msg) => {
    try {
      // Save to Database
      const chatMsg = new ChatMessage({
        sender: msg.user,
        text: msg.text,
        isOfficial: msg.isOfficial || false,
      });
      await chatMsg.save();

      // Broadcast message with generated data
      io.emit("message", {
        user: chatMsg.sender,
        text: chatMsg.text,
        time: new Date(chatMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOfficial: chatMsg.isOfficial,
      });
    } catch (err) {
      console.error("Error saving chat message:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});



const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
