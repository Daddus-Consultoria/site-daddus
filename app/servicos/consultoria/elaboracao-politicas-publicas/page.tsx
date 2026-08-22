"use client";
import { constantsTransports } from "./_constants";
import Image from "next/image";
import { Contact, RelatedPublications, CardInfo } from "@/components/index";

const PublicPoliciesPage = () => {
  const relatedPublications = [
    {
      title: "Citologia: um estudo demográfico de  duas ou três linhas ",
      link: "#",
    },
    {
      title:
        "Perspectivas de Mercado: Bitcoin e o mercado bovino. Onde vamos parar?",
      link: "#",
    },
  ];

  return (
    <div className="flex flex-1 flex-col">
      <div
        id="top-transport-page"
        className="flex flex-col lg:flex-row w-full h-full py-[4%] px-[9%] mb-[2%] gap-[2%] lg:gap-[5%]"
      >
        {/* Image Above for Small Screens */}
        <div className="lg:hidden mb-[4%]">
          <Image
            src={constantsTransports.image}
            width={450}
            height={300}
            alt="bus"
            className="mx-auto"
          />
        </div>

        {/* Left Column */}
        <div id="left" className="flex lg:w-1/2 flex-col">
          <h1 className="font-bold text-[26px] lg:text-[32px] text-primary mb-[5%]">
            {constantsTransports.title}
          </h1>
          {constantsTransports.content.map((item, index) => (
            <div key={`transport-page-${index}`} className="flex flex-col mb-[8%]">
              <h2 className="font-bold text-[26px] lg:text-[32px] text-primary mb-[2%]">
                {item.title}
              </h2>
              <p className="flex text-justify text-[17px] text-[#696984] leading-loose whitespace-pre-line">
                {item.text}
              </p>
              {/* Insert Ad after the first paragraph */}
              {index === 0 && (
                <div className="lg:hidden flex justify-center items-center bg-[#D9D9D9] my-[4%] h-[200px] w-full">
                  <p className="font-bold text-[26px] lg:text-[32px] text-primary">
                    GOOGLE
                  </p>
                </div>
              )}
              {item.listConsultancy && (
                <div>
                  <ul className="list-disc">
                    {item.listConsultancy.map((listItem, listIndex) => (
                      <li key={`list-consultancy-elaboration-policy-page-${listIndex}`} className="text-[17px] text-[#696984] ml-[5%]">
                        <p className="flex text-justify text-[17px] text-[#696984] leading-loose whitespace-pre-line">
                          {listItem}
                        </p>
                      </li>
                    ))}
                  </ul>
                  <p className="flex text-justify text-[17px] text-[#696984] leading-loose whitespace-pre-line">
                    {item.textList}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Divider for small screens */}
        <div className="lg:hidden w-full px-[10px] bg-[#D6D6D6] py-[0.5px]"></div>

        {/* Right Column */}
        <div id="right" className="flex lg:w-1/2 flex-col justify-start items-end gap-[7%]">
          <div className="hidden lg:block">
            <Image
              src={constantsTransports.image}
              width={450}
              height={300}
              alt="bus"
            />
          </div>
          <div className="hidden lg:flex justify-center items-center bg-[#D9D9D9] h-[400px] w-[300px]">
            <p className="font-bold text-[26px] lg:text-[32px] text-primary mb-[2%]">
              GOOGLE
            </p>
          </div>
          <div className="flex flex-row w-full justify-end">
            <div className="flex lg:w-[72%] flex-col gap-10 mb-[35%] md:mb-[15%]">
              <Contact />
              <RelatedPublications publicationsRelated={relatedPublications} />
            </div>
          </div>
        </div>
      </div>

      <div id="bottom-transport-page" className="px-[7%]">
        <h2 className="px-[2%] font-bold text-[26px] lg:text-[32px] text-primary mb-[2%] ">
          {constantsTransports.footer.title}
        </h2>
        <div className="w-full bg-[#999999] h-[1.5px]"></div>
        <div className="flex flex-col lg:flex-row gap-10 lg:h-[500px] 2xl:h-[500px] pb-20 md:justify-center md:items-center lg:justify-start lg:items-start">
          {constantsTransports.footer.cards.map((item, index) => (
            <div key={`card-transport-page-${index}`} className="flex flex-col lg:flex-row gap-10 h-full md:max-w-[70%] lg:max-w-[33%] mb-4 lg:mb-14 mt-[3%] rounded-3xl shadow-xl">
              <CardInfo
                title={item.title}
                description={item.description}
                image={item.image}
                path={item.path}
                copyLink={item.copyLink}
                titleAlign={item.titleAlign}
                        ctaLabel={item.ctaLabel}
              />
            </div>
          ))}
        </div>
      </div>
    </div>

  );
};

export default PublicPoliciesPage;
