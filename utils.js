// توابع کمکی
const feePercent = 1; // 1 درصد

// محاسبه مقدار کارمزد
function calculateFee(amount) {
  return amount * feePercent / 100;
}

// محاسبه مقدار دریافتی بعد از کسر کارمزد
function amountAfterFee(amount) {
  return amount - calculateFee(amount);
}

// گرفتن قیمت دلار توکن با استفاده از API کوین‌گکو
async function getTokenPriceUsd(coingeckoId) {
  if (!coingeckoId) return null;
  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoId}&vs_currencies=usd`);
    const data = await res.json();
    return data[coingeckoId]?.usd ?? null;
  } catch {
    return null;
  }
}
