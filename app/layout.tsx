import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Acme Dashboard',
    default: 'Acme Dashboard',
  },
  description: 'Learning NextJS',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} overflow-y-auto antialiased md:overflow-y-hidden`}
      >
        {children}
      </body>
      <script src="https://cdn.amcharts.com/lib/version/5.9.12/index.js"></script>
      <script src="https://cdn.amcharts.com/lib/version/5.9.12/map.js"></script>
      <script src="https://cdn.amcharts.com/lib/5/geodata/worldLow.js"></script>
      <script src="https://cdn.amcharts.com/lib/version/5.9.12/themes/Animated.js"></script>
    </html>
  );
}
