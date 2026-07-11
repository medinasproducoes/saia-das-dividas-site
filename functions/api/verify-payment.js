// functions/api/verify-payment.js — Cloudflare Pages Function
export async function onRequestPost(context) {
  const headers = { 'Content-Type': 'application/json' };

  try {
    const { handle, order_nsu, transaction_nsu, slug } = await context.request.json();

    if (!handle || !order_nsu || !transaction_nsu || !slug) {
      return new Response(JSON.stringify({ paid: false, error: 'Parâmetros incompletos' }), { status: 400, headers });
    }

    const response = await fetch('https://api.checkout.infinitepay.io/payment_check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ handle, order_nsu, transaction_nsu, slug })
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ paid: false, error: 'Erro ao verificar pagamento' }), { status: 200, headers });
    }

    const data = await response.json();

    return new Response(JSON.stringify({
      paid: data.paid === true && data.success === true,
      amount: data.paid_amount,
      receipt: data.receipt_url || null
    }), { status: 200, headers });

  } catch (err) {
    return new Response(JSON.stringify({ paid: false, error: 'Erro interno' }), { status: 200, headers });
  }
}
