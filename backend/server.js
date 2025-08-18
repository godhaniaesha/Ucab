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

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? process.env.ALLOWED_ORIGINS?.split(',') : '*',
    methods: ['GET', 'POST']
  }
});

app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.ALLOWED_ORIGINS?.split(',') : '*',
  credentials: true
}));

const limiter = rateLimit({
  windowMs: 15*60*1000,
  max: 200
});
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));



// Serve local uploads
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

connectDB();
app.get('/health', (req, res) => res.json({ status: 'OK', time: new Date().toISOString() }));
app.use('/api', routes);

app.use((err, req, res, next) => {
  logger.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

initSockets(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => logger.info(`Server listening on ${PORT}`));
module.exports = { app, server };
