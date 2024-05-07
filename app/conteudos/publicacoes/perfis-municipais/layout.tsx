import type { Metadata } from 'next'

export const metadata: Metadata = {
    title : 'Perfis Municipais: Economia, Sociedade e Política - Daddus Consultoria',
    description: 'Tem curiosidade de saber sobre os dados econômicos, sociais e políticos da sua cidade? Confira nossa lista.',
    keywords:['dados dos municipios', 'minha cidade', 'economia local'],
}

export default function MunicipalProfileLayout({
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
  