import type { Metadata } from 'next'

export const metadata: Metadata = {
    title : 'Estudos: Análises Econômicas Profundas  - Daddus Consultoria',
    description: 'A Daddus é responsável por elaborar, promover e difundir estudos, pesquisas e informações relevantes para a população brasileira.',
    keywords:['estudo economico', 'estudo de vantajosidade', 'estudo de viabilidade'],
}

export default function StudyPublicationsLayout({
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
  