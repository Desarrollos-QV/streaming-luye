const Message = require('../models/Message');

// Estructura de estado global para el simposio
const streamState = {
  isPlaying: false,
  isEnded: false,
  startTime: null,      // Cuándo se dio play en el servidor (timestamp)
  pauseTime: 0,         // En qué segundo se pausó
  lastUpdate: Date.now()
};

module.exports = (io) => {
  // Enviar KPIs periódicamente a la sala 'admin' (si tuviéramos)
  // Por ahora lo emitimos globalmente o al admin si lo pide
  const broadcastKPIs = async () => {
    try {
      const msgCount = await Message.count();
      io.emit('admin_stats', {
        onlineUsers: io.engine.clientsCount,
        totalMessages: msgCount
      });
    } catch (e) {}
  };

  setInterval(broadcastKPIs, 5000); // Actualizar KPIs cada 5s

  io.on('connection', (socket) => {
    console.log(`🔌 Usuario conectado: ${socket.id}`);
    broadcastKPIs();

    // Unirse a una sala específica (ej: 'global', 'spanish')
    socket.on('join_room', async (room) => {
      socket.join(room);
      console.log(`Usuario ${socket.id} se unió a la sala ${room}`);
      
      // Enviarle el estado actual del stream al usuario recién conectado
      socket.emit('sync_state', getStreamState());

      try {
        // Obtener historial de mensajes (últimos 50) de la BD
        const history = await Message.findAll({
          where: { room },
          order: [['createdAt', 'DESC']],
          limit: 50
        });
        
        // Invertir para enviarlos en orden cronológico correcto
        const chatHistory = history.reverse().map(msg => ({
          user: msg.user,
          text: msg.text,
          timestamp: msg.createdAt.getTime()
        }));
        
        socket.emit('chat_history', chatHistory);
      } catch (err) {
        console.error('Error al recuperar historial de chat:', err);
      }
    });

    // ----------------------------------------
    // Controles de Administrador
    // ----------------------------------------
    socket.on('admin_play', () => {
      streamState.isPlaying = true;
      streamState.isEnded = false;
      streamState.startTime = Date.now() - (streamState.pauseTime * 1000);
      io.emit('video_play', { startTime: streamState.startTime });
      console.log('▶️ Stream iniciado por admin');
    });

    socket.on('admin_pause', (currentTime) => {
      streamState.isPlaying = false;
      streamState.pauseTime = currentTime; 
      io.emit('video_pause', { currentTime });
      console.log(`⏸️ Stream pausado en el segundo ${currentTime}`);
    });

    socket.on('admin_stop', () => {
      streamState.isPlaying = false;
      streamState.isEnded = true;
      streamState.pauseTime = 0; // Opcional reiniciar
      io.emit('video_stop');
      console.log(`🛑 Stream finalizado por admin`);
    });

    socket.on('admin_seek', (seekTime) => {
      streamState.pauseTime = seekTime;
      if (streamState.isPlaying) {
        streamState.startTime = Date.now() - (seekTime * 1000);
      }
      io.emit('video_seek', { seekTime });
      console.log(`⏩ Stream adelantado/atrasado al segundo ${seekTime}`);
    });

    socket.on('admin_update_settings', (newSettings) => {
      io.emit('settings_updated', newSettings);
      console.log(`⚙️ Configuración del simposio actualizada`);
    });

    // ----------------------------------------
    // Chat en vivo
    // ----------------------------------------
    socket.on('send_message', async (data) => {
      // data: { room, user, text }
      try {
        await Message.create({
          room: data.room,
          user: data.user,
          text: data.text
        });

        io.to(data.room).emit('receive_message', {
          user: data.user,
          text: data.text,
          timestamp: Date.now()
        });
        broadcastKPIs(); // Forzar actualización al recibir mensaje
      } catch (err) {
        console.error('Error al guardar mensaje:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log(`❌ Usuario desconectado: ${socket.id}`);
      broadcastKPIs();
    });
  });
};

function getStreamState() {
  let currentTime = streamState.pauseTime;
  if (streamState.isPlaying) {
    // Calculamos el tiempo actual en segundos
    currentTime = (Date.now() - streamState.startTime) / 1000;
  }
  return {
    isPlaying: streamState.isPlaying,
    isEnded: streamState.isEnded,
    currentTime: currentTime
  };
}
