<template>
  <div class="flex-grow flex items-center justify-center p-6 animate-fade-in">
    <div class="glass w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
      <!-- Sección Izquierda: Banner/Info -->
      <div class="md:w-1/2 bg-gradient-to-br from-luye-navy to-luye-teal p-10 text-white flex flex-col justify-center relative overflow-hidden">
        <div class="absolute inset-0 bg-black opacity-20"></div>
        <div class="relative z-10">
          <h1 class="text-4xl font-bold mb-4 leading-tight" v-html="$t('landing.title')"></h1>
          <p class="text-lg opacity-90 mb-8">{{ $t('landing.subtitle') }}</p>
          
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-white/20 rounded-lg backdrop-blur-sm"><GlobeIcon class="w-5 h-5" /></div>
              <span>{{ $t('landing.feature1') }}</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="p-2 bg-white/20 rounded-lg backdrop-blur-sm"><VideoIcon class="w-5 h-5" /></div>
              <span>{{ $t('landing.feature2') }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Sección Derecha: Formulario de Registro -->
      <div class="md:w-1/2 p-10 bg-white">
        <h2 class="text-2xl font-bold text-luye-navy mb-6">{{ $t('landing.registerTitle') }}</h2>
        
        <form @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('landing.nameLabel') }}</label>
            <input v-model="form.name" required type="text" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-luye-teal focus:border-transparent outline-none transition-all" :placeholder="$t('landing.namePlaceholder')" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('landing.emailLabel') }}</label>
            <input v-model="form.email" required type="email" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-luye-teal focus:border-transparent outline-none transition-all" :placeholder="$t('landing.emailPlaceholder')" />
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('landing.specialtyLabel') }}</label>
              <input v-model="form.specialty" required type="text" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-luye-teal focus:border-transparent outline-none transition-all" :placeholder="$t('landing.specialtyPlaceholder')" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('landing.countryLabel') }}</label>
              <input v-model="form.country" required type="text" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-luye-teal focus:border-transparent outline-none transition-all" :placeholder="$t('landing.countryPlaceholder')" />
            </div>
          </div>

          <button type="submit" class="w-full mt-6 bg-gradient-to-r from-luye-orange to-red-500 hover:from-red-500 hover:to-luye-orange text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
            <span>{{ $t('landing.submitBtn') }}</span>
            <ArrowRightIcon class="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { GlobeIcon, VideoIcon, ArrowRightIcon } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const route = useRoute();
const { t, locale } = useI18n();

const form = ref({
  name: '',
  email: '',
  specialty: '',
  country: ''
});

onMounted(() => {
  // Extraer el idioma desde la ruta de redirección si existe
  const redirectUrl = route.query.redirect;
  if (redirectUrl) {
    const langMatch = redirectUrl.match(/^\/live\/(es|en|pt)/);
    if (langMatch) {
      locale.value = langMatch[1];
    }
  }

  // Si ya tiene un token/usuario, pasarlo directo (no necesita registrarse de nuevo)
  const token = localStorage.getItem('token');
  const userName = localStorage.getItem('userName');
  if (token && userName) {
    router.push(redirectUrl || '/live/' + locale.value);
  }
});

const handleRegister = async () => {
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form.value)
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || t('landing.errorReg'));
    }

    const data = await res.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    
    // Guardamos nombre en localStorage para usarlo en el chat
    localStorage.setItem('userName', form.value.name);
    
    // Redirigir a la sala de transmisión (usar redirect si existe)
    const redirectUrl = route.query.redirect || '/live/' + locale.value;
    router.push(redirectUrl);
  } catch (error) {
    alert(error.message || t('landing.errorReg'));
  }
};
</script>
