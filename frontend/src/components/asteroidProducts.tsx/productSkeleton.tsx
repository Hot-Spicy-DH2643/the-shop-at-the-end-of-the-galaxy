export default function ProductSkeleton() {
    return (
        <div className="group relative animate-pulse">
      {/* Image placeholder */}
      <div className="rounded flex flex-col items-center overflow-hidden">
        <div className="h-24 w-24 bg-gray-700 rounded-full mb-3" />
      </div>

      {/* Text placeholder */}
      <div className="rounded flex flex-col items-center overflow-hidden">
        <div className="h-4 w-32 bg-gray-600 rounded mb-2" /> {/* Name */}
        <div className="h-3 w-40 bg-gray-600 rounded mb-1" /> {/* Hazardous */}
        <div className="h-3 w-40 bg-gray-600 rounded mb-1" /> {/* Diameter*/}
        <div className="h-3 w-24 bg-gray-600 rounded" /> {/* Price */}
      </div>
    </div>
    )

}