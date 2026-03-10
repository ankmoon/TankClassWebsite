export default function Loading() {
    return (
        <div className="min-h-screen bg-white">
            <div className="animate-pulse">
                {/* Header Skeleton */}
                <div className="pt-32 pb-24 px-6 lg:px-20 bg-background/30">
                    <div className="max-w-4xl mx-auto space-y-12">
                        <div className="flex gap-4">
                            <div className="h-4 w-20 bg-gray-100 rounded-full"></div>
                            <div className="h-4 w-32 bg-gray-100 rounded-full"></div>
                        </div>
                        <div className="h-16 w-full bg-gray-100 rounded-3xl"></div>
                        <div className="w-full h-[500px] md:h-[650px] bg-gray-100 rounded-[4rem]"></div>
                    </div>
                </div>

                {/* Content Skeleton */}
                <div className="py-24 px-6 lg:px-20 max-w-3xl mx-auto space-y-8">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-4 w-full bg-gray-50 rounded-lg"></div>
                    ))}
                    <div className="h-4 w-3/4 bg-gray-50 rounded-lg"></div>
                    <div className="h-24 w-full bg-gray-50 rounded-3xl mt-12"></div>
                </div>
            </div>
        </div>
    );
}
