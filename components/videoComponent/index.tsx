const VideoComponent = () => {
    return (
        <div className="relative p-4">
            <iframe 
                    src="https://www.youtube.com/embed/mjPLPpwtOhc?si=ZvRtNhQ8xj3W2aJ5&amp;controls=0"
                    title="YouTube video player"  
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    className="relative z-0 rounded-3xl h-[150px] w-[255px] md:h-[200px] md:w-[355px] lg:h-[315px] lg:w-[560px]">
            </iframe>
            <div className="absolute top-0 left-0 w-[22%] h-[38%] rounded-3xl bg-primary -z-10"></div>
            <div className="absolute bottom-0 right-0  w-[22%] h-[38%] rounded-3xl bg-secondary -z-10"></div>           
        </div>
    )
}

export { VideoComponent }