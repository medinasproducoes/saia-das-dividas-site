// functions/api/webhook-infinitepay.js — Cloudflare Pages Function
export async function onRequestPost(context) {
  try {
    const data = await context.request.json();
    console.log('Venda confirmada via webhook (Saia das Dividas):', {
      order_nsu: data.order_nsu,
      transaction_nsu: data.transaction_nsu,
      amount: data.paid_amount
    });
    return new Response(JSON.stringify({ received: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ received: true, note: 'error logged' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
}
