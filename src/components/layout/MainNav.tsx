import { Link } from 'react-router-dom'
import OptimizedImage from '../OptimizedImage'
import { MenuIcon, CloseIcon, YoutubeIcon } from '../app/AppIcons'

type NavItem = {
  id: string
  label: string
}

type MainNavProps = {
  scrolled: boolean
  isMenuOpen: boolean
  setIsMenuOpen: (open: boolean) => void
  navItems: NavItem[]
  scrollToSection: (id: string) => void
  youtubeUrl: string
}

export default function MainNav({
  scrolled,
  isMenuOpen,
  setIsMenuOpen,
  navItems,
  scrollToSection,
  youtubeUrl,
}: MainNavProps) {
  return (
    <nav
      role="navigation"
      aria-label="التنقل الرئيسي"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 safe-top ${
        scrolled
          ? 'bg-[#0a1628]/95 backdrop-blur-lg shadow-xl py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <OptimizedImage
              src="/images/logo.png"
              alt="شعار قبيلة النعيم"
              className="w-12 h-12 rounded-full object-cover border-2 border-[#D4AF37]"
            />
            <div className="hidden sm:block">
              <div className="font-bold text-lg text-white">
                النعيم <span className="text-[#D4AF37]">٥١٥</span>
              </div>
              <p className="text-xs text-gray-400">أهل الصفرا</p>
            </div>
          </Link>

          <div
            className="hidden lg:flex items-center gap-8"
            role="navigation"
            aria-label="القائمة الرئيسية"
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-white hover:text-[#D4AF37] transition-colors font-medium"
                aria-label={`انتقل إلى ${item.label}`}
              >
                {item.label}
              </button>
            ))}

            <Link
              to="/search"
              className="text-white hover:text-[#D4AF37] transition-colors font-medium flex items-center gap-2"
              aria-label="بحث"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <span>بحث</span>
            </Link>

            <Link
              to="/blog"
              className="text-white hover:text-[#D4AF37] transition-colors font-medium"
            >
              المدونة
            </Link>
          </div>

          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] text-[#0a1628] font-bold rounded-full hover:shadow-[0_0_20px_rgba(212,175,55,0.5)] transition-all"
          >
            <YoutubeIcon />
            <span>اشترك الآن</span>
          </a>

          <button
            type="button"
            className="lg:hidden p-2 text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {isMenuOpen && (
          <div
            id="mobile-menu"
            role="menu"
            aria-label="القائمة الجانبية"
            className="lg:hidden mt-4 pb-4 bg-[#0a1628]/95 backdrop-blur-lg rounded-xl p-4 border border-white/10"
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  scrollToSection(item.id)
                  setIsMenuOpen(false)
                }}
                className="block w-full text-right py-3 text-white hover:text-[#D4AF37] border-b border-white/10"
              >
                {item.label}
              </button>
            ))}

            <Link
              to="/search"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-end gap-2 w-full text-right py-3 text-white hover:text-[#D4AF37] border-b border-white/10"
            >
              <span>بحث</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </Link>

            <Link
              to="/blog"
              onClick={() => setIsMenuOpen(false)}
              className="block w-full text-right py-3 text-white hover:text-[#D4AF37]"
            >
              المدونة
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}



