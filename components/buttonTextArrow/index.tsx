import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface buttonTextArrowProps extends ButtonProps {
    text: string;
}

const ButtonTextArrow = React.forwardRef<HTMLButtonElement, buttonTextArrowProps>(
    ({ text, className, ...props }, ref) => {
        return (
            <Button
                ref={ref}
                className={`flex items-left justify-between ${className}`}
                {...props}
            >
                <span>{text}</span>
                <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        );
    }
);

ButtonTextArrow.displayName = 'TextWithArrowButton';

export { ButtonTextArrow };