<template>
  <div class="flex flex-col flex-grow bg-luye-dark text-white animate-fade-in p-6 overflow-y-auto">
    <div class="max-w-6xl mx-auto w-full">
      
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 class="text-3xl font-bold text-white flex items-center gap-3">
            <ShieldIcon class="w-8 h-8 text-luye-orange" />
            Panel de Control Master
          </h1>
          <p class="text-gray-400 mt-1">Gestión Sincronizada del Simposio Luye</p>
        </div>
        
        <div class="bg-gray-800 px-4 py-2 rounded-xl border border-gray-700 flex items-center gap-3 shadow-lg">
          <UsersIcon class="w-5 h-5 text-luye-teal" />
          <div class="flex flex-col">
            <span class="text-xs text-gray-400 font-medium">Espectadores Globales</span>
            <span class="font-bold text-lg leading-none">{{ onlineCount }} Conectados</span>
          </div>
        </div>
        
        <div class="bg-gray-800 px-4 py-2 rounded-xl border border-gray-700 flex items-center gap-3 shadow-lg">
          <MessageSquareIcon class="w-5 h-5 text-luye-orange" />
          <div class="flex flex-col">
            <span class="text-xs text-gray-400 font-medium">Mensajes Globales</span>
            <span class="font-bold text-lg leading-none">{{ messageCount }}</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- ── COLUMNA IZQUIERDA: CONTROLES DE VIDEO ── -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-xl">
            <div class="p-4 border-b border-gray-700 bg-gray-900 flex justify-between items-center">
              <h2 class="font-semibold text-gray-200 flex items-center gap-2">
                <VideoIcon class="w-5 h-5 text-luye-teal" />
                Monitor de Transmisión (Master)
              </h2>
              <div :class="['px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider', isPlaying ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-gray-700 text-gray-300']">
                {{ isPlaying ? 'EN VIVO' : (isEnded ? 'FINALIZADO' : 'EN ESPERA') }}
              </div>
            </div>
            
            <div class="relative aspect-video bg-black">
               <video 
                  ref="adminVideo"
                  class="w-full h-full object-cover"
                  :src="settings.videoUrlEs"
                  muted
                  @timeupdate="handleTimeUpdate"
                ></video>
            </div>
            
            <div class="p-6 bg-gray-800">
              <!-- Timeline/Seeker -->
              <div class="mb-6">
                <div class="flex justify-between text-xs text-gray-400 mb-2 font-mono">
                  <span>{{ formatTime(currentTime) }}</span>
                  <span>{{ formatTime(duration) }}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  :max="duration || 100" 
                  :value="currentTime" 
                  @input="handleSeek"
                  class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-luye-teal"
                >
              </div>

              <!-- Controles Maestros -->
              <div class="flex items-center justify-center gap-4">
                <button 
                  @click="seekRelative(-10)"
                  class="p-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors"
                  title="Retroceder 10s"
                >
                  <RewindIcon class="w-6 h-6 text-white" />
                </button>
                
                <button 
                  v-if="!isPlaying"
                  @click="playGlobal"
                  class="w-16 h-16 bg-luye-teal hover:bg-teal-400 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(40,181,181,0.4)] transition-all transform hover:scale-105"
                  title="Reproducir"
                >
                  <PlayIcon class="w-8 h-8 text-white ml-1" />
                </button>
                
                <button 
                  v-else
                  @click="pauseGlobal"
                  class="w-16 h-16 bg-luye-orange hover:bg-orange-400 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(242,100,64,0.4)] transition-all transform hover:scale-105"
                  title="Pausar"
                >
                  <PauseIcon class="w-8 h-8 text-white" />
                </button>

                <button 
                  @click="stopGlobal"
                  class="w-16 h-16 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all transform hover:scale-105"
                  title="Finalizar Simposio"
                >
                  <SquareIcon class="w-7 h-7 text-white fill-white" />
                </button>

                <button 
                  @click="seekRelative(10)"
                  class="p-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors"
                  title="Adelantar 10s"
                >
                  <FastForwardIcon class="w-6 h-6 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- ── COLUMNA DERECHA: AJUSTES ── -->
        <div class="space-y-6">
          
          <form @submit.prevent="saveSettings" class="bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-xl space-y-6">
             <h2 class="font-semibold text-gray-200 border-b border-gray-700 pb-2 flex items-center gap-2">
               <SettingsIcon class="w-5 h-5 text-luye-teal" />
               Configuración del Simposio
             </h2>
             
             <!-- Metadata -->
             <div class="space-y-4">
                <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider">Información Visible</h3>
                <div>
                  <label class="block text-xs text-gray-400 mb-1">Título del Simposio</label>
                  <input v-model="settings.title" type="text" class="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:border-luye-teal outline-none transition-colors" required>
                </div>
                <div class="grid grid-cols-2 gap-4">
                   <div>
                     <label class="block text-xs text-gray-400 mb-1">Nombre Ponente</label>
                     <input v-model="settings.speakerName" type="text" class="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:border-luye-teal outline-none transition-colors" required>
                   </div>
                   <div>
                     <label class="block text-xs text-gray-400 mb-1">Cargo Ponente</label>
                     <input v-model="settings.speakerRole" type="text" class="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:border-luye-teal outline-none transition-colors" required>
                   </div>
                </div>
             </div>

             <!-- Videos -->
             <div class="space-y-4">
                <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider mt-2">Enlaces de Video (DigitalOcean)</h3>
                <div>
                  <label class="block text-xs text-gray-400 mb-1 flex items-center gap-2">🇪🇸 URL Español</label>
                  <input v-model="settings.videoUrlEs" type="url" class="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:border-luye-teal outline-none transition-colors" required>
                </div>
                <div>
                  <label class="block text-xs text-gray-400 mb-1 flex items-center gap-2">🇺🇸 URL Inglés</label>
                  <input v-model="settings.videoUrlEn" type="url" class="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:border-luye-teal outline-none transition-colors" required>
                </div>
                <div>
                  <label class="block text-xs text-gray-400 mb-1 flex items-center gap-2">🇧🇷 URL Portugués</label>
                  <input v-model="settings.videoUrlPt" type="url" class="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:border-luye-teal outline-none transition-colors" required>
                </div>
             </div>
             
             <button type="submit" class="w-full bg-luye-navy hover:bg-luye-teal text-white font-medium py-3 rounded-lg transition-colors flex justify-center items-center gap-2 shadow-lg" :disabled="isSaving">
                <SaveIcon v-if="!isSaving" class="w-4 h-4" />
                <Loader2Icon v-else class="w-4 h-4 animate-spin" />
                {{ isSaving ? 'Guardando...' : 'Guardar y Sincronizar Cambios' }}
             </button>
             
             <p v-if="saveSuccess" class="text-green-400 text-xs text-center">¡Configuración guardada y transmitida con éxito!</p>
          </form>
          
          <div class="bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-xl">
             <h2 class="font-semibold text-gray-200 mb-4 border-b border-gray-700 pb-2 flex items-center gap-2">
               <AlertCircleIcon class="w-5 h-5 text-luye-orange" />
               Estado del Sistema
             </h2>
             <ul class="space-y-3 text-sm">
                <li class="flex justify-between">
                   <span class="text-gray-400">Servidor Node.js</span>
                   <span class="text-green-400 font-medium">Online</span>
                </li>
                <li class="flex justify-between">
                   <span class="text-gray-400">Conexión Socket</span>
                   <span class="text-green-400 font-medium">{{ socket ? 'Conectado' : 'Desconectado' }}</span>
                </li>
             </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { io } from 'socket.io-client';
