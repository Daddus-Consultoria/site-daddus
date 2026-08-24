/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['res.cloudinary.com'],
        /**
         * Sem isto o otimizador recusa todo SVG com 400 — e boa parte das
         * imagens do site e SVG local: a capa neutra das publicacoes sem capa
         * no CMS, a ilustracao dos indicadores, as marcas dos sistemas. Elas
         * apareciam quebradas, nao ausentes.
         *
         * O "dangerously" e sobre SVG remoto, que pode carregar script ao ser
         * servido da nossa origem. A mitigacao documentada do Next vai junto:
         * o SVG sai como anexo e dentro de um sandbox sem script.
         */
        dangerouslyAllowSVG: true,
        contentDispositionType: 'attachment',
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
    }
};

export default nextConfig;
