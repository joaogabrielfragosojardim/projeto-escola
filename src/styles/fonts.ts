import { Noto_Sans, Noto_Serif } from 'next/font/google';

export const notoSans = Noto_Sans({
  subsets: ['latin'],
  variable: '--font-noto-sans',
  display: 'swap',
  weight: [
    '100',
    '200',
    '300',
    '400',
    '400',
    '500',
    '600',
    '700',
    '800',
    '900',
  ],
});

export const notoSerif = Noto_Serif({
  subsets: ['latin'],
  variable: '--font-noto-serif',
  display: 'swap',
  weight: [
    '100',
    '200',
    '300',
    '400',
    '400',
    '500',
    '600',
    '700',
    '800',
    '900',
  ],
});
