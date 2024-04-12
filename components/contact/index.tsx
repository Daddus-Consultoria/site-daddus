import { AvatarNetwork } from "../avatarNetwork";
import { Button } from "../ui";

const Contact = () => {
  return (
    <div className="flex flex-col gap-9">
        <div className="flex w-full h-14 flex-row bg-black justify-center items-center ">
            <p className="flex flex-1 text-white justify-center items-center">
                Quer saber mais?
            </p>
            <Button className="flex flex-1 h-[92%] mr-[0.6%] rounded-none">
                Entre em contato
            </Button>
        </div>
        <div className="pl-[2%]">
            <AvatarNetwork/>
        </div>
    </div>
  );
}

export {Contact}