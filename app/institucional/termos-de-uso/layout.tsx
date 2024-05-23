import type { Metadata } from 'next'

export const metadata: Metadata = {
    title : 'Termos de Uso - Daddus Consultoria',
}

export default function TermsLayout({
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
  