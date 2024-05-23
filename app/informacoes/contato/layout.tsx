import type { Metadata } from 'next'

export const metadata: Metadata = {
    title : 'Entre em contato',
    keywords:['contato'],
}

export default function ContactLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div>
          {children}
      </div>
    );
  }
  