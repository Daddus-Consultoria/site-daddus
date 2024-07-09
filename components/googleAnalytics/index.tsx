import Script from "next/script";

const GoogleAnalytics = ({ ga_id }: { ga_id: string | undefined }) => (
  <>
    <Script
      strategy="lazyOnload"
      src={`https://www.googletagmanager.com/gtag/js? 
      id=${ga_id}`}
    ></Script>
    <Script
      strategy="lazyOnload"
      id="google-analytics"
    >
      {`
          window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${ga_id}', {
              page_path: window.location.pathname,
              });
      `}
    </Script>
  </>
)
export { GoogleAnalytics };

// esse é o que tava antes ai eu tentei usar o que ai em cima
{/* <>
    <Script
      async
      src={`https://www.googletagmanager.com/gtag/js? 
      id=${ga_id}`}
    ></Script>
    <Script
      id="google-analytics"
      dangerouslySetInnerHTML={{
        __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${ga_id}');
        `,
      }}
    ></Script>
  </> */}