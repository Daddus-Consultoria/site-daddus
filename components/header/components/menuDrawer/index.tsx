import { Drawer, DrawerTrigger, DrawerContent, Input } from "@/components/index";

import { PiMagnifyingGlassThin } from "react-icons/pi";
import { IoIosMenu } from "react-icons/io";
import { AccordionMenuItem } from "@/components/header/components/accordionMenuItem"
import {headerItems} from '@/lib/constants/constants'

const MenuDrawer = () => {
    return (
        <Drawer direction="right" snapPoints={[0.745]}>
            <DrawerTrigger><IoIosMenu size={35}/></DrawerTrigger>
            <DrawerContent className="h-full w-3/4">
                <div className="p-3">
                    <Input
                        iconVariant={"trailingIcon"}
                        type="text"
                        placeholder={"Pesquisar"}
                        trailingIcon={
                        <PiMagnifyingGlassThin size={30} className="fill-primary" />
                        }
                    />
                </div>
                {headerItems.map((item) => {
                    return (
                        <div key={`acorddionitem-${item.title.toLowerCase()}`} className="p-3">
                            <AccordionMenuItem item={item}/>
                        </div>
                    )
                })}
            </DrawerContent>
        </Drawer>
    );
}

export { MenuDrawer };