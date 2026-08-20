import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade | Daddus Consultoria",
  description: "Conheça como a Daddus Consultoria trata dados pessoais, cookies e publicidade no site.",
};

export default function PrivacyPolicyPage() {
  return (
    <article className="mx-auto max-w-4xl px-5 py-12 text-gray-700">
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">Daddus Consultoria</p>
      <h1 className="mt-2 text-3xl font-bold text-[#0d0d0d]">Política de Privacidade</h1>
      <p className="mt-4 text-sm text-gray-500">Última atualização: 20 de agosto de 2026</p>

      <div className="mt-8 space-y-8 leading-7">
        <section><h2 className="text-xl font-bold text-[#0d0d0d]">1. Compromisso com a privacidade</h2><p className="mt-2">A Daddus Consultoria respeita a privacidade dos visitantes e trata dados pessoais de acordo com a legislação aplicável, incluindo a Lei Geral de Proteção de Dados (LGPD).</p></section>
        <section><h2 className="text-xl font-bold text-[#0d0d0d]">2. Dados coletados</h2><p className="mt-2">Podemos coletar dados fornecidos voluntariamente em formulários, como nome, e-mail e informações de contato, além de dados técnicos e de navegação necessários para segurança, funcionamento e melhoria do site.</p></section>
        <section><h2 className="text-xl font-bold text-[#0d0d0d]">3. Finalidades e compartilhamento</h2><p className="mt-2">Os dados são utilizados para responder solicitações, oferecer serviços, manter o ambiente seguro, produzir métricas e melhorar a experiência. Não vendemos dados pessoais. O compartilhamento ocorre apenas quando necessário para operar o site, cumprir obrigação legal ou proteger direitos.</p></section>
        <section><h2 className="text-xl font-bold text-[#0d0d0d]">4. Cookies</h2><p className="mt-2">Utilizamos cookies necessários, de análise e de preferências. Você pode controlar cookies nas configurações do navegador, embora isso possa limitar alguns recursos do site.</p></section>
        <section><h2 className="text-xl font-bold text-[#0d0d0d]">5. Google AdSense e publicidade</h2><p className="mt-2">Este site pode exibir anúncios fornecidos pelo Google AdSense. O Google e seus parceiros podem utilizar cookies e tecnologias semelhantes para personalizar anúncios, medir desempenho e evitar publicidade inválida, conforme suas políticas. Quando aplicável, anúncios personalizados dependem das escolhas de consentimento e das configurações do usuário. Consulte também as políticas do Google sobre publicidade e privacidade.</p></section>
        <section><h2 className="text-xl font-bold text-[#0d0d0d]">6. Segurança e direitos</h2><p className="mt-2">Adotamos medidas razoáveis para proteger as informações. Você pode solicitar confirmação de tratamento, acesso, correção, eliminação ou informações sobre o uso dos seus dados, observadas as hipóteses legais.</p></section>
        <section><h2 className="text-xl font-bold text-[#0d0d0d]">7. Contato</h2><p className="mt-2">Para dúvidas ou solicitações relacionadas à privacidade, utilize a página <a className="font-semibold text-primary underline" href="/institucional/contato">Contato</a>.</p></section>
      </div>
    </article>
  );
}