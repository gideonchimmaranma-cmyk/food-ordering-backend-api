const express = require("express");
const {getCategories, createCategory, getCategoryById, updateCategory, deleteCategory} = require("../controllers/categorycontrollers");
const {protect, adminOnly} = require("../middleware/authmiddleware");
const validateObjectId = require("../middleware/validateobjectId");

const router = express.Router();


router.get("/", getCategories);
router.post("/", adminOnly, createCategory);
router.get("/:id", validateObjectId("id"), getCategoryById);
router.put("/:id", adminOnly, validateObjectId("id"), updateCategory);
router.delete("/:id", protect, adminOnly, validateObjectId("id"), deleteCategory);
router.get("/category/:category", validateObjectId("category"), getCategoryById);

module.exports = router;