import { ShieldIcon, UsersIcon, MessageSquareIcon, VideoIcon, PlayIcon, PauseIcon, SquareIcon, RewindIcon, FastForwardIcon, SettingsIcon, AlertCircleIcon, SaveIcon, Loader2Icon } from 'lucide-vue-next';

// ── Estado de Configuración ──
const settings = ref({
  title: '',
  speakerName: '',
  speakerRole: '',
  videoUrlEs: '',
  videoUrlEn: '',
  videoUrlPt: ''
});
const isSaving = ref(false);
const saveSuccess = ref(false);

// ── Estado de Video y KPIs ──
const adminVideo = ref(null);
const isPlaying = ref(false);
const isEnded = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const onlineCount = ref(0);
const messageCount = ref(0);
let socket = null;

// ── Fetch de Configuración Inicial ──
const loadSettings = async () => {
  try {
    const res = await fetch('/api/settings');
    const data = await res.json();
    settings.value = data;
  } catch (err) {
    console.error("Error al cargar configuración", err);
  }
};

// ── Guardar Configuración ──
const saveSettings = async () => {
  isSaving.value = true;
  saveSuccess.value = false;
  try {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings.value)
    });
    
    if (res.ok) {
      const data = await res.json();
      saveSuccess.value = true;
      // Notificar a todos los usuarios con el config que incluye las traducciones
      if (socket && data.settings) {
        socket.emit('admin_update_settings', data.settings);
      }
      setTimeout(() => saveSuccess.value = false, 3000);
    }
  } catch (err) {
    console.error("Error guardando settings", err);
  } finally {
    isSaving.value = false;
  }
};

