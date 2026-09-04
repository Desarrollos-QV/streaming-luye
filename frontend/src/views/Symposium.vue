<template>
  <div class="symposium-root" :class="{ 'chat-open': isChatOpen }">

    <!-- ══════════════════════════════════════════════════
         BARRA SUPERIOR: Título + Estado LIVE + Idioma
    ═══════════════════════════════════════════════════════ -->
    <header class="symposium-header">
      <div class="header-left">
        <div class="live-badge" :class="isPlaying ? 'live-active' : 'live-waiting'">
          <span class="live-dot"></span>
          <span>{{ isPlaying ? $t('live') : $t('waiting') }}</span>
        </div>
        <div class="header-info">
          <h1 class="session-title">{{ sessionTitle }}</h1>
          <p class="session-subtitle">
            <span class="presenter-tag">{{ speakerName }}</span>
            <span class="divider-dot">·</span>
            Global Medical Symposium
            <span class="divider-dot">·</span>
            <span class="viewer-count">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-xs"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              {{ onlineCount }} {{ $t('onlineCount') }}
            </span>
          </p>
        </div>
      </div>

      <div class="header-right">
        <!-- Selector de Idioma (deshabilitado porque el idioma lo dicta la URL) -->
        <div class="lang-selector opacity-50 cursor-not-allowed">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-sm"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          <span class="text-sm font-bold uppercase">{{ locale }}</span>
        </div>

        <!-- Toggle Chat (Móvil) -->
        <button class="chat-toggle-btn" @click="isChatOpen = !isChatOpen" :class="{ active: isChatOpen }">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-sm"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <span class="badge-count" v-if="unreadCount > 0">{{ unreadCount }}</span>
        </button>
      </div>
    </header>

    <!-- ══════════════════════════════════════════════════
         CUERPO PRINCIPAL: Video + Chat
    ═══════════════════════════════════════════════════════ -->
    <main class="symposium-body">

      <!-- ── ZONA DE VIDEO ── -->
      <section class="video-zone">

        <!-- Player Container -->
        <div class="player-wrapper" ref="playerWrapper">

          <!-- Overlay: Waiting State -->
          <transition name="fade-overlay">
            <div v-if="!isPlaying && !isEnded" class="player-overlay waiting-overlay">
              <div class="waiting-content">
                <div class="waiting-logo-ring">
                  <div class="waiting-spinner"></div>
                  <div class="waiting-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                </div>
                <h2 class="waiting-title">{{ $t('symposiumStarting') }}</h2>
                <p class="waiting-sub">{{ $t('keepOpen') }}</p>
                <div class="waiting-pills">
                  <span class="pill teal" v-if="locale === 'es'">🇪🇸 Español</span>
                  <span class="pill blue" v-if="locale === 'en'">🇺🇸 English</span>
                  <span class="pill navy" v-if="locale === 'pt'">🇧🇷 Português</span>
                </div>
              </div>
            </div>
          </transition>

          <!-- Overlay: Ended State -->
          <transition name="fade-overlay">
            <div v-if="isEnded" class="player-overlay ended-overlay bg-luye-dark/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-8 z-50">
              <div class="w-20 h-20 bg-luye-teal/20 rounded-full flex items-center justify-center mb-6">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-10 h-10 text-luye-teal"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <h2 class="text-3xl font-bold text-white mb-2">{{ $t('thankYou') }}</h2>
              <p class="text-gray-400 text-lg">{{ $t('thankYouDesc') }}</p>
            </div>
          </transition>

          <!-- VIDEO -->
          <video
            ref="videoPlayer"
            class="main-video"
            :src="currentVideoUrl"
            playsinline
            disablePictureInPicture
            controlsList="nodownload noplaybackrate nofullscreen"
          ></video>

          <!-- HUD Overlay superior (solo cuando está jugando) -->
          <div v-if="isPlaying" class="hud-top">
            <div class="hud-live">
              <span class="hud-live-dot"></span>
              {{ $t('live') }}
            </div>
            <div class="hud-time">{{ formatTime(videoCurrentTime) }}</div>
          </div>

          <!-- HUD Controls Inferiores -->
          <div v-if="isPlaying" class="hud-controls">
            <button class="hud-btn" @click="toggleMute" :title="isMuted ? 'Desmutear' : 'Mutear'">
              <svg v-if="!isMuted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
            </button>
            <button class="hud-btn" @click="toggleFullscreen" :title="isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'">
              <svg v-if="!isFullscreen" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path></svg>
            </button>
          </div>

          <!-- HUD inferior: Barra de progreso decorativa -->
          <div v-if="isPlaying" class="hud-bottom">
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" :style="{ width: progressPercent + '%' }"></div>
            </div>
          </div>
        </div>

        <!-- ── INFO DE SESIÓN (bajo el video) ── -->
        <div class="session-meta">
          <div class="session-meta-left">
            <div class="speaker-avatar">{{ speakerInitials }}</div>
            <div>
              <p class="speaker-name">{{ speakerName }}</p>
              <p class="speaker-role">{{ speakerRole }}</p>
            </div>
          </div>
          <div class="session-meta-right">
            <div class="meta-chip">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-xs"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              {{ $t('meta.date') }}
            </div>
            <div class="meta-chip teal">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-xs"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>
              {{ $t('meta.duration') }}
            </div>
            <div class="meta-chip orange" v-if="isPlaying">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-xs"><circle cx="12" cy="12" r="10"/><path d="M10 9l5 3-5 3z"/></svg>
              {{ $t('meta.broadcasting') }}
            </div>
          </div>
        </div>        
      </section>

      <!-- ── PANEL CHAT ── -->
      <aside class="chat-panel" :class="{ 'mobile-open': isChatOpen }">

        <!-- Chat Header -->
        <div class="chat-header">
          <div class="chat-header-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-sm"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            {{ $t('chat.title') }}
          </div>
          <div class="online-pill">
            <span class="online-dot"></span>
            {{ $t('chat.online') }}
          </div>
        </div>

        <!-- Messages -->
        <div class="chat-messages" ref="chatContainer">
          <div
            v-for="(msg, i) in messages"
            :key="i"
            class="chat-message"
            :class="{
              'system-msg': msg.user === 'Sistema',
              'own-msg': msg.user === userName
            }"
          >
            <template v-if="msg.user !== 'Sistema'">
              <div class="msg-avatar" :class="{ 'own-avatar': msg.user === userName }">
                {{ msg.user.charAt(0).toUpperCase() }}
              </div>
              <div class="msg-body">
                <span class="msg-author" :class="{ 'own-author': msg.user === userName }">
                  {{ msg.user === userName ? $t('chat.you') : msg.user }}
                </span>
                <div class="msg-bubble" :class="{ 'own-bubble': msg.user === userName }">
                  {{ msg.text }}
                </div>
              </div>
            </template>
            <template v-else>
              <div class="system-notice">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-xs"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {{ msg.text }}
              </div>
            </template>
          </div>
        </div>

        <!-- Chat Input -->
        <div class="chat-input-area">
          <form @submit.prevent="sendMessage" class="chat-form">
            <input
              v-model="newMessage"
              type="text"
              :placeholder="$t('chat.placeholder')"
              class="chat-input"
              required
              maxlength="300"
            />
            <button type="submit" class="send-btn" :disabled="!newMessage.trim()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9"/></svg>
            </button>
          </form>
        </div>
      </aside>

    </main>

    <!-- Overlay oscuro para cerrar chat en móvil -->
    <div v-if="isChatOpen" class="chat-mobile-backdrop" @click="isChatOpen = false"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue';
