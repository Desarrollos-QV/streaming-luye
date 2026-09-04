const express = require('express');
const { registerDoctor, loginAdmin } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register', registerDoctor);
router.post('/admin-login', loginAdmin);

module.exports = router;
