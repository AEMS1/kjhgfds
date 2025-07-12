// لیست پویا توکن‌ها با ساختار { symbol, address, decimals, coingeckoId }
const tokens = [
  { symbol: "BNB", address: "0x0000000000000000000000000000000000000000", decimals: 18, coingeckoId: "binancecoin" }, // BNB خاص
  { symbol: "AMS", address: "0x887ada8fe79740b913De549f81014f37e2f8D07a", decimals: 18, coingeckoId: "aems" },
  { symbol: "USDT", address: "0x55d398326f99059ff775485246999027b3197955", decimals: 18, coingeckoId: "tether" },
  { symbol: "ETH", address: "0x2170ed0880ac9a755fd29b2688956bd959f933f8", decimals: 18, coingeckoId: "ethereum" }
];

// برای اضافه کردن توکن جدید فقط این آرایه را گسترش بده