import { io } from 'socket.io-client';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

const route = useRoute();
const { t, locale } = useI18n();

// Configurar idioma basado en URL (/live/es, /live/en, /live/pt)
const langParam = route.params.lang || 'es';
const supportedLangs = ['es', 'en', 'pt'];
locale.value = supportedLangs.includes(langParam) ? langParam : 'es';

// URL de video basada en idioma
const videoSources = ref({
  es: '',
  en: '',
  pt: ''
});
const currentVideoUrl = ref('');

const sessionTitle = ref('');
const speakerName = ref('');
const speakerRole = ref('');

const speakerInitials = computed(() => {
  if (!speakerName.value) return 'S';
  const parts = speakerName.value.replace('Dr. ', '').replace('Dra. ', '').split(' ');
  if (parts.length >= 2) return parts[0][0] + parts[1][0];
  return parts[0][0];
});

const roomName = `room_${locale.value}`;

const isPlaying         = ref(false);
const isEnded           = ref(false);
const videoPlayer       = ref(null);
const playerWrapper     = ref(null);
const videoCurrentTime  = ref(0);
const videoDuration     = ref(0);
const isMuted           = ref(false);
const isFullscreen      = ref(false);

const messages    = ref([]);
const newMessage  = ref('');
const chatContainer = ref(null);
const userName    = ref(localStorage.getItem('userName') || 'Doctor Invitado');
const isChatOpen  = ref(false);
const unreadCount = ref(0);
const onlineCount = ref(1);

