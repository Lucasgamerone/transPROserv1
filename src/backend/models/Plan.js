import { Sequelize, DataTypes } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../database.sqlite')
});

const Plan = sequelize.define('Plan', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  features: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

// Criar planos padrão se não existirem
(async () => {
  await sequelize.sync();
  
  const plans = await Plan.findAll();
  if (plans.length === 0) {
    await Plan.bulkCreate([
      {
        name: 'Free',
        price: 0,
        features: JSON.stringify([
          'Análise básica de tom',
          'Limite de 5 músicas por dia',
          'Exportação em formato básico'
        ])
      },
      {
        name: 'Basic',
        price: 4.99,
        features: JSON.stringify([
          'Análise avançada de tom',
          'Músicas ilimitadas',
          'Exportação em múltiplos formatos',
          'Suporte prioritário',
          'Sem anúncios'
        ])
      }
    ]);
  }
})();

export default Plan; 