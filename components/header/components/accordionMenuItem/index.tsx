import { Accordion, AccordionTrigger, AccordionItem, AccordionContent } from "@/components/index";
import { NavigationType } from "@/lib/interfaces/navigation";
import { SubMenuItem } from "../subMenuItem";

interface AccordionMenuItemProps {
    item: NavigationType;
}

const AccordionMenuItem: React.FC<AccordionMenuItemProps> = ({item}) =>{
    return (
        <div>
            <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                    <AccordionTrigger>{item.title}</AccordionTrigger>
                    <AccordionContent>
                        <SubMenuItem items={item.subtypes ?? []}/>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}

export {AccordionMenuItem};