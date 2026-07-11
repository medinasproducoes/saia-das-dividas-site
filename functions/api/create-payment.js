// functions/api/create-payment.js — Cloudflare Pages Function
export async function onRequestPost(context) {
  const headers = { 'Content-Type': 'application/json' };

  try {
    const SITE_URL = new URL(context.request.url).origin;
    const orderNsu = `saia-dividas-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const payload = {
      handle: 'medina_pay',
      items: [
        { quantity: 1, price: 3790, description: 'Saia das Dívidas de Uma Vez por Todas - Acesso Vitalício' }
      ],
      order_nsu: orderNsu,
      redirect_url: `${SITE_URL}/obrigado.html`,
      webhook_url: `${SITE_URL}/api/webhook-infinitepay`
    };

    const response = await fetch('https://api.checkout.infinitepay.io/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Não foi possível gerar o link de pagamento', details: data }), { status: 502, headers });
    }

    const paymentUrl = data.url || data.payment_url || data.link || data.checkout_url;
    if (!paymentUrl) {
      return new Response(JSON.stringify({ error: 'Resposta da InfinitePay sem link de pagamento' }), { status: 502, headers });
    }

    return new Response(JSON.stringify({ url: paymentUrl, order_nsu: orderNsu }), { status: 200, headers });

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Erro interno ao gerar link de pagamento' }), { status: 500, headers });
  }
}
