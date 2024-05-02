import type { Metadata } from 'next'

export const metadata: Metadata = {
    title : 'Guias: Elabore Documentos e Cálculos Econômicos - Daddus Consultoria',
    description: 'Confira nossos manuais de como elaborar documentos e cálculos econômicos úteis no formato de guias completos.',
    keywords:['manual', 'como fazer'],
}

export default function GuidesPublicationsLayout({
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
  