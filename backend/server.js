require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { connectDB } = require('./config/db');
const routes = require('./routes');
const { initSockets } = require('./sockets/booking.socket');
const logger = require('./utils/logger');
const path = require('path');
// const { checkDriverActivity } = require('./utils/driverActivity');

const app = express();
const server = http.createServer(app);

// ✅ Allowed origins (dev vs prod)
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? (process.env.ALLOWED_ORIGINS?.split(',') || [])
  : ['http://localhost:3000', 'http://127.0.0.1:3000'];

// ✅ Socket.io CORS
const io = require('socket.io')(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// ✅ Helmet configured ONCE (fixes CSP)
// Helmet CSP fix
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "img-src": [
          "'self'",
          "data:",
          "http://localhost:3000",
          "http://localhost:5000"   // ✅ allow images from backend
        ],
      },
    },
    crossOriginEmbedderPolicy: false, // ✅ prevent CORP blocking
  })
);

// ✅ CORS
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// ✅ Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
});
app.use(limiter);

// ✅ JSON parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ✅ Serve uploads
app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin"); // 🔑 fix NotSameOrigin
    next();
  },
  express.static(path.join(__dirname, "uploads"))
);

// ✅ DB + routes
connectDB();
app.get('/health', (req, res) =>
  res.json({ status: 'OK', time: new Date().toISOString() })
);
app.use('/api', routes);
// ✅ Error handler
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

// ✅ Init sockets
initSockets(io);

// ✅ Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => logger.info(`Server listening on ${PORT}`));

module.exports = { app, server };
