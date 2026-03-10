export default function Loading() {
    return (
        <div className="min-h-screen bg-white">
            <div className="animate-pulse">
                {/* Hero Skeleton */}
                <div className="bg-background pt-32 pb-24 px-6 lg:px-20 text-center">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <div className="h-4 w-24 bg-gray-100 rounded-full mx-auto"></div>
                        <div className="h-16 w-3/4 bg-gray-100 rounded-3xl mx-auto"></div>
                        <div className="h-6 w-1/2 bg-gray-50 rounded-xl mx-auto"></div>
                    </div>
                </div>

                {/* Grid Skeleton */}
                <div className="py-24 px-6 lg:px-20 max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="space-y-6">
                            <div className="h-72 bg-gray-100 rounded-[2.5rem]"></div>
                            <div className="space-y-3">
                                <div className="h-8 w-3/4 bg-gray-100 rounded-xl"></div>
                                <div className="h-4 w-full bg-gray-50 rounded-lg"></div>
                                <div className="h-4 w-2/3 bg-gray-50 rounded-lg"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
