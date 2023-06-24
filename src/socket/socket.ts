import { Server, Socket } from "socket.io";
import { createServer } from "http";

interface ServerToClient {
  getUser: () => void;
  getMessage: ({ senderId, content }: any) => void;
}

interface ClientToServer {
  sendUser: (userId: string) => void;
  sendMessage: ({ senderId, receiverId, content }: any) => void;
}

const server = createServer();
const io: Server = new Server<ServerToClient, ClientToServer>(server, {
  cors: {
    origin: "https://social-midorishintaro.vercel.app/",
    credentials: true,
  },
});
const port = process.env.SOCKET_PORT || 4000;

let users: any = [];

const storeUser = (userId: string, socketId: string) => {
  const existsUser = users.some((user: any) => user.userId === userId);
  if (!existsUser) {
    users.push({ userId, socketId });
  }
};

const disconnectUser = (socketId: string) => {
  users = users.filter((user: any) => user.socketId !== socketId);
};

const initSocket = () => {
  io.on("connection", (socket: Socket) => {
    console.log("A user connected");

    socket.on("sendUser", (userId: string) => {
      storeUser(userId, socket.id);
      io.emit("getUser", users);
    });

    socket.on("sendMessage", (data: any) => {
      const friend = users?.find((user: any) => user.userId == data.receiverId);
      io.to(friend?.socketId).emit("getMessage", {
        senderId: data.senderId,
        content: data.content,
        image: data.image,
        type: "post",
      });
    });

    socket.on("like", (data: any) => {
      storeUser(data.senderId, socket.id);
      const friend = users?.find((user: any) => user.userId == data.friend._id);
      const user = users?.find((user: any) => user.userId == data.user._id);
      if (data.user._id == user.userId || data.friend._id == friend.userId) {
        io.to(user?.socketId).emit("likeMessage", {
          senderId: data.friend._id,
          messageLike: "liked",
        });
        io.to(friend?.socketId).emit("likeMessage", {
          senderId: data.user._id,
          messageLike: "liked",
        });
      }
    });

    socket.on("dislike", (data: any) => {
      storeUser(data.senderId, socket.id);
      const friend = users?.find((user: any) => user.userId == data.friend._id);
      const user = users?.find((user: any) => user.userId == data.user._id);
      if (data.user._id == user.userId || data.friend._id == friend.userId) {
        io.to(user?.socketId).emit("dislikeMessage", {
          senderId: data.friend._id,
          messageLike: `disliked`,
        });
        io.to(friend?.socketId).emit("dislikeMessage", {
          senderId: data.user._id,
          messageLike: `disliked`,
        });
      }
    });

    socket.on("sendNotification", (data: any) => {
      storeUser(data.senderId, socket.id);
      const friend = users?.find((user: any) => user.userId == data.receiverId);
      if (data.type === "likePost") {
        io.to(friend?.socketId).emit("getNotification", {
          userId: data.userId,
          receiverId: data.receiverId,
          content: data.content,
          id: data.id,
          type: "post",
        });
      } else if (data.type === "follow") {
        io.to(friend?.socketId).emit("getNotification", {
          userId: data.userId,
          receiverId: data.receiverId,
          content: data.content,
          id: data.id,
          type: "user",
        });
      } else if (data.type === "comment") {
        io.to(friend?.socketId).emit("getNotification", {
          userId: data.userId,
          receiverId: data.receiverId,
          content: data.content,
          id: data.id,
          type: "post",
        });
      } else if (data.type === "likeComment") {
        io.to(friend?.socketId).emit("getNotification", {
          userId: data.userId,
          receiverId: data.receiverId,
          content: data.content,
          id: data.id,
          type: "post",
        });
      }
    });

    socket.on("sendComment", (data) => {
      io.emit("getComment", data);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
      disconnectUser(socket.id);
    });
  });
};

server.listen(port, () => {
  console.log(`Socket running on port ${port}`);
});

export default initSocket;
