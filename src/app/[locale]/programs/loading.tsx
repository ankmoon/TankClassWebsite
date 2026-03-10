export default function Loading() {
    return (
        <div className="min-h-screen bg-white">
            <div className="animate-pulse">
                {/* Header Skeleton */}
                <div className="pt-32 pb-24 px-6 lg:px-20 bg-primary">
                    <div className="max-w-4xl mx-auto text-center space-y-10">
                        <div className="h-4 w-24 bg-white/10 rounded-full mx-auto"></div>
                        <div className="h-20 w-3/4 bg-white/10 rounded-3xl mx-auto"></div>
                        <div className="h-6 w-1/2 bg-white/5 rounded-xl mx-auto"></div>
                    </div>
                </div>

                {/* Grid Skeleton */}
                <div className="py-24 px-6 lg:px-20 max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-10 -mt-24">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-[3rem] p-12 border border-gray-50 space-y-8 h-[500px] flex flex-col">
                            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex-shrink-0"></div>
                            <div className="space-y-4">
                                <div className="h-4 w-24 bg-gray-100 rounded-full"></div>
                                <div className="h-10 w-full bg-gray-100 rounded-2xl"></div>
                                <div className="h-4 w-3/4 bg-gray-50 rounded-lg"></div>
                            </div>
                            <div className="space-y-4 flex-grow">
                                {[1, 2, 3].map(j => (
                                    <div key={j} className="h-3 w-1/2 bg-gray-50 rounded-full"></div>
                                ))}
                            </div>
                            <div className="h-16 w-full bg-gray-100 rounded-2xl"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
