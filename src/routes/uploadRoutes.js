const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const { uploadImage } = require("../controllers/uploadController");
const { authenticateToken } = require("../middlewares/authMiddleware");

router.post("/upload", authenticateToken, upload.single("image"), uploadImage);

module.exports = router;
