import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRightIcon } from './AppIcons'

const HeritageCard = ({ icon, title, description, link, color }: {
  icon: ReactNode
  title: string
  description: string
  link: string
  color: string
}) => (
  <Link
    to={link}
    className="group relative bg-gradient-to-br from-[#0a1628] to-[#162544] rounded-2xl p-8 border border-white/10 hover:border-[#D4AF37]/50 transition-all duration-500 hover:transform hover:scale-[1.02] hover:shadow-[0_20px_60px_rgba(212,175,55,0.2)] block overflow-hidden"
  >
    {/* Decorative gradient */}
    <div className={`absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-3xl ${color}`}></div>

    {/* Icon */}
    <div className={`w-20 h-20 ${color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
      {icon}
    </div>

    {/* Content */}
    <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
    <p className="text-gray-400 leading-relaxed mb-6">{description}</p>

    {/* Arrow */}
    <div className="flex items-center gap-2 text-[#D4AF37] font-semibold group-hover:gap-4 transition-all">
      <span>اكتشف المزيد</span>
      <ArrowRightIcon />
    </div>
  </Link>
)

export default HeritageCard
