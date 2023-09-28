require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");
const Post = require("./models/Post");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
    origin: ['http://localhost:3000'],
    credentials: true
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.static("uploads"));

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", (err) => {
    console.error("MongoDB connection error:", err);
});
  
db.once("open", () => {
    console.log("MongoDB connection successfully established");
});


app.post("/register", (req, res) => {
    try {
        let { username, password } = req.body;
        if (username.length < 4 || password.length < 6) {
            throw new Error("The username must be at least 4 characters and the password must be at least 6 characters.");
        }
        bcrypt.hash(password, 10)
            .then((hash) => {
                password = hash;
                User.create({ username, password })
                    .then(() => {
                        res.status(200).send("User created successfully");
                    })
                    .catch((err) => {
                        res.status(400).send(err.message);
                    });
            })
            .catch((err) => {
                throw new Error("An error occurred while hashing the password.");
            });
    }
    catch (err) {
        res.status(400).send(err.message);
    }
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const userDoc = await User.findOne({ username });
    if (!userDoc) {
        res.status(400).send("User not found.");
        return;
    }
    bcrypt.compare(password, userDoc.password)
        .then((match) => {
            if (!match) {
                res.status(400).send("Wrong password.");
            }
            else{
                jwt.sign({ username, id: userDoc._id }, process.env.JWT_SECRET, { expiresIn: "1h"}, (err, token) => {
                    if (err) 
                        throw err;
                    else {
                        res.cookie("token", token, { httpOnly: true, sameSite: 'None', secure: true });
                        res.status(200).send("Login successful.");
                    }
                });
            }
        })
        .catch((err) => {
            res.status(400).send(err.message);
        });
});

app.get("/profile", (req, res) => {
    const token = req.cookies.token;
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            res.status(400).send(err.message);
        }
        else {
            res.status(200).send(decoded);
        }
    });
});

app.post("/logout", (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).send("Logout successful.");
});

app.post("/post", upload.single("file"), async (req, res) => {
    const {originalname } = req.file;
    const parts = originalname.split(".");
    const extension = parts[parts.length - 1];
    fs.renameSync(req.file.path, `${req.file.path}.${extension}`);
    const { title, summary, content } = req.body;

    const { token } = req.cookies;
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            res.status(400).send(err.message);
        }
        else {
            const response = await Post.create({ 
                title, 
                summary, 
                content, 
                image: `${req.file.filename}.${extension}`, 
                author: decoded.id
            })
                .then(() => {
                    res.status(200).send("Post created successfully");
                })
                .catch((err) => {
                    res.status(400).send(err.message);
                });
        }
    });
});

app.get("/post", async (req, res) => {
    const posts = await Post.find().populate("author", ["username"]).sort({ createdAt: -1 });
    if (!posts) {
        res.status(400).send("Posts not found.");
        return;
    }
    res.status(200).send(posts);
});

app.get("/post/:id", async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id).populate("author", ["username"]);
    if (!post) {
        res.status(400).send("Post not found.");
        return;
    }
    res.status(200).send(post);
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});