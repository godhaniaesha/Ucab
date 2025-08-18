const Vehicle = require("../models/Vehicle");

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
    } = req.body;

    // Check if user is authenticated and has ID
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Check if vehicle with same plate number already exists
    const existingVehicle = await Vehicle.findOne({ plate });
    if (existingVehicle) {
      return res.status(400).json({ message: "Vehicle with this plate number already exists" });
    }

    // Get image paths from multer uploaded files
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const newVehicle = new Vehicle({
      provider: req.user.id, // Get provider ID from logged in user
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
      images
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
    const vehicle = await Vehicle.findById(req.params.id).populate(
      "provider",
      "name email"
    );
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

    // Get existing vehicle to access old images
    const existingVehicle = await Vehicle.findById(req.params.id);
    if (!existingVehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    if (req.files && req.files.length > 0) {
      // Delete old images from directory
      const fs = require('fs');
      const path = require('path');
      
      existingVehicle.images.forEach(imagePath => {
        const fullPath = path.join(__dirname, '..', imagePath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });

      // Add new image paths
      updateData.images = req.files.map((file) => `/uploads/${file.filename}`);
    }

    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    res.json({ message: "Vehicle updated successfully", vehicle });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Vehicle
exports.deleteVehicle = async (req, res) => {
  try {
    // Get vehicle before deleting to access images
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    // Delete images from directory
    const fs = require('fs');
    const path = require('path');
    
    vehicle.images.forEach(imagePath => {
      const fullPath = path.join(__dirname, '..', imagePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    });

    // Delete vehicle from database
    await Vehicle.findByIdAndDelete(req.params.id);
    
    res.json({ message: "Vehicle and associated images deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
