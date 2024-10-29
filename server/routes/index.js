const router = require("express").Router();
const path = require("path");
const apiRoutes = require("./api");

router.use("/api", apiRoutes);

// server/routes/index.js
router.get("/*", (req, res) => {
    if (req.path.includes(".")) {
        // It's a file, let express.static handle it
        return;
    } else {
        res.sendFile(path.join(__dirname, "../../client/build/index.html"));
    }
});

module.exports = router;
