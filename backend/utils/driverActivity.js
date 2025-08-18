const User = require('../models/User');
const { USER_STATUS } = require('../utils/constants');

const checkDriverActivity = async () => {
  try {
    const now = new Date();
    const drivers = await User.find({ role: 'driver', status: USER_STATUS.AVAILABLE });

    for (const driver of drivers) {
      const lastActive = driver.lastActiveAt || new Date();
      const diffMs = now - lastActive;
      const diffHours = diffMs / (1000 * 60 * 60);

      // If inactive for more than 3 hours → offline
      if (diffHours >= 3) {
        driver.status = USER_STATUS.OFFLINE;
        driver.available = false;
        await driver.save();
        console.log(`Driver ${driver._id} set offline due to 3h inactivity`);
      }
    }
  } catch (err) {
    console.error('Error checking driver activity:', err);
  }
};

module.exports = { checkDriverActivity };
