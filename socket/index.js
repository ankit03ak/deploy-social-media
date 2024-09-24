const io = require("socket.io")(8900, {
    cors: {
        origin: ["http://localhost:3000","https://deploy-social-media-ui1.vercel.app"],
        methods: ["GET", "POST", "PUT", "FETCH"],
        allowedHeaders: ["my-custom-header"],
        credentials: true,
    },
});

let users = [];

const addUser = (userId, socketId) => {
    if (!users.some((user) => user.userId === userId)) {
        users.push({ userId, socketId });
    }
};

const getUser = (userId) => {
    return users.find(user => user.userId === userId);
};

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

io.on("connection", (socket) => {
    console.log("A user connected.");

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
        console.log("A user disconnected.");
        removeUser(socket.id);
        io.emit("getUsers", users);
    });
});