// ── Utilidades de Video ──
const formatTime = (seconds) => {
  if (isNaN(seconds)) return "00:00";
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

const handleTimeUpdate = () => {
   if (adminVideo.value) {
      currentTime.value = adminVideo.value.currentTime;
      duration.value = adminVideo.value.duration;
   }
};

// ── Controles Socket.io ──
const playGlobal = () => {
  if (socket) {
    socket.emit('admin_play');
    isPlaying.value = true;
    isEnded.value = false;
    adminVideo.value?.play();
  }
};

const pauseGlobal = () => {
  if (socket) {
    socket.emit('admin_pause', adminVideo.value?.currentTime || 0);
    isPlaying.value = false;
    adminVideo.value?.pause();
  }
};

const stopGlobal = () => {
  if (socket) {
    socket.emit('admin_stop');
    isPlaying.value = false;
    isEnded.value = true;
    adminVideo.value?.pause();
  }
};

const handleSeek = (e) => {
   const newTime = parseFloat(e.target.value);
   if (adminVideo.value) {
      adminVideo.value.currentTime = newTime;
      if (socket) {
         socket.emit('admin_seek', newTime);
      }
   }
};

const seekRelative = (seconds) => {
   if (adminVideo.value) {
      let newTime = adminVideo.value.currentTime + seconds;
      if (newTime < 0) newTime = 0;
      if (newTime > adminVideo.value.duration) newTime = adminVideo.value.duration;
      
      adminVideo.value.currentTime = newTime;
      if (socket) {
         socket.emit('admin_seek', newTime);
      }
   }
};

onMounted(() => {
  loadSettings();
  
  // En producción, se usaría un token JWT para verificar al admin
  socket = io();
  
  socket.on('sync_state', (state) => {
     isPlaying.value = state.isPlaying;
     isEnded.value = state.isEnded || false;
     if (adminVideo.value) {
        adminVideo.value.currentTime = state.currentTime;
        if (state.isPlaying) adminVideo.value.play();
     }
  });

  socket.on('admin_stats', (stats) => {
     onlineCount.value = stats.onlineUsers;
     messageCount.value = stats.totalMessages;
  });
});

onUnmounted(() => {
  if (socket) socket.disconnect();
});
</script>

<style scoped>
/* Eliminar flechas de inputs type="number" o scrollbars feas si existieran */
input[type=range]::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  background: #28B5B5;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(40,181,181,0.5);
}
</style>
