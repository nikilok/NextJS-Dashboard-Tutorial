import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';

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
    </html>
  );
}
