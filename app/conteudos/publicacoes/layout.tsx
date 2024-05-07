import type { Metadata } from 'next'

export const metadata: Metadata = {
    title : 'Publicações: Estudos, Guias e Perfis Municipais - Daddus Consultoria',
    description: 'Explore nossos estudos econômicos, guias práticos para economistas e perfis detalhados sobre aspectos econômicos, sociais e políticos dos municípios. Descubra insights valiosos na Daddus Consultoria.',
    keywords:['estudo economico', 'manual', 'dados dos municipios'],
}

export default function PublicationsLayout({
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
  