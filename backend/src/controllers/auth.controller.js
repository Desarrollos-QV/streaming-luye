const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const JWT_SECRET = process.env.JWT_SECRET || 'luyelive_super_secret_key';

const registerDoctor = async (req, res) => {
  try {
    const { name, email, specialty, country } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ where: { email } });
    if (user) {
      // Si ya existe, le damos acceso (es un simposio, podemos permitir que se re-loguee con su email)
      // O podemos retornar un error, pero para usabilidad de simposio es mejor dejarlo pasar o actualizar
      user.name = name;
      user.specialty = specialty;
      user.country = country;
      await user.save();
    } else {
      user = await User.create({
        name,
        email,
        specialty,
        country,
        role: 'doctor'
      });
    }

    const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '12h' });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email, role: 'admin' } });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  registerDoctor,
  loginAdmin
};
