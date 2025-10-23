import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';

const ServiceCard = ({ service, index }) => {
  // Subtle gradient colors - more professional
  const gradientColors = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-amber-500',
    'from-indigo-500 to-violet-500',
    'from-rose-500 to-pink-500',
  ];

  const gradient = gradientColors[index % gradientColors.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="group h-full"
    >
      <Link to={`/service/${service.slug}`} className="block h-full">
        <motion.div
          whileHover={{ y: -8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative h-full bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col overflow-hidden"
        >
          {/* Subtle gradient accent on top */}
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

          {/* Icon - Clean and Simple */}
          <div className="mb-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${gradient} shadow-md`}
            >
              <span className="text-5xl filter drop-shadow-sm">{service.icon}</span>
            </motion.div>
          </div>

          {/* Title - Bold and Clear */}
          <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors">
            {service.title}
          </h3>

          {/* Description - Readable */}
          <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
            {service.shortDescription}
          </p>

          {/* CTA - Simple and Effective */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className={`flex items-center gap-2 font-semibold text-sm bg-gradient-to-r ${gradient} bg-clip-text text-transparent group-hover:gap-3 transition-all`}>
              <span>Detaylı Bilgi</span>
              <FaArrowRight className="text-gray-400 group-hover:text-gray-600 transition-colors" size={14} />
            </div>
          </div>

          {/* Subtle corner decoration */}
          <div className={`absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br ${gradient} rounded-full opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500`} />
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default ServiceCard;
