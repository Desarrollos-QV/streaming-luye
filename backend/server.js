require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // En producción, cambiar por el dominio del frontend
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

const sequelize = require('./src/config/database');
require('./src/models/User'); // Import models to sync
require('./src/models/Message'); // Import Message model
require('./src/models/Setting'); // Import Setting model

// Socket.io Manager
require('./src/sockets/socket.manager')(io);

// Sync Database
sequelize.sync({ alter: true })
  .then(() => console.log('✅ Database synced successfully'))
  .catch((err) => console.error('❌ Database sync failed:', err));

// Rutas de API
const authRoutes = require('./src/routes/auth.routes');
const settingsRoutes = require('./src/routes/settings.routes');

app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);

// Rutas básicas
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

const PORT = process.env.PORT || 3636;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