let socket = null;

/* ── Computed ────────────────────────────────── */
const progressPercent = computed(() => {
  if (!videoDuration.value) return 0;
  return (videoCurrentTime.value / videoDuration.value) * 100;
});

/* ── Helpers ─────────────────────────────────── */
const formatTime = (s) => {
  if (isNaN(s)) return '00:00';
  const m = Math.floor(s / 60).toString().padStart(2, '0');
  const sec = Math.floor(s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
};

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value)
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  });
};

/* ── Video Controls ──────────────────────────── */
const toggleMute = () => {
  if (videoPlayer.value) {
    videoPlayer.value.muted = !videoPlayer.value.muted;
    isMuted.value = videoPlayer.value.muted;
  }
};

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    if (playerWrapper.value?.requestFullscreen) {
      playerWrapper.value.requestFullscreen();
      isFullscreen.value = true;
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
      isFullscreen.value = false;
    }
  }
};

/* ── Chat ────────────────────────────────────── */
const sendMessage = () => {
  if (!newMessage.value.trim() || !socket) return;
  socket.emit('send_message', { room: roomName, user: userName.value, text: newMessage.value });
  newMessage.value = '';
};

/* ── Video time tracking ─────────────────────── */
const onTimeUpdate = () => {
  if (videoPlayer.value) {
    videoCurrentTime.value = videoPlayer.value.currentTime;
    videoDuration.value    = videoPlayer.value.duration;
  }
};

/* ── Sockets ─────────────────────────────────── */
onMounted(async () => {
  // Fetch initial settings
  try {
    const res = await fetch('/api/settings');
    const data = await res.json();
    applySettings(data);
  } catch (err) {
    console.error('Error fetching settings:', err);
  }

  socket = io();

  // Nos unimos a la sala del idioma específico
  socket.on('connect', () => socket.emit('join_room', roomName));

  socket.on('sync_state', (state) => {
    isPlaying.value = state.isPlaying;
    isEnded.value = state.isEnded || false;
    if (videoPlayer.value) {
      videoPlayer.value.currentTime = state.currentTime;
      state.isPlaying
        ? videoPlayer.value.play().catch(() => {})
        : videoPlayer.value.pause();
    }
  });

  socket.on('settings_updated', (newSettings) => {
    applySettings(newSettings);
  });

  // Comandos de administrador siguen siendo globales y afectan a todas las salas
  socket.on('video_play', ({ startTime }) => {
    isPlaying.value = true;
    isEnded.value = false;
    if (videoPlayer.value) {
      const serverTime = (Date.now() - startTime) / 1000;
      if (Math.abs(videoPlayer.value.currentTime - serverTime) > 1)
        videoPlayer.value.currentTime = serverTime;
      videoPlayer.value.play().catch(() => {});
    }
  });

  socket.on('video_pause', ({ currentTime }) => {
    isPlaying.value = false;
    if (videoPlayer.value) { videoPlayer.value.currentTime = currentTime; videoPlayer.value.pause(); }
  });
  
  socket.on('video_stop', () => {
    isPlaying.value = false;
    isEnded.value = true;
    if (videoPlayer.value) { videoPlayer.value.pause(); }
  });

  socket.on('video_seek', ({ seekTime }) => {
    if (videoPlayer.value) videoPlayer.value.currentTime = seekTime;
  });

  socket.on('chat_history', (history) => {
    messages.value = [
      { user: 'Sistema', text: t('chat.systemWelcome') },
      ...history
    ];
    scrollToBottom();
  });

  socket.on('receive_message', (msg) => {
    messages.value.push(msg);
    if (!isChatOpen.value) unreadCount.value++;
    scrollToBottom();
  });

  if (videoPlayer.value)
    videoPlayer.value.addEventListener('timeupdate', onTimeUpdate);

  document.addEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement;
  });
});

