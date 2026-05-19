const express = require("express");
const router = express.Router();
const controller = require("../controllers/customerController");
const { updateRole } = require("../controllers/customerController");
const { checkAdminExists } = require("../controllers/customerController");

router.get("/", controller.getAll);
router.get("/check-admin", checkAdminExists);
router.put("/update-role", updateRole);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;