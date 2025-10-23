const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const CardSkeleton = () => (
    <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
      <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>
  );

  const ListSkeleton = () => (
    <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
      <div className="flex gap-4">
        <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0"></div>
        <div className="flex-1">
          <div className="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    </div>
  );

  const BlogSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
      <div className="h-56 bg-gray-200"></div>
      <div className="p-6">
        <div className="flex gap-2 mb-4">
          <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
          <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
        </div>
        <div className="h-7 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    </div>
  );

  const VetSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
      <div className="flex flex-col items-center text-center">
        <div className="w-32 h-32 bg-gray-200 rounded-full mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  );

  const skeletonComponents = {
    card: CardSkeleton,
    list: ListSkeleton,
    blog: BlogSkeleton,
    vet: VetSkeleton
  };

  const SkeletonComponent = skeletonComponents[type] || CardSkeleton;

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonComponent key={index} />
      ))}
    </>
  );
};

export default SkeletonLoader;
