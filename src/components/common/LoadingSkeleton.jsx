import { motion } from 'framer-motion';

// Base Skeleton Component
export const Skeleton = ({ className = '', variant = 'default' }) => {
  const baseClass = 'bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded';
  const variantClasses = {
    default: 'bg-gray-200',
    shimmer: 'bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200',
  };

  return (
    <motion.div
      className={`${baseClass} ${className}`}
      animate={{
        backgroundPosition: ['0% 0%', '100% 0%'],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'linear',
      }}
      style={{
        backgroundSize: '200% 100%',
      }}
    />
  );
};

// Card Skeleton
export const CardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
      <Skeleton className="h-48 w-full rounded-xl" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="flex gap-2 mt-4">
        <Skeleton className="h-10 w-24 rounded-full" />
        <Skeleton className="h-10 w-24 rounded-full" />
      </div>
    </div>
  );
};

// Blog Post Skeleton
export const BlogPostSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <Skeleton className="h-56 w-full" />
      <div className="p-6 space-y-4">
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex items-center gap-4 pt-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Service Card Skeleton
export const ServiceCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
      <div className="flex items-start gap-4">
        <Skeleton className="h-16 w-16 rounded-2xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-10 w-32 rounded-full mt-4" />
    </div>
  );
};

// List Item Skeleton
export const ListItemSkeleton = () => {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-xl">
      <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <Skeleton className="h-8 w-8 rounded-lg" />
    </div>
  );
};

// Stats Skeleton
export const StatsSkeletonGroup = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white rounded-2xl p-6 space-y-3 text-center">
          <Skeleton className="h-12 w-12 rounded-xl mx-auto" />
          <Skeleton className="h-8 w-20 mx-auto" />
          <Skeleton className="h-4 w-24 mx-auto" />
        </div>
      ))}
    </div>
  );
};

// Team Member Skeleton
export const TeamMemberSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <Skeleton className="h-64 w-full" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-6 w-3/4 mx-auto" />
        <Skeleton className="h-4 w-1/2 mx-auto" />
        <div className="flex gap-2 justify-center pt-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  );
};

// Table Row Skeleton
export const TableRowSkeleton = () => {
  return (
    <tr className="border-b border-gray-100">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-5 w-32" />
        </div>
      </td>
      <td className="p-4">
        <Skeleton className="h-5 w-24" />
      </td>
      <td className="p-4">
        <Skeleton className="h-5 w-20" />
      </td>
      <td className="p-4">
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </td>
    </tr>
  );
};

// Hero Section Skeleton
export const HeroSkeleton = () => {
  return (
    <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Skeleton className="h-4 w-32 rounded-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-5/6" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-4/5" />
            <div className="flex gap-4 pt-4">
              <Skeleton className="h-12 w-40 rounded-full" />
              <Skeleton className="h-12 w-40 rounded-full" />
            </div>
          </div>
          <Skeleton className="h-96 w-full rounded-3xl" />
        </div>
      </div>
    </div>
  );
};

// Page Loading Component (Full Page)
export const PageLoader = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
      <div className="text-center space-y-6">
        {/* Animated Paw Print */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="text-8xl"
        >
          🐾
        </motion.div>

        {/* Loading Text */}
        <div className="space-y-3">
          <motion.h2
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-2xl font-bold text-gray-800"
          >
            Yükleniyor...
          </motion.h2>
          <Skeleton className="h-2 w-64 mx-auto rounded-full" />
        </div>
      </div>
    </div>
  );
};

// Compact Loader (For inline use)
export const InlineLoader = ({ text = 'Yükleniyor...' }) => {
  return (
    <div className="flex items-center justify-center gap-3 py-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-6 h-6 border-3 border-purple-200 border-t-purple-600 rounded-full"
      />
      <span className="text-gray-600 font-medium">{text}</span>
    </div>
  );
};

export default {
  Skeleton,
  CardSkeleton,
  BlogPostSkeleton,
  ServiceCardSkeleton,
  ListItemSkeleton,
  StatsSkeletonGroup,
  TeamMemberSkeleton,
  TableRowSkeleton,
  HeroSkeleton,
  PageLoader,
  InlineLoader,
};
