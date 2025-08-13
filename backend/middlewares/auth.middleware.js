const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.authMiddleware = (allowedRoles=[]) => async (req,res,next) => {
  try {
    const auth = req.headers.authorization;
    if(!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message:'Token required' });
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if(!user) return res.status(401).json({ message:'Invalid user' });
    if(allowedRoles.length && !allowedRoles.includes(user.role)) return res.status(403).json({ message:'Forbidden' });
    req.user = { id: user._id.toString(), role: user.role };
    next();
  } catch(err){ console.error(err); res.status(401).json({ message:'Auth error' }); }
};
