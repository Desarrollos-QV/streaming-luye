<template>
  <div class="flex-grow flex items-center justify-center p-6 animate-fade-in">
    <div class="glass w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
      <!-- Sección Izquierda: Banner/Info -->
      <div class="md:w-1/2 bg-gradient-to-br from-luye-navy to-luye-teal p-10 text-white flex flex-col justify-center relative overflow-hidden">
        <div class="absolute inset-0 bg-black opacity-20"></div>
        <div class="relative z-10">
          <h1 class="text-4xl font-bold mb-4 leading-tight">Global Medical<br/>Symposium 2026</h1>
          <p class="text-lg opacity-90 mb-8">Únete a líderes mundiales en la industria farmacéutica y descubre los últimos avances científicos.</p>
          
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-white/20 rounded-lg backdrop-blur-sm"><GlobeIcon class="w-5 h-5" /></div>
              <span>Transmisión en 3 idiomas</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="p-2 bg-white/20 rounded-lg backdrop-blur-sm"><VideoIcon class="w-5 h-5" /></div>
              <span>Acceso exclusivo en vivo</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Sección Derecha: Formulario de Registro -->
      <div class="md:w-1/2 p-10 bg-white">
        <h2 class="text-2xl font-bold text-luye-navy mb-6">Registro de Especialista</h2>
        
        <form @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
            <input v-model="form.name" required type="text" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-luye-teal focus:border-transparent outline-none transition-all" placeholder="Dr. Juan Pérez" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
            <input v-model="form.email" required type="email" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-luye-teal focus:border-transparent outline-none transition-all" placeholder="juan.perez@hospital.com" />
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Especialidad</label>
              <input v-model="form.specialty" required type="text" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-luye-teal focus:border-transparent outline-none transition-all" placeholder="Ej. Oncología" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">País</label>
              <input v-model="form.country" required type="text" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-luye-teal focus:border-transparent outline-none transition-all" placeholder="Ej. México" />
            </div>
          </div>

          <button type="submit" class="w-full mt-6 bg-gradient-to-r from-luye-orange to-red-500 hover:from-red-500 hover:to-luye-orange text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
            <span>Ingresar al Simposio</span>
            <ArrowRightIcon class="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { GlobeIcon, VideoIcon, ArrowRightIcon } from 'lucide-vue-next';

const router = useRouter();
const route = useRoute();
const form = ref({
  name: '',
  email: '',
  specialty: '',
  country: ''
});

const handleRegister = async () => {
  // Simularemos la llamada al backend por ahora
  try {
    /* En producción:
    const res = await axios.post('/api/auth/register', form.value);
    localStorage.setItem('token', res.data.token);
    */
    
    // Guardamos nombre en localStorage para usarlo en el chat
    localStorage.setItem('userName', form.value.name);
    
    // Redirigir a la sala de transmisión (usar redirect si existe)
    const redirectUrl = route.query.redirect || '/live/es';
    router.push(redirectUrl);
  } catch (error) {
    alert('Error al registrarse');
  }
};
</script>
