const allowedOrigins = [
    "https://deploy-social-media-ui1.vercel.app",
    "http://localhost:3000",
    process.env.CLIENT_URL,
].filter(Boolean);

const io = require("socket.io")(8900, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST", "PUT", "FETCH"],
        allowedHeaders: ["my-custom-header"],
        credentials: true,
    },
});

let users = [];

const normalizeId = (id) => (id == null ? "" : String(id));

const addUser = (userId, socketId) => {
    const normalizedUserId = normalizeId(userId);
    const existingUser = users.find((user) => user.userId === normalizedUserId);

    if (existingUser) {
        existingUser.socketId = socketId;
    } else {
        users.push({ userId: normalizedUserId, socketId });
    }
};

const getUser = (userId) => {
    return users.find((user) => user.userId === normalizeId(userId));
};

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

io.on("connection", (socket) => {
    // console.log("A user connected.");

    socket.on("addUser", (userId) => {
        addUser(userId, socket.id);
        io.emit("getUsers", users);
    });

    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        const user = getUser(receiverId);
        if (user) {
            io.to(user.socketId).emit("getMessage", {
                senderId,
                text,
            });
        }
    });

    socket.on("disconnect", () => {
        // console.log("A user disconnected.");
        removeUser(socket.id);
        io.emit("getUsers", users);
    });
});
