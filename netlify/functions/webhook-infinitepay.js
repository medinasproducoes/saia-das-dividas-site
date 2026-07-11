// netlify/functions/webhook-infinitepay.js
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' };

  try {
    const data = JSON.parse(event.body);
    console.log('Venda confirmada via webhook (Saia das Dividas):', {
      order_nsu: data.order_nsu,
      transaction_nsu: data.transaction_nsu,
      amount: data.paid_amount,
      receipt: data.receipt_url
    });
    return { statusCode: 200, body: JSON.stringify({ received: true }) };
  } catch (err) {
    console.error('Erro ao processar webhook:', err);
    return { statusCode: 200, body: JSON.stringify({ received: true, note: 'error logged' }) };
  }
};
