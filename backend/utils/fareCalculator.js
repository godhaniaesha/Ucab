const { calculateDistance } = require('./distance');

function calculateFare(pickupCoords, dropCoords, vehicleType = 'standard', vehicleData = {}) {
  // Calculate straight-line distance
  const distance = calculateDistance(
    pickupCoords[1], pickupCoords[0],
    dropCoords[1], dropCoords[0]
  );

  // Default rates from environment
  const defaultBaseFare = parseFloat(process.env.BASE_FARE || 30);
  const defaultPerKm = parseFloat(process.env.PER_KM_RATE || 10);

  // Use vehicle-specific charges if provided
  const baseFare = vehicleData.baseFare ? parseFloat(vehicleData.baseFare) : defaultBaseFare;
  const perKm = vehicleData.perKmRate ? parseFloat(vehicleData.perKmRate) : defaultPerKm;

  // Type multiplier
  const multipliers = { standard: 1, premium: 1.5, luxury: 2 };
  const multiplier = multipliers[vehicleType] || 1;

  // Fare calculations
  const distanceFare = perKm * distance;
  const totalFare = (baseFare + distanceFare) * multiplier;

  // Round helper
  const round2 = num => Math.round(num * 100) / 100;

  return {
    distance: round2(distance),
    baseFare: round2(baseFare),
    perKmRate: round2(perKm),
    distanceFare: round2(distanceFare),
    multiplier,
    totalFare: round2(totalFare)
  };
}

module.exports = calculateFare;
