const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const app = express();
const cors = require("cors")
const multer = require("multer")

const path = require("path")

const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const ConversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");
const searchRoute = require("./routes/search");

app.use(express.json())
app.use(cors({
    origin: [
        "https://deploy-social-media-ui1.vercel.app",
        "http://localhost:3000" 
    ],
    credentials: true 
}));

const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, "public/images");
    },
    filename : (req, file, cb) => {
        const fileName = Date.now() + "_" + file.originalname;
        cb(null, fileName);
    },

})

const upload = multer({storage})

app.post("/api/upload", upload.single("file"), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded." });
        }
        const fileName = req.file.filename;
        return res.status(200).json({ fileName });
    } catch (error) {
        console.error("Upload Error:", error.message);
        return res.status(500).json({ message: "File upload failed." });
    }
});



dotenv.config();
const url = process.env.MONGO_URL;
mongoose.connect(`${url}`,)
    .then(()=> console.log("Connected to MongoDB"))
    .catch(error => console.log("MongoDB connection error"));


app.use("/images", express.static(path.join(__dirname, "public/images")));


//middlewares

app.use(helmet())
app.use(morgan("common"))
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/conversations", ConversationRoute);
app.use("/api/messages", messageRoute);
app.use("/api/search", searchRoute);

// app.get('/', (req, res) => {
//     res.send('Welcome to the API');
//   });
  


app.listen(8800,() =>{
    console.log(`Server is running `)
})