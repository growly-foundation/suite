import localFont from 'next/font/local';

export const coinbaseFont = localFont({
  src: [
    {
      path: '../public/fonts/CoinbaseSans-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/CoinbaseSans-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/CoinbaseSans-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-coinbase',
});
