import { Sequelize, DataTypes } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';
import Plan from './Plan.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../database.sqlite')
});

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  planId: {
    type: DataTypes.INTEGER,
    defaultValue: 1 // Free plan by default
  },
  subscriptionEndDate: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

// Relacionamento com Plan
User.belongsTo(Plan);

// Criar tabela se não existir
(async () => {
  await sequelize.sync();
})();

export default User; 