const applySettings = (data) => {
  sessionTitle.value = data[`title_${locale.value}`] || data.title || '';
  speakerName.value = data.speakerName || '';
  speakerRole.value = data[`speakerRole_${locale.value}`] || data.speakerRole || '';
  videoSources.value = {
    es: data.videoUrlEs || '',
    en: data.videoUrlEn || '',
    pt: data.videoUrlPt || ''
  };
  currentVideoUrl.value = videoSources.value[locale.value];
};

onUnmounted(() => {
  socket?.disconnect();
  videoPlayer.value?.removeEventListener('timeupdate', onTimeUpdate);
});
</script>

<style scoped>
/* ══════════════════════════════════════════════
   ROOT LAYOUT
════════════════════════════════════════════════ */
.symposium-root {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #0a0f1e;
  color: #e2e8f0;
  font-family: 'Inter', sans-serif;
  overflow: hidden;
  position: relative;
}

/* ══════════════════════════════════════════════
   HEADER
════════════════════════════════════════════════ */
.symposium-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 20px;
  background: rgba(10, 15, 30, 0.95);
  border-bottom: 1px solid rgba(40, 181, 181, 0.15);
  backdrop-filter: blur(10px);
  flex-shrink: 0;
  flex-wrap: wrap;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
  min-width: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.header-info { min-width: 0; }

.session-title {
  font-size: clamp(0.8rem, 2vw, 1.05rem);
  font-weight: 700;
  color: #f1f5f9;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
}

.session-subtitle {
  font-size: 0.7rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  margin: 2px 0 0 0;
}
.presenter-tag { color: #28B5B5; font-weight: 600; }
.divider-dot { color: #334155; }
.viewer-count { display: flex; align-items: center; gap: 4px; color: #94a3b8; }

/* Live Badge */
.live-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  flex-shrink: 0;
}
.live-active { background: rgba(239,68,68,0.15); color: #f87171; border: 1px solid rgba(239,68,68,0.3); }
.live-waiting { background: rgba(100,116,139,0.15); color: #94a3b8; border: 1px solid rgba(100,116,139,0.2); }
.live-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
}
.live-active .live-dot {
  animation: pulse-dot 1.2s ease-in-out infinite;
}
@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.7); }
}

/* Language Selector */
.lang-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px;
  padding: 6px 12px;
  color: #94a3b8;
}

/* Chat toggle button (visible only on mobile) */
.chat-toggle-btn {
  display: none;
  position: relative;
  width: 38px;
  height: 38px;
  border-radius: 8px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  color: #94a3b8;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.chat-toggle-btn.active { background: rgba(40,181,181,0.15); color: #28B5B5; border-color: rgba(40,181,181,0.3); }
.badge-count {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #F26440;
  color: white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  font-size: 0.6rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ══════════════════════════════════════════════
   BODY
════════════════════════════════════════════════ */
.symposium-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* ══════════════════════════════════════════════
   VIDEO ZONE
════════════════════════════════════════════════ */
.video-zone {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background: #080c1a;
}

.video-zone::-webkit-scrollbar { width: 4px; }
.video-zone::-webkit-scrollbar-track { background: transparent; }
.video-zone::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 99px; }

/* Player */
.player-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000;
  flex-shrink: 0;
}

