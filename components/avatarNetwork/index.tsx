'use client'
import { Avatar,AvatarFallback,AvatarImage } from "@/components/ui"

const AvatarNetwork = () => {
    return(
        <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
        </Avatar>

    )
}

export {AvatarNetwork}