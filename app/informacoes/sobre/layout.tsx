import type { Metadata } from 'next'

export const metadata: Metadata = {
    title : 'Sobre Nós - Daddus Consultoria',
    description: 'Conheça a Daddus e saiba mais sobre o que fazemos, nossa missão e valores. Clique e acesse agora.',
    keywords:['daddus', 'consultoria publica'],
}

export default function AboutLayout({
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
  