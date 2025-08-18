const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/vehicles.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload");

router.post(
  "/add",
 authMiddleware(['driver']),
  upload.array("images", 5),
  vehicleController.createVehicle
);

router.get("/", vehicleController.getAllVehicles);
router.get("/:id", vehicleController.getVehicleById);
router.put(
  "/:id",
  authMiddleware(['driver']),
  upload.array("images", 5),
  vehicleController.updateVehicle
);
router.delete("/:id", authMiddleware(['driver']), vehicleController.deleteVehicle);

module.exports = router;