.main-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Waiting Overlay */
.player-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}
.waiting-overlay {
  background: radial-gradient(ellipse at center, #0d1829 0%, #050810 100%);
}
.waiting-content {
  text-align: center;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.waiting-logo-ring {
  position: relative;
  width: 90px;
  height: 90px;
}
.waiting-spinner {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: #28B5B5;
  border-right-color: #28B5B560;
  animation: spin 1.2s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.waiting-icon {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #28B5B5;
}
.waiting-icon svg { width: 32px; height: 32px; }
.waiting-title { font-size: 1.1rem; font-weight: 700; color: #f1f5f9; margin: 0; }
.waiting-sub { font-size: 0.8rem; color: #64748b; margin: 0; }
.waiting-pills { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
.pill {
  padding: 4px 12px;
  border-radius: 99px;
  font-size: 0.72rem;
  font-weight: 600;
  border: 1px solid;
}
.pill.teal  { color: #28B5B5; border-color: rgba(40,181,181,0.3); background: rgba(40,181,181,0.08); }
.pill.blue  { color: #60a5fa; border-color: rgba(96,165,250,0.3); background: rgba(96,165,250,0.08); }
.pill.navy  { color: #a5b4fc; border-color: rgba(165,180,252,0.3); background: rgba(165,180,252,0.08); }

/* HUD */
.hud-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%);
}
.hud-live {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #dc2626;
  color: white;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  padding: 4px 10px;
  border-radius: 5px;
}
.hud-live-dot {
  width: 6px; height: 6px; border-radius: 50%; background: white;
  animation: pulse-dot 1.2s ease-in-out infinite;
}
.hud-time {
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  font-size: 0.8rem;
  color: rgba(255,255,255,0.85);
  background: rgba(0,0,0,0.5);
  padding: 3px 8px;
  border-radius: 5px;
}

.hud-controls {
  position: absolute;
  bottom: 16px;
  right: 16px;
  display: flex;
  gap: 12px;
  z-index: 10;
}
.hud-btn {
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: white;
  width: 38px;
  height: 38px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  backdrop-filter: blur(4px);
}
.hud-btn:hover {
  background: rgba(40, 181, 181, 0.8);
  border-color: rgba(40, 181, 181, 1);
  transform: scale(1.05);
}
.hud-btn svg {
  width: 18px;
  height: 18px;
}

.hud-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0 0 2px;
}
.progress-bar-bg {
  width: 100%;
  height: 3px;
  background: rgba(255,255,255,0.12);
}
.progress-bar-fill {
  height: 100%;
  background: linear-gradient(to right, #28B5B5, #1F3C88);
  transition: width 1s linear;
}

/* Fade overlay transition */
.fade-overlay-enter-active, .fade-overlay-leave-active { transition: opacity 0.6s ease; }
.fade-overlay-enter-from, .fade-overlay-leave-to { opacity: 0; }

/* Session Meta */
.session-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #0d1829;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  gap: 12px;
  flex-wrap: wrap;
}
.session-meta-left { display: flex; align-items: center; gap: 12px; }
.speaker-avatar {
  width: 44px; height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1F3C88, #28B5B5);
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 1rem; color: white; flex-shrink: 0;
}
.speaker-name { font-weight: 700; color: #f1f5f9; font-size: 0.9rem; margin: 0; }
.speaker-role { font-size: 0.72rem; color: #64748b; margin: 2px 0 0 0; }

.session-meta-right { display: flex; gap: 8px; flex-wrap: wrap; }
.meta-chip {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 600;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  color: #94a3b8;
}
.meta-chip.teal { color: #28B5B5; background: rgba(40,181,181,0.08); border-color: rgba(40,181,181,0.2); }
.meta-chip.orange { color: #F26440; background: rgba(242,100,64,0.08); border-color: rgba(242,100,64,0.2); }

/* Session Description */
.session-description {
  padding: 20px;
  background: #080c1a;
  flex: 1;
}
.session-description h3 {
  font-size: 0.9rem;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0 0 10px 0;
}
.session-description p {
  font-size: 0.82rem;
  color: #64748b;
  line-height: 1.7;
  margin: 0 0 14px 0;
}
.topic-tags { display: flex; gap: 8px; flex-wrap: wrap; }
.topic-tag {
  padding: 3px 10px;
  border-radius: 99px;
  font-size: 0.68rem;
  font-weight: 600;
  background: rgba(31,60,136,0.25);
  color: #a5b4fc;
  border: 1px solid rgba(31,60,136,0.5);
}

/* ══════════════════════════════════════════════
   CHAT PANEL
════════════════════════════════════════════════ */
.chat-panel {
  width: 360px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: #0d1829;
  border-left: 1px solid rgba(40,181,181,0.1);
  overflow: hidden;
  transition: transform 0.3s ease;
}

.chat-header {
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  background: rgba(0,0,0,0.2);
  flex-shrink: 0;
}
.chat-header-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  color: #e2e8f0;
  font-size: 0.9rem;
}
.online-pill {
  display: flex;
  align-items: center;
  gap: 5px;
  background: rgba(34,197,94,0.1);
  color: #4ade80;
  border: 1px solid rgba(34,197,94,0.2);
  border-radius: 99px;
  padding: 3px 10px;
  font-size: 0.68rem;
  font-weight: 700;
}
.online-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #4ade80;
  animation: pulse-dot 2s ease-in-out infinite;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.chat-messages::-webkit-scrollbar { width: 3px; }
.chat-messages::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 99px; }

/* Messages */
.chat-message {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  animation: msgSlide 0.25s ease-out;
}
.chat-message.own-msg { flex-direction: row-reverse; }

@keyframes msgSlide {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

.msg-avatar {
  width: 30px; height: 30px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1F3C88, #28B5B5);
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 0.7rem; color: white; flex-shrink: 0;
}
.msg-avatar.own-avatar {
  background: linear-gradient(135deg, #F26440, #f59e0b);
}

.msg-body { max-width: 80%; display: flex; flex-direction: column; gap: 3px; }
.msg-author { font-size: 0.65rem; font-weight: 700; color: #64748b; padding: 0 4px; }
.msg-author.own-author { text-align: right; color: #F26440; }

.msg-bubble {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 12px;
  border-top-left-radius: 3px;
  padding: 8px 12px;
  font-size: 0.8rem;
  color: #cbd5e1;
  line-height: 1.5;
  word-break: break-word;
}
.msg-bubble.own-bubble {
  background: rgba(31,60,136,0.4);
  border-color: rgba(40,181,181,0.2);
  color: #e2e8f0;
  border-top-left-radius: 12px;
  border-top-right-radius: 3px;
}

.system-notice {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  text-align: center;
  justify-content: center;
  font-size: 0.68rem;
  color: #475569;
  background: rgba(255,255,255,0.03);
  border: 1px dashed rgba(255,255,255,0.06);
  border-radius: 8px;
  padding: 7px 12px;
}

/* Chat Input */
.chat-input-area {
  padding: 12px;
  border-top: 1px solid rgba(255,255,255,0.06);
  background: rgba(0,0,0,0.2);
  flex-shrink: 0;
}
.chat-form { display: flex; gap: 8px; align-items: center; }
.chat-input {
  flex: 1;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  padding: 10px 14px;
  color: #e2e8f0;
  font-size: 0.82rem;
  outline: none;
  font-family: inherit;
  transition: border-color 0.2s;
}
.chat-input::placeholder { color: #475569; }
.chat-input:focus { border-color: rgba(40,181,181,0.4); }

.send-btn {
  width: 40px; height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #1F3C88, #28B5B5);
  border: none;
  color: white;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(40,181,181,0.3);
}
.send-btn:hover:not(:disabled) { transform: scale(1.05); box-shadow: 0 6px 16px rgba(40,181,181,0.4); }
.send-btn:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }
.send-btn svg { width: 16px; height: 16px; }

/* ══════════════════════════════════════════════
   Icon helpers
════════════════════════════════════════════════ */
.icon-xs { width: 12px; height: 12px; }
.icon-sm { width: 16px; height: 16px; }

/* ══════════════════════════════════════════════
   RESPONSIVE
════════════════════════════════════════════════ */
@media (max-width: 900px) {
  .chat-panel {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: min(360px, 100vw);
    z-index: 100;
    transform: translateX(100%);
    border-left: none;
    box-shadow: -8px 0 32px rgba(0,0,0,0.5);
  }
  .chat-panel.mobile-open { transform: translateX(0); }
  .chat-toggle-btn { display: flex; }
  .chat-mobile-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.6);
    z-index: 99;
    backdrop-filter: blur(2px);
  }
}

@media (max-width: 600px) {
  .symposium-header { padding: 8px 12px; }
  .session-title { font-size: 0.82rem; }
  .session-subtitle { display: none; }
  .session-meta { padding: 12px 14px; }
  .session-description { padding: 14px; }
  .meta-chip span:not(.icon-xs) { display: none; }
}
</style>
