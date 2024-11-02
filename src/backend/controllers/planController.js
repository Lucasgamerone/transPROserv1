import Plan from '../models/Plan.js';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';

export const getPlans = async (req, res) => {
  try {
    const plans = await Plan.findAll();
    res.json(plans);
  } catch (error) {
    console.error('Erro ao buscar planos:', error);
    res.status(500).json({ message: 'Erro ao buscar planos' });
  }
};

export const subscribeToPlan = async (req, res) => {
  try {
    const { userId, planId, paymentStatus, transactionId, webhookSecret } = req.body;
    
    // Verificação básica de segurança do webhook
    if (webhookSecret !== process.env.WEBHOOK_SECRET) {
      return res.status(401).json({ message: 'Webhook não autorizado' });
    }

    if (paymentStatus !== 'completed') {
      return res.status(400).json({ message: 'Pagamento não confirmado' });
    }

    // Calcula data de expiração (1 mês)
    const subscriptionEndDate = new Date();
    subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);

    // Atualiza usuário
    await User.update({
      planId,
      subscriptionEndDate,
      lastTransactionId: transactionId
    }, {
      where: { id: userId }
    });

    // Registra a transação
    await Transaction.create({
      userId,
      planId,
      transactionId,
      amount: (await Plan.findByPk(planId)).price,
      status: 'completed',
      date: new Date()
    });

    res.json({ 
      message: 'Assinatura realizada com sucesso',
      subscriptionEndDate,
      transactionId 
    });
  } catch (error) {
    console.error('Erro ao assinar plano:', error);
    res.status(500).json({ message: 'Erro ao processar assinatura' });
  }
};

// Novo endpoint para webhook de renovação
export const renewSubscription = async (req, res) => {
  try {
    const { userId, transactionId, webhookSecret } = req.body;

    if (webhookSecret !== process.env.WEBHOOK_SECRET) {
      return res.status(401).json({ message: 'Webhook não autorizado' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Estende a assinatura por mais um mês
    const newEndDate = new Date(user.subscriptionEndDate);
    newEndDate.setMonth(newEndDate.getMonth() + 1);

    await user.update({
      subscriptionEndDate: newEndDate,
      lastTransactionId: transactionId
    });

    res.json({
      message: 'Assinatura renovada com sucesso',
      subscriptionEndDate: newEndDate,
      transactionId
    });
  } catch (error) {
    console.error('Erro ao renovar assinatura:', error);
    res.status(500).json({ message: 'Erro ao renovar assinatura' });
  }
}; 