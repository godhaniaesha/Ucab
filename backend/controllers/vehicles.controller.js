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
    const updateData = { ...req.body }; 
 
    const existingVehicle = await Vehicle.findById(req.params.id); 
    if (!existingVehicle) { 
      return res.status(404).json({ message: "Vehicle not found" }); 
    } 
 
    // Parse existing images from frontend
    let existingImages = [];
    if (req.body.existingImages) {
      try {
        existingImages = JSON.parse(req.body.existingImages);
      } catch (err) {
        console.error("Error parsing existingImages:", err);
        existingImages = [];
      }
    }

    // Get new uploaded files
    const newImages = req.files?.length > 0 
      ? req.files.map((file) => `/uploads/${file.filename}`)
      : [];

    // Find images to delete (old images that are NOT in existingImages)
    const imagesToDelete = existingVehicle.images.filter(
      (oldImage) => !existingImages.includes(oldImage)
    );

    // Delete removed images from filesystem
    if (imagesToDelete.length > 0) {
      imagesToDelete.forEach((imagePath) => {
        if (!imagePath) return;

        const fullPath = path.join(__dirname, '..', imagePath);
        console.log("Attempting to delete:", fullPath);

        if (fs.existsSync(fullPath) && fs.lstatSync(fullPath).isFile()) {
          try {
            fs.unlinkSync(fullPath);
            console.log("Successfully deleted:", fullPath);
          } catch (err) {
            console.error("Failed to delete file:", fullPath, err);
          }
        } else {
          console.warn("Skipping non-file path:", fullPath);
        }
      });
    }

    // Combine existing images + new images
    updateData.images = [...existingImages, ...newImages];

    // Remove existingImages from updateData (it was just a helper field)
    delete updateData.existingImages;

    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true }
    ); 
 
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
