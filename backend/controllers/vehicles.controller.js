const Vehicle = require("../models/Vehicle");
const fs = require('fs');
const path = require('path');

// Create Vehicle
exports.createVehicle = async (req, res) => {
  try {
    const {
      make,
      model,
      year,
      plate,
      type,
      taxiDoors,
      passengers,
      luggageCarry,
      airCondition,
      gpsNavigation,
      perKmRate,
      extraKmRate,
      description // <-- added description
    } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const existingVehicle = await Vehicle.findOne({ plate });
    if (existingVehicle) {
      return res.status(400).json({ message: "Vehicle with this plate number already exists" });
    }

    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const newVehicle = new Vehicle({
      provider: req.user.id,
      make,
      model,
      year,
      plate,
      type,
      taxiDoors,
      passengers,
      luggageCarry,
      airCondition,
      gpsNavigation,
      perKmRate,
      extraKmRate,
      images,
      description // <-- save description
    });

    const savedVehicle = await newVehicle.save();
    res.json(savedVehicle);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all vehicles
exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().populate("provider", "name email");
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get single vehicle
exports.getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate("provider", "name email");
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update Vehicle
exports.updateVehicle = async (req, res) => {
  try {
    const existingVehicle = await Vehicle.findById(req.params.id);
    if (!existingVehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    // Parse incoming body data
    const updateData = { ...req.body };

    // ✅ Collect old + new images together
    let allImages = [];

    // Old image URLs (from req.body.images) — strings
    if (Array.isArray(req.body.images)) {
      allImages = [...req.body.images];
    } else if (typeof req.body.images === "string") {
      allImages = [req.body.images];
    }

    // New uploaded files (from req.files)
    if (Array.isArray(req.files) && req.files.length > 0) {
      const newFilePaths = req.files.map((file) => `/uploads/${file.filename}`);
      allImages = [...allImages, ...newFilePaths];
    }

    updateData.images = allImages;

    // ✅ No deleting existing images anymore
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    res.json({ message: "Vehicle updated successfully", vehicle });
  } catch (err) {
    console.error("Update vehicle error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// Delete Vehicle
exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    // Delete images
    vehicle.images.forEach(imagePath => {
      const fullPath = path.join(__dirname, '..', imagePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    });

    await Vehicle.findByIdAndDelete(req.params.id);
    res.json({ message: "Vehicle and associated images deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
