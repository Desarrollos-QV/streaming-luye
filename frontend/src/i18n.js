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
    },
    landing: {
      title: 'Global Medical<br/>Symposium 2026',
      subtitle: 'Únete a líderes mundiales en la industria farmacéutica y descubre los últimos avances científicos.',
      feature1: 'Transmisión en 3 idiomas',
      feature2: 'Acceso exclusivo en vivo',
      registerTitle: 'Registro de Especialista',
      nameLabel: 'Nombre Completo',
      namePlaceholder: 'Dr. Juan Pérez',
      emailLabel: 'Correo Electrónico',
      emailPlaceholder: 'juan.perez{\'@\'}hospital.com',
      specialtyLabel: 'Especialidad',
      specialtyPlaceholder: 'Ej. Oncología',
      countryLabel: 'País',
      countryPlaceholder: 'Ej. México',
      submitBtn: 'Ingresar al Simposio',
      errorReg: 'Error al registrarse'
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
    },
    landing: {
      title: 'Global Medical<br/>Symposium 2026',
      subtitle: 'Join world leaders in the pharmaceutical industry and discover the latest scientific advances.',
      feature1: 'Broadcast in 3 languages',
      feature2: 'Exclusive live access',
      registerTitle: 'Specialist Registration',
      nameLabel: 'Full Name',
      namePlaceholder: 'Dr. John Doe',
      emailLabel: 'Email Address',
      emailPlaceholder: 'john.doe{\'@\'}hospital.com',
      specialtyLabel: 'Specialty',
      specialtyPlaceholder: 'E.g. Oncology',
      countryLabel: 'Country',
      countryPlaceholder: 'E.g. United States',
      submitBtn: 'Enter Symposium',
      errorReg: 'Registration Error'
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
    },
    landing: {
      title: 'Global Medical<br/>Symposium 2026',
      subtitle: 'Junte-se a líderes mundiais na indústria farmacêutica e descubra os mais recentes avanços científicos.',
      feature1: 'Transmissão em 3 idiomas',
      feature2: 'Acesso exclusivo ao vivo',
      registerTitle: 'Registro de Especialista',
      nameLabel: 'Nome Completo',
      namePlaceholder: 'Dr. João Silva',
      emailLabel: 'Correio Eletrônico',
      emailPlaceholder: 'joao.silva{\'@\'}hospital.com',
      specialtyLabel: 'Especialidade',
      specialtyPlaceholder: 'Ex. Oncologia',
      countryLabel: 'País',
      countryPlaceholder: 'Ex. Brasil',
      submitBtn: 'Entrar no Simpósio',
      errorReg: 'Erro ao registrar'
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
