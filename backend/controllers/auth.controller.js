const User = require('../models/User');
const Vehicle = require('../models/Vehicle'); // <-- Add Vehicle model
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, vehicle } = req.body;

    // Check if email exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email exists' });

    // Hash password
    const hash = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hash,
      role: role || 'passenger',
      phone
    });

    // If driver, create vehicle
    if (role === 'driver' && vehicle) {
      const newVehicle = await Vehicle.create({
        provider: user._id,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        plate: vehicle.plate,
        type: vehicle.type || 'standard',
        
        taxiDoors: vehicle.taxiDoors,
        passengers: vehicle.passengers,
        luggageCarry: vehicle.luggageCarry,
        airCondition: vehicle.airCondition,
        gpsNavigation: vehicle.gpsNavigation,
        
        perKmRate: vehicle.perKmRate,
        extraKmRate: vehicle.extraKmRate
      });

      // Link vehicle to user
      user.vehicle = newVehicle._id;
      await user.save();
    }

    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        vehicle: user.vehicle || null
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email,password);
    

    const user = await User.findOne({ email });
    console.log(user,"user");
    
    if (!user) return res.status(401).json({ message: 'Invalid' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user._id, role: user.role, vehicle: user.vehicle || null }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
