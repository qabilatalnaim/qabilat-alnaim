import { Link } from 'react-router-dom'

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
)

const ChevronLeftIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m15 18-6-6 6-6"/>
  </svg>
)

export interface BreadcrumbItem {
  label: string
  href?: string
}

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="مسار التنقل" className="mb-8">
      <ol className="flex items-center flex-wrap gap-2 text-sm text-gray-400">
        <li>
          <Link
            to="/"
            className="flex items-center gap-2 hover:text-[#D4AF37] transition-colors"
            aria-label="الصفحة الرئيسية"
          >
            <HomeIcon />
            <span>الرئيسية</span>
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <ChevronLeftIcon className="text-gray-600" />
            {item.href && index < items.length - 1 ? (
              <Link to={item.href} className="hover:text-[#D4AF37] transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-white font-semibold" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
