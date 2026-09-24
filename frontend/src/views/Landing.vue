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
              <select v-model="form.specialty" required class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-luye-teal focus:border-transparent outline-none transition-all bg-white text-gray-700">
                <option value="" disabled selected>{{ $t('landing.specialtyPlaceholder') }}</option>
                <option value="alergologo">alergologo</option>
                <option value="anestesiologo">anestesiologo</option>
                <option value="cardiologo">cardiologo</option>
                <option value="cardiologo_intervencionista">cardiologo intervencionista</option>
                <option value="cirujano_general">cirujano general</option>
                <option value="cirujano_plastico">cirujano plastico</option>
                <option value="dermatologo">dermatologo</option>
                <option value="endocrinologo">endocrinologo</option>
                <option value="especialista_manejo_dolor">especialista manejo dolor</option>
                <option value="especialista_enfermedades_contagiosas">especialista enfermedades contagiosas</option>
                <option value="especialista_fisioterapia_rehabilitacion">especialista fisioterapia rehabilitacion</option>
                <option value="especialista_medicina_urgencias">especialista medicina urgencias</option>
                <option value="especialista_medicina_deporte">especialista medicina deporte</option>
                <option value="especialista_medicina_hiperbarica">especialista medicina hiperbarica</option>
                <option value="especialista_medicina_intensiva">especialista medicina intensiva</option>
                <option value="especialista_medicina_laboral">especialista medicina laboral</option>
                <option value="especialista_medicina_nuclear">especialista medicina nuclear</option>
                <option value="especialista_cuidados_paliativos">especialista cuidados paliativos</option>
                <option value="especialista_trastornos_sueno">especialista trastornos sueno</option>
                <option value="gastroenterologo">gastroenterologo</option>
                <option value="geriatria">geriatria</option>
                <option value="ginecologo">ginecologo</option>
                <option value="hematologo">hematologo</option>
                <option value="hepatologo">hepatologo</option>
                <option value="hospitalista">hospitalista</option>
                <option value="inmunologo">inmunologo</option>
                <option value="medicina_general">medicina general</option>
                <option value="medicina_interna">medicina interna</option>
                <option value="medico_forense">medico forense</option>
                <option value="medico_genetico">medico genetico</option>
                <option value="nefrologo">nefrologo</option>
                <option value="neonatologo">neonatologo</option>
                <option value="neumologo">neumologo</option>
                <option value="neurologo">neurologo</option>
                <option value="obstetra">obstetra</option>
                <option value="oftalmologo">oftalmologo</option>
                <option value="oncologo">oncologo</option>
                <option value="oncologo_ginecologico">oncologo ginecologico</option>
                <option value="oncologo_radiologo">oncologo radiologo</option>
                <option value="otorrinolaringologo">otorrinolaringologo</option>
                <option value="patologo">patologo</option>
                <option value="patologo_forense">patologo forense</option>
                <option value="pediatra">pediatra</option>
                <option value="pediatra_especialista_desarrollo">pediatra especialista desarrollo</option>
                <option value="perinatologo">perinatologo</option>
                <option value="psiquiatra">psiquiatra</option>
                <option value="psiquiatra_especialista_adicciones">psiquiatra especialista adicciones</option>
                <option value="radiologo">radiologo</option>
                <option value="reumatologo">reumatologo</option>
                <option value="urologo">urologo</option>
                <option value="otro">otro</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('landing.countryLabel') }}</label>
              <select v-model="form.country" required class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-luye-teal focus:border-transparent outline-none transition-all bg-white text-gray-700">
                <option value="" disabled selected>{{ $t('landing.countryPlaceholder') }}</option>
                <option value="Argentina">Argentina</option>
                <option value="Brasil">Brasil</option>
                <option value="Centroamérica">Centroamérica</option>
                <option value="Colombia">Colombia</option>
                <option value="Chile">Chile</option>
                <option value="Ecuador">Ecuador</option>
                <option value="México">México</option>
                <option value="Perú">Perú</option>
                <option value="Uruguay">Uruguay</option>
              </select>
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
