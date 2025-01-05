import './globals.css';

import { Analytics } from '@vercel/analytics/react';

export const metadata = {
  title: 'Badminton Match Management System',
  description:
    'A user admin dashboard configured with Next.js, Prisma, Postgres, NextAuth, Tailwind CSS, TypeScript, and Prettier.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen w-full flex-col">{children}</body>
      <Analytics />
    </html>
  );
}
