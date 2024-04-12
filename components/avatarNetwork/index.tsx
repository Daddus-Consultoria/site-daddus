'use client'
import { Avatar,AvatarFallback,AvatarImage } from "@/components/ui"
import {avatarNetworks} from '@/components/avatarNetwork/_constants'

const AvatarNetwork = () => {
    return(
        <div className='flex flex-row gap-[10px]'>
            {avatarNetworks.map((item, index) => (
                <Avatar key={`avatarNetwork-${index}`} className="flex felex-1">
                    <AvatarImage src={item.src} />
                    <AvatarFallback>{item.fallback}</AvatarFallback>
                </Avatar>
            ))}
        </div>
    )
}

export {AvatarNetwork}