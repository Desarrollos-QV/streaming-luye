import { createI18n } from 'vue-i18n';

const messages = {
  es: {
    live: 'EN VIVO',
    waiting: 'EN ESPERA',
    symposiumStarting: 'El Simposio comenzará en breve',
    keepOpen: 'Por favor, mantén esta ventana abierta.',
    thankYou: '¡Gracias por su participación!',
    thankYouDesc: 'El simposio ha concluido. Puede cerrar esta ventana.',
    onlineCount: 'conectados',
    aboutSession: 'Acerca de esta sesión',
    sessionDesc: 'Esta sesión aborda los recientes avances farmacológicos y estudios clínicos de fase III en oncología. El panel de expertos discutirá la eficacia comparativa de los tratamientos moleculares dirigidos y las perspectivas a largo plazo de la inmunoterapia combinada para tumores sólidos de difícil acceso quirúrgico.',
    tags: {
      oncology: 'Oncología',
      immunotherapy: 'Inmunoterapia',
      phase3: 'Fase III',
      molecular: 'Farmacología Molecular'
    },
    chat: {
      title: 'Chat en Vivo',
      online: 'Online',
      systemWelcome: '✅ Bienvenido/a al Simposio Global Luye. El chat está moderado.',
      placeholder: 'Escribe una pregunta o comentario...',
      you: 'Tú'
    },
    meta: {
      date: 'Sep 4, 2026',
      duration: '90 min',
      broadcasting: 'En Transmisión'
    }
  },
  en: {
    live: 'LIVE',
    waiting: 'WAITING',
    symposiumStarting: 'The Symposium will begin shortly',
    keepOpen: 'Please keep this window open.',
    thankYou: 'Thank you for your participation!',
    thankYouDesc: 'The symposium has concluded. You may close this window.',
    onlineCount: 'online',
    aboutSession: 'About this session',
    sessionDesc: 'This session addresses recent pharmacological advances and phase III clinical trials in oncology. The expert panel will discuss the comparative efficacy of targeted molecular therapies and long-term prospects of combination immunotherapy for hard-to-reach solid tumors.',
    tags: {
      oncology: 'Oncology',
      immunotherapy: 'Immunotherapy',
      phase3: 'Phase III',
      molecular: 'Molecular Pharmacology'
    },
    chat: {
      title: 'Live Chat',
      online: 'Online',
      systemWelcome: '✅ Welcome to the Luye Global Symposium. This chat is moderated.',
      placeholder: 'Write a question or comment...',
      you: 'You'
    },
    meta: {
      date: 'Sep 4, 2026',
      duration: '90 min',
      broadcasting: 'Broadcasting'
    }
  },
  pt: {
    live: 'AO VIVO',
    waiting: 'AGUARDANDO',
    symposiumStarting: 'O Simpósio começará em breve',
    keepOpen: 'Por favor, mantenha esta janela aberta.',
    thankYou: 'Obrigado pela sua participação!',
    thankYouDesc: 'O simpósio foi concluído. Você pode fechar esta janela.',
    onlineCount: 'conectados',
    aboutSession: 'Sobre esta sessão',
    sessionDesc: 'Esta sessão aborda os recentes avanços farmacológicos e ensaios clínicos de fase III em oncologia. O painel de especialistas discutirá a eficácia comparativa dos tratamentos moleculares direcionados e as perspectivas de longo prazo da imunoterapia combinada para tumores sólidos de difícil acesso cirúrgico.',
    tags: {
      oncology: 'Oncologia',
      immunotherapy: 'Imunoterapia',
      phase3: 'Fase III',
      molecular: 'Farmacologia Molecular'
    },
    chat: {
      title: 'Chat ao Vivo',
      online: 'Online',
      systemWelcome: '✅ Bem-vindo ao Simpósio Global Luye. O chat é moderado.',
      placeholder: 'Escreva uma pergunta ou comentário...',
      you: 'Você'
    },
    meta: {
      date: '4 Set, 2026',
      duration: '90 min',
      broadcasting: 'Em Transmissão'
    }
  }
};

const i18n = createI18n({
  legacy: false,
  locale: 'es',
  fallbackLocale: 'en',
  messages,
});

export default i18n;
