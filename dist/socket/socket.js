"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const urlClient = process.env.URL_CLIENT;
const server = (0, http_1.createServer)();
const io = new socket_io_1.Server(server, {
    cors: {
        origin: urlClient,
        credentials: true,
    },
});
const port = process.env.SOCKET_PORT || 4000;
let users = [];
const storeUser = (userId, socketId) => {
    const existsUser = users.some((user) => user.userId === userId);
    if (!existsUser) {
        users.push({ userId, socketId });
    }
};
const disconnectUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};
const initSocket = () => {
    io.on("connection", (socket) => {
        console.log("A user connected");
        socket.on("sendUser", (userId) => {
            storeUser(userId, socket.id);
            io.emit("getUser", users);
        });
        socket.on("sendMessage", (data) => {
            const friend = users === null || users === void 0 ? void 0 : users.find((user) => user.userId == data.receiverId);
            io.to(friend === null || friend === void 0 ? void 0 : friend.socketId).emit("getMessage", {
                senderId: data.senderId,
                content: data.content,
                image: data.image,
                type: "post",
            });
        });
        socket.on("like", (data) => {
            storeUser(data.senderId, socket.id);
            const friend = users === null || users === void 0 ? void 0 : users.find((user) => user.userId == data.friend._id);
            const user = users === null || users === void 0 ? void 0 : users.find((user) => user.userId == data.user._id);
            if (data.user._id == user.userId || data.friend._id == friend.userId) {
                io.to(user === null || user === void 0 ? void 0 : user.socketId).emit("likeMessage", {
                    senderId: data.friend._id,
                    messageLike: "liked",
                });
                io.to(friend === null || friend === void 0 ? void 0 : friend.socketId).emit("likeMessage", {
                    senderId: data.user._id,
                    messageLike: "liked",
                });
            }
        });
        socket.on("dislike", (data) => {
            storeUser(data.senderId, socket.id);
            const friend = users === null || users === void 0 ? void 0 : users.find((user) => user.userId == data.friend._id);
            const user = users === null || users === void 0 ? void 0 : users.find((user) => user.userId == data.user._id);
            if (data.user._id == user.userId || data.friend._id == friend.userId) {
                io.to(user === null || user === void 0 ? void 0 : user.socketId).emit("dislikeMessage", {
                    senderId: data.friend._id,
                    messageLike: `disliked`,
                });
                io.to(friend === null || friend === void 0 ? void 0 : friend.socketId).emit("dislikeMessage", {
                    senderId: data.user._id,
                    messageLike: `disliked`,
                });
            }
        });
        socket.on("sendNotification", (data) => {
            storeUser(data.senderId, socket.id);
            const friend = users === null || users === void 0 ? void 0 : users.find((user) => user.userId == data.receiverId);
            if (data.type === "likePost") {
                io.to(friend === null || friend === void 0 ? void 0 : friend.socketId).emit("getNotification", {
                    userId: data.userId,
                    receiverId: data.receiverId,
                    content: data.content,
                    id: data.id,
                    type: "post",
                });
            }
            else if (data.type === "follow") {
                io.to(friend === null || friend === void 0 ? void 0 : friend.socketId).emit("getNotification", {
                    userId: data.userId,
                    receiverId: data.receiverId,
                    content: data.content,
                    id: data.id,
                    type: "user",
                });
            }
            else if (data.type === "comment") {
                io.to(friend === null || friend === void 0 ? void 0 : friend.socketId).emit("getNotification", {
                    userId: data.userId,
                    receiverId: data.receiverId,
                    content: data.content,
                    id: data.id,
                    type: "post",
                });
            }
            else if (data.type === "likeComment") {
                io.to(friend === null || friend === void 0 ? void 0 : friend.socketId).emit("getNotification", {
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
exports.default = initSocket;
//# sourceMappingURL=socket.js.map