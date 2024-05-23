import {constantsContact} from "@/app/informacoes/contato/_constants"
import Image from "next/image";

const ContactPage = () => {
    return(
        <div className="flex flex-1 flex-col">
        <div
          id="top-transport-page"
          className="flex flex-col lg:flex-row w-full h-full py-[2%] px-[9%] mb-[2%] gap-[2%] lg:gap-[10%] "
        >
            <div id="left" className="flex lg:w-1/2 flex-col">
                <div className="flex flex-col mb-[8%] gap-4">
                    <h2 className="font-bold text-[26px] lg:text-[32px] text-[#A90920] mb-[2%] ">
                        {constantsContact.title}
                    </h2>
                    <p className="flex text-justify text-[17px] text-[#696984] leading-loose whitespace-pre-line ">
                        {constantsContact.text}
                    </p>
                    <p className="sm:flex text-[17px] text-secondary font-bold">
                        E-mail: <p className="text-primary font-semibold md:ml-2">{constantsContact.email}</p>
                    </p>
                </div>
                <p className="flex text-justify text-[17px] text-[#696984] leading-loose whitespace-pre-line ">
                    {constantsContact.text2}
                </p>
                <div 
                    id="form-contact"
                >

                </div>
            </div>
            <div className="lg:hidden w-full px-[10px] bg-[#D6D6D6] py-[0.5px]"></div>
            <div
                id="right"
                className="flex lg:w-1/2 flex-col justify-start items-end gap-[7%] "
            >
                <Image
                src={constantsContact.image}
                width={350}
                height={300}
                alt="bus"
                />
            </div>
        </div>
      </div>
    )
}

export default ContactPage;
