const sequelize = require('./src/config/database');
const User = require('./src/models/User');
const bcrypt = require('bcrypt');

async function seedAdmin() {
  try {
    await sequelize.sync();
    const adminEmail = 'admin@luyelive.com';
    const existingAdmin = await User.findOne({ where: { email: adminEmail } });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        name: 'Administrador Principal',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      });
      console.log('✅ Admin user created successfully (admin@luyelive.com / admin123)');
    } else {
      console.log('ℹ️ Admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
  } finally {
    process.exit();
  }
}

seedAdmin();
