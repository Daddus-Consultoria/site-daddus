interface BadgeBlogProps {
    title: string;
    first: boolean;
}

const BadgeBlog:React.FC<BadgeBlogProps> = ({title, first}) => {
    const textSize = first ? 'text-[15px]' :'text-[13px]';

    return (
        <div className={`flex flex-col justify-center items-center bg-primary py-[1%] px-[3%] rounded-2xl text-sm lg:${textSize}`}>
            {title}
        </div>
    )
}

export { BadgeBlog }