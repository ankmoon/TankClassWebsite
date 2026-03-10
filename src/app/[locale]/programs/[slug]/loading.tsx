export default function Loading() {
    return (
        <div className="min-h-screen bg-white">
            <div className="animate-pulse">
                {/* Header Skeleton */}
                <div className="pt-32 pb-24 px-6 lg:px-20 bg-background/50">
                    <div className="max-w-7xl mx-auto space-y-12">
                        <div className="h-4 w-32 bg-gray-100 rounded-full"></div>
                        <div className="flex flex-col lg:flex-row gap-20">
                            <div className="flex-1 space-y-10">
                                <div className="w-24 h-24 bg-gray-100 rounded-[2.5rem]"></div>
                                <div className="h-4 w-24 bg-gray-100 rounded-full"></div>
                                <div className="h-20 w-3/4 bg-gray-100 rounded-3xl"></div>
                                <div className="h-6 w-1/2 bg-gray-50 rounded-xl"></div>
                            </div>
                            <div className="w-full lg:w-[450px] h-[600px] bg-gray-100 rounded-[4rem]"></div>
                        </div>
                    </div>
                </div>

                {/* Content Skeleton */}
                <div className="py-24 px-6 lg:px-20 max-w-4xl mx-auto space-y-8">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-4 w-full bg-gray-50 rounded-lg"></div>
                    ))}
                    <div className="w-full h-[500px] md:h-[650px] bg-gray-50 rounded-[4rem] my-24"></div>
                    <div className="h-4 w-3/4 bg-gray-50 rounded-lg"></div>
                </div>
            </div>
        </div>
    );
}
