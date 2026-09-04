const Setting = require('../models/Setting');
const translate = require('google-translate-api-x');

// Obtener todas las configuraciones
exports.getSettings = async (req, res) => {
  try {
    const settings = await Setting.findAll();
    const config = {};
    settings.forEach(s => {
      config[s.key] = s.value;
    });
    
    // Default values if not set
    if (!config.title) config.title = 'Avances en Oncología Farmacológica 2026';
    if (!config.title_es) config.title_es = 'Avances en Oncología Farmacológica 2026';
    if (!config.title_en) config.title_en = 'Advances in Pharmacological Oncology 2026';
    if (!config.title_pt) config.title_pt = 'Avanços em Oncologia Farmacológica 2026';
    
    if (!config.speakerName) config.speakerName = 'Dr. Alexander Smith';
    
    if (!config.speakerRole) config.speakerRole = 'Director, Luye Pharma Oncology Division';
    if (!config.speakerRole_es) config.speakerRole_es = 'Director, División de Oncología Luye Pharma';
    if (!config.speakerRole_en) config.speakerRole_en = 'Director, Luye Pharma Oncology Division';
    if (!config.speakerRole_pt) config.speakerRole_pt = 'Diretor, Divisão de Oncologia Luye Pharma';
    if (!config.videoUrlEs) config.videoUrlEs = 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4';
    if (!config.videoUrlEn) config.videoUrlEn = 'https://test-videos.co.uk/vids/jellyfish/mp4/h264/720/Jellyfish_720_10s_1MB.mp4';
    if (!config.videoUrlPt) config.videoUrlPt = 'https://test-videos.co.uk/vids/sintel/mp4/h264/720/Sintel_720_10s_1MB.mp4';

    res.json(config);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Error fetching settings' });
  }
};

// Actualizar configuraciones
exports.updateSettings = async (req, res) => {
  try {
    const updates = req.body;
    const finalUpdates = { ...updates };
    
    // Traducir dinámicamente si vienen en el body
    if (updates.title) {
       finalUpdates.title_es = updates.title;
       const trEn = await translate(updates.title, { to: 'en' });
       const trPt = await translate(updates.title, { to: 'pt' });
       finalUpdates.title_en = trEn.text;
       finalUpdates.title_pt = trPt.text;
    }
    
    if (updates.speakerRole) {
       finalUpdates.speakerRole_es = updates.speakerRole;
       const trEn = await translate(updates.speakerRole, { to: 'en' });
       const trPt = await translate(updates.speakerRole, { to: 'pt' });
       finalUpdates.speakerRole_en = trEn.text;
       finalUpdates.speakerRole_pt = trPt.text;
    }

    for (const key of Object.keys(finalUpdates)) {
      await Setting.upsert({
        key: key,
        value: finalUpdates[key]
      });
    }
    
    // Retornamos el config final para que el admin pueda sincronizar con los demás
    res.json({ message: 'Settings updated successfully', settings: finalUpdates });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Error updating settings' });
  }
};
