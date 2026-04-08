const Message = require("../models/messageModel");

module.exports = (io) => {
  const onlineUsers = {};

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // ================= REGISTER USER =================
    socket.on("register", ({ userId, userType }) => {
      const key = `${userType}_${userId}`;
      onlineUsers[key] = socket.id;

      console.log("Online Users:", onlineUsers);
    });

    // ================= JOIN ROOM =================
    socket.on("joinRoom", ({ senderId, senderType, receiverId, receiverType }) => {

      const roomId = [
        `${senderType}_${senderId}`,
        `${receiverType}_${receiverId}`
      ].sort().join("_");

      socket.join(roomId);

      console.log("Joined Room:", roomId);
    });

    // ================= SEND MESSAGE =================
    socket.on("sendMessage", async (data) => {
      try {
        const {
          senderId,
          senderType,
          receiverId,
          receiverType,
          message
        } = data;

        const roomId = [
          `${senderType}_${senderId}`,
          `${receiverType}_${receiverId}`
        ].sort().join("_");

        // 💾 SAVE IN DB
        const newMsg = await Message.create({
          senderId,
          senderType,
          receiverId,
          receiverType,
          message
        });

        // 📡 SEND TO ROOM
        io.to(roomId).emit("receiveMessage", newMsg);

      } catch (error) {
        console.error("Socket Error:", error.message);
      }
    });

    // ================= DISCONNECT =================
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);

      // remove from onlineUsers
      // for (let key in onlineUsers) {
      //   if (onlineUsers[key] === socket.id) {
      //     delete onlineUsers[key];
      //   }
      // }
    });

  });
};