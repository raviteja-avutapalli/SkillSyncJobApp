const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");

router.get("/", blogController.getAllBlogs);
router.post("/", blogController.addBlog);
router.delete("/:id", blogController.deleteBlog);


module.exports = router;
