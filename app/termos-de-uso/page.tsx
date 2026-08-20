import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso | Daddus Consultoria",
  description: "Consulte os termos e condições de uso do site da Daddus Consultoria.",
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-4xl px-5 py-12 text-gray-700">
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">Daddus Consultoria</p>
      <h1 className="mt-2 text-3xl font-bold text-[#0d0d0d]">Termos de Uso</h1>
      <p className="mt-4 text-sm text-gray-500">Última atualização: 20 de agosto de 2026</p>

      <div className="mt-8 space-y-8 leading-7">
        <section><h2 className="text-xl font-bold text-[#0d0d0d]">1. Aceitação</h2><p className="mt-2">Ao acessar este site, você concorda com estes termos. Caso não concorde, interrompa o uso do site.</p></section>
        <section><h2 className="text-xl font-bold text-[#0d0d0d]">2. Conteúdo e propriedade intelectual</h2><p className="mt-2">Textos, marcas, imagens e demais materiais são protegidos pela legislação aplicável. O conteúdo pode ser consultado para uso pessoal e informativo, sem reprodução comercial ou alteração sem autorização.</p></section>
        <section><h2 className="text-xl font-bold text-[#0d0d0d]">3. Uso adequado</h2><p className="mt-2">É proibido utilizar o site para atividades ilícitas, tentar comprometer sua segurança, enviar código malicioso ou coletar dados de terceiros sem autorização.</p></section>
        <section><h2 className="text-xl font-bold text-[#0d0d0d]">4. Cookies e anúncios</h2><p className="mt-2">O site pode utilizar cookies para funcionamento, análise e preferências. Também pode exibir anúncios do Google AdSense, que pode usar cookies e tecnologias semelhantes para veicular e medir publicidade conforme suas políticas. Mais informações estão na nossa <a className="font-semibold text-primary underline" href="/politica-de-privacidade">Política de Privacidade</a>.</p></section>
        <section><h2 className="text-xl font-bold text-[#0d0d0d]">5. Disponibilidade e links externos</h2><p className="mt-2">Buscamos manter o site disponível e atualizado, mas não garantimos funcionamento ininterrupto. Links de terceiros são fornecidos por conveniência, e seus conteúdos possuem políticas próprias.</p></section>
        <section><h2 className="text-xl font-bold text-[#0d0d0d]">6. Alterações</h2><p className="mt-2">Estes termos podem ser atualizados para refletir mudanças legais ou operacionais. A versão vigente será publicada nesta página.</p></section>
      </div>
    </article>
  );
}