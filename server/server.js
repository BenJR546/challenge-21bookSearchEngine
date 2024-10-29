// server/server.js
require("dotenv").config();
const express = require("express");
const path = require("path");
const db = require("./config/connection");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Serve static assets from the 'build' directory
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/build")));
}

// Add routes
app.use(routes);

// Fallback route handler for client-side routing
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

db.once("open", () => {
    app.listen(PORT, () =>
        console.log(`🌍 Now listening on localhost:${PORT}`)
    );
});
