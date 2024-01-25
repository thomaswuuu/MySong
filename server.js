const express = require("express");
const session = require("express-session");
const path = require("path");
const connectDB = require("./config/db");
const indexRoutes = require("./routes/index");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 600000 },
  })
);
app.use(express.static(path.join(__dirname, "public")));

// Connect to database
connectDB();

// Route setting
app.use("/", indexRoutes);
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

// Port binding
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});
