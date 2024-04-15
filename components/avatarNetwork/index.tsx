'use client'
import { Avatar,AvatarFallback,AvatarImage } from "@/components/ui"
import {avatarNetworks} from '@/components/avatarNetwork/_constants'
import { Button } from "@/components/ui";

const AvatarNetwork = () => {
    return(
        <div className='flex flex-row gap-[10px]'>
            {avatarNetworks.map((item, index) => (
                <Avatar key={`avatarNetwork-${index}`} className="flex  hover:shadow-xl transition duration-300 ">
                <AvatarImage src={item.src} />
                <AvatarFallback>{item.fallback}</AvatarFallback>
            </Avatar>
            ))}
        </div>
    )
}

export {AvatarNetwork}