import { AvatarNetwork } from "../avatarNetwork";
import { Button } from "@/components/ui";
import { ButtonContact } from "@/components/index";

const Contact = () => {
  return (
    <div className="flex flex-col gap-9">
        <ButtonContact/>
        <div className="pl-[2%]">
            <AvatarNetwork/>
        </div>
    </div>
  );
}

export {Contact}