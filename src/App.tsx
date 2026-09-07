import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import SEO from './components/SEO'
import { seoConfig } from './lib/seo-config'
import OptimizedImage from './components/OptimizedImage'
import PWAInstallPrompt from './components/PWAInstallPrompt'
import ThemeToggle from './components/ThemeToggle'
import Footer from './components/Footer'
import Newsletter from './components/Newsletter'
import FAQSchema, { FAQItem } from './components/FAQSchema'
import { useSocialStats, useLatestVideos, formatCompactNumber, formatLocalizedNumber } from './lib/useSocialStats'
import { useWebVitals } from './lib/useWebVitals'

// Lazy load all heritage pages (code splitting)
const HistoryPage = lazy(() => import('./pages/HistoryPage'))
const CamelsPage = lazy(() => import('./pages/CamelsPage'))
const HorsesPage = lazy(() => import('./pages/HorsesPage'))
const SheepPage = lazy(() => import('./pages/SheepPage'))
const WasmPage = lazy(() => import('./pages/WasmPage'))
const PoetryPage = lazy(() => import('./pages/PoetryPage'))
const CoffeePage = lazy(() => import('./pages/CoffeePage'))
const TraditionsPage = lazy(() => import('./pages/TraditionsPage'))
const TentPage = lazy(() => import('./pages/TentPage'))
const TownPage = lazy(() => import('./pages/TownPage'))
const BadiaPage = lazy(() => import('./pages/BadiaPage'))
const SearchPage = lazy(() => import('./pages/SearchPage'))
const BlogPage = lazy(() => import('./pages/BlogPage'))
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

// Loading fallback
const PageLoader = () => (
  <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-[#D4AF37] font-bold">جاري التحميل...</p>
    </div>
  </div>
)

// Icons
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>
  </svg>
)

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
  </svg>
)

const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
)

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 19-7-7 7-7"/><path d="M19 12"/>
  </svg>
)

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
)

const YoutubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
)

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
)

const TiktokIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
)

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2000, suffix = '', compact = false, localized = false }: { end: number; duration?: number; suffix?: string; compact?: boolean; localized?: boolean }) => {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }, [isVisible, end, duration])

  const display = compact
    ? formatCompactNumber(count)
    : localized
    ? formatLocalizedNumber(count)
    : count.toString()
  return <div ref={ref}>{display}{suffix}</div>
}

// Heritage Card Component
const HeritageCard = ({ icon, title, description, link, color }: {
  icon: React.ReactNode
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

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    setIsMenuOpen(false)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const navItems = [
    { id: 'about', label: 'نبذة عنا' },
    { id: 'heritage', label: 'التراث' },
    { id: 'videos', label: 'الفيديوهات' },
    { id: 'contact', label: 'تواصل معنا' },
  ]

  const socialLinks = {
    youtube: 'https://www.youtube.com/@qabilatalnaim',
    facebook: 'https://www.facebook.com/share/19n8j2XqBu/',
    instagram: 'https://www.instagram.com/qabilatalnaim',
    tiktok: 'https://www.tiktok.com/@qabilaalnaim',
    email: 'qabilaaalnaim@gmail.com',
  }

  // FAQ data — for rich snippets in Google search
  const homeFAQs: FAQItem[] = [
    {
      question: 'من هم قبيلة النعيم أهل الصفرا ٥١٥؟',
      answer: 'قبيلة النعيم أهل الصفرا ٥١٥ من القبائل العربية العريقة في بلاد الشام، تنحدر من السادة الرفاعية الموسوية الحسينية، ونسبها هاشمي متصل بالإمام الحسين رضي الله عنه. تتخذ من بلدة عزّ الدين أبو حمرة في ريف حمص موطنًا تاريخيًا لها.'
    },
    {
      question: 'ما معنى الوسم ٥١٥؟',
      answer: 'الوسم ٥١٥ هو العلامة المميزة لقبيلة النعيم أهل الصفرا، يوسم به إبل القبيلة وأغنامها للتعريف بها، ويحمل دلالات الانتماء والأصالة والعراقة المتوارثة عبر الأجيال.'
    },
    {
      question: 'أين تقع بلدة عزّ الدين أبو حمرة؟',
      answer: 'بلدة عزّ الدين أبو حمرة تقع في ريف حمص في سوريا، وتُعدّ الموطن التاريخي لقبيلة النعيم أهل الصفرا ٥١٥، نُسبت إلى الجدّ الجامع للقبيلة الشيخ عزّ الدين أبو حمرة (أحمد بن نعيم).'
    },
    {
      question: 'ما هو محتوى قناة قبيلة النعيم على يوتيوب؟',
      answer: 'تحتوي القناة على فيديوهات توثيقية عن تراث قبيلة النعيم وتاريخها، حياة البدو ومراعي البادية، تربية الإبل والغنم والخيل، الشعر النبطي، كشتات القبيلة، وقصص القبائل العربية الأصيلة من قلب الحماد السوري.'
    },
    {
      question: 'كيف أتابع آخر أخبار قبيلة النعيم؟',
      answer: 'يمكنك متابعة قبيلة النعيم أهل الصفرا ٥١٥ عبر قناتها على يوتيوب وصفحاتها على فيسبوك وإنستغرام وتيك توك، والاشتراك في النشرة البريدية الشهرية للحصول على آخر الفيديوهات والمقالات التراثية مباشرة في بريدك.'
    },
  ]

  // Live social media stats (auto-refreshed every 6 hours)
  const { stats: liveStats } = useSocialStats()
  // Latest YouTube videos (auto-refreshed every 3 hours)
  const { videos: latestVideos } = useLatestVideos(4)
  // Web Vitals monitoring (LCP, FCP, CLS, TTFB)
  useWebVitals()

  // Derived values for the Hero stats cards
  // YouTube Live (2026-08-27): 668 subs | 220 videos | 236,429 views
  // Facebook: 103K+ followers
  // Country: 🇸🇦 Saudi Arabia | Joined: 2025-10-11
  // Last updated: 27 أغسطس 2026
  const youtubeSubs = 668
  const youtubeViews = 236429
  const youtubeVideos = 220
  const facebookFollowers = 103000
  const statsUpdatedAt = '27 أغسطس 2026'

  // Display: compact numbers (211K+ views, 103K facebook followers)
  const stats = [
    {
      number: youtubeSubs,
      label: 'مشترك على يوتيوب',
      suffix: '',
      icon: '📺',
      accent: 'red',
    },
    {
      number: facebookFollowers,
      label: 'متابع على فيسبوك',
      suffix: '+',
      icon: '👥',
      accent: 'blue',
    },
    {
      number: youtubeViews,
      label: 'ألف مشاهدة',
      suffix: '+',
      icon: '👁️',
      accent: 'amber',
    },
    {
      number: youtubeVideos,
      label: 'فيديو توثيقي',
      suffix: '',
      icon: '🎬',
      accent: 'gold',
    },
  ]

  const featuredVideo = {
    id: 'KiIEUqNFh4w',
    title: 'من عاصمة قبيلة النعيم أهل الصفرا ٥١٥ إلى مدينة حمص عاصمة الثورة',
    description: 'رحلة توثيقية من عاصمة قبيلة النعيم أهل الصفرا ٥١٥ في الصفرا إلى مدينة حمص',
  }

  const heritageTopics = [
    {
      icon: <span className="text-4xl">📖</span>,
      title: 'النسب والتاريخ',
      description: 'سلسلة النسب الهاشمي، تاريخ قبيلة النعيم، البطون والأفخاذ',
      link: '/history',
      color: 'bg-[#D4AF37]/20 text-[#D4AF37]'
    },
    {
      icon: <span className="text-4xl">🐪</span>,
      title: 'الإبل',
      description: 'تربية الإبل، سلالات النعيم، فن الرعي في البادية',
      link: '/camels',
      color: 'bg-amber-600/20 text-amber-400'
    },
    {
      icon: <span className="text-4xl">🐎</span>,
      title: 'الخيل',
      description: 'الفروسية العربية، سلالات الخيل، فنون الرماية',
      link: '/horses',
      color: 'bg-emerald-600/20 text-emerald-400'
    },
    {
      icon: <span className="text-4xl">🐑</span>,
      title: 'الغنم',
      description: 'سلالة الغنم، العناية والرعي، أصالة السلالة',
      link: '/sheep',
      color: 'bg-blue-600/20 text-blue-400'
    },
    {
      icon: <span className="text-4xl">✒️</span>,
      title: 'الوسم',
      description: 'رمز ٥١٥، تاريخ الوسم، دلالة الانتماء',
      link: '/wasm',
      color: 'bg-purple-600/20 text-purple-400'
    },
    {
      icon: <span className="text-4xl">📜</span>,
      title: 'الشعر النبطي',
      description: 'قصائد الفخر، أهل الصفرا، المدائح والأرجاز',
      link: '/poetry',
      color: 'bg-rose-600/20 text-rose-400'
    },
    {
      icon: <span className="text-4xl">☕</span>,
      title: 'القهوة العربية',
      description: 'الدلة وطقوسها، فناجين الضيافة، كرم العرب',
      link: '/coffee',
      color: 'bg-orange-600/20 text-orange-400'
    },
    {
      icon: <span className="text-4xl">🏕️</span>,
      title: 'العادات والتقاليد',
      description: 'الكرم والضيافة، بيت الشعر، المجالس والأمجاد',
      link: '/traditions',
      color: 'bg-cyan-600/20 text-cyan-400'
    },
    {
      icon: <span className="text-4xl">⛺</span>,
      title: 'بيت الشعر',
      description: 'الخيمة العربية، دخلة البادية، كرم الضيافة',
      link: '/tent',
      color: 'bg-yellow-600/20 text-yellow-400'
    },
    {
      icon: <span className="text-4xl">🏘️</span>,
      title: 'بلدة عز الدين',
      description: 'موطن القبيلة النعيم التاريخي، معالم البلدة، قصة التسمية',
      link: '/town',
      color: 'bg-teal-600/20 text-teal-400'
    },
  ]

  return (
    <>
    <main id="main-content" tabIndex={-1}>
    <Routes>
      <Route path="/" element={
        <>
          <FAQSchema faqs={homeFAQs} pageUrl="https://qabilat-al-naim.vercel.app/" />
          <SEO {...seoConfig.home} />
          <div className="min-h-screen bg-[#0a1628]">
          {/* Navigation */}
          <nav
            role="navigation"
            aria-label="التنقل الرئيسي"
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 safe-top ${scrolled ? 'bg-[#0a1628]/95 backdrop-blur-lg shadow-xl py-2' : 'bg-transparent py-4'}`}
          >
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3">
                  <OptimizedImage src="/images/logo.png" alt="شعار قبيلة النعيم" className="w-12 h-12 rounded-full object-cover border-2 border-[#D4AF37]" />
                  <div className="hidden sm:block">
                    <div className="font-bold text-lg text-white">النعيم <span className="text-[#D4AF37]">٥١٥</span></div>
                    <p className="text-xs text-gray-400">أهل الصفرا</p>
                  </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-8" role="navigation" aria-label="القائمة الرئيسية">
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
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

                {/* CTA Button */}
                <a
                  href={socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] text-[#0a1628] font-bold rounded-full hover:shadow-[0_0_20px_rgba(212,175,55,0.5)] transition-all"
                >
                  <YoutubeIcon />
                  <span>اشترك الآن</span>
                </a>

                {/* Mobile Menu Button */}
                <button
                  className="lg:hidden p-2 text-white"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-label={isMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
                  aria-expanded={isMenuOpen}
                  aria-controls="mobile-menu"
                >
                  {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
                </button>
              </div>

              {/* Mobile Menu */}
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
                      onClick={() => scrollToSection(item.id)}
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
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

          {/* Hero Section — الصورة أولاً ثم كل المحتوى تحتها */}
          <section className="relative overflow-hidden pt-20 pb-10">
            {/* Background gradient only (no overlay on image) */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] via-[#162544] to-[#0a1628] -z-10"></div>
            <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-[#D4AF37] rounded-full opacity-10 blur-[150px] -z-10"></div>
            <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-[#D4AF37] rounded-full opacity-10 blur-[150px] -z-10"></div>

            <div className="container mx-auto px-4">
              {/* Image on top, contained and well-sized */}
              <div className="max-w-6xl mx-auto mb-8">
                <picture>
                  <source media="(max-width: 768px)" srcSet="/images/hero-banner-2026-mobile.webp" />
                  <source srcSet="/images/hero-banner-2026.webp" type="image/webp" />
                  <img
                    src="/images/hero-banner-2026.webp"
                    alt="بانوراما قبيلة النعيم أهل الصفرا ٥١٥ - مسجد ومئذنة وفارس ولواء القبيلة"
                    className="w-full h-auto max-h-[50vh] md:max-h-[60vh] object-contain mx-auto drop-shadow-[0_0_40px_rgba(212,175,55,0.3)] rounded-2xl"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                  />
                </picture>
              </div>

              {/* All content below the image (text, buttons, stats) */}
              <div className="text-center max-w-5xl mx-auto">
                {/* Badge 515 */}
                <div className="mb-5 inline-flex items-center gap-3 bg-gradient-to-r from-[#D4AF37]/20 to-[#F5D76E]/20 px-6 py-2.5 rounded-full border border-[#D4AF37]/40 shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                  <span className="text-[#D4AF37] font-black text-2xl tracking-wider">٥١٥</span>
                  <span className="w-px h-5 bg-[#D4AF37]/40"></span>
                  <span className="text-[#D4AF37] font-bold text-sm">حيث الجذور تلتقي بالمجد</span>
                </div>

                <h1 className="text-4xl md:text-6xl font-black text-white mb-3">
                  قبيلة النعيم <span className="text-[#D4AF37]">أهل الصفرا</span>
                </h1>
                <p className="text-xl md:text-2xl text-[#D4AF37] font-bold mb-4">تراث عربي أصيل من الصفرا - حمص</p>
                <p className="text-base md:text-lg text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                  منصّة توثّق تاريخ قبيلة النعيم أهل الصفرا ٥١٥ العريقة - السادة الرفاعية الموسوية الحسينية - نسب هاشمي متصل بالإمام الحسين رضي الله عنه
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                  <button
                    onClick={() => scrollToSection('about')}
                    className="px-10 py-4 bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] text-[#0a1628] font-bold text-lg rounded-full hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all"
                  >
                    اكتشف تاريخنا
                  </button>
                  <a
                    href={socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-10 py-4 bg-red-600 text-white font-bold text-lg rounded-full hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all flex items-center justify-center gap-2"
                  >
                    <YoutubeIcon />
                    شاهد الفيديوهات
                  </a>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="group bg-white/5 rounded-2xl p-5 border border-white/10 hover:border-[#D4AF37]/60 hover:bg-white/10 transition-all">
                      <div className="text-2xl mb-1">{stat.icon}</div>
                      <div className="text-3xl md:text-4xl font-black text-[#D4AF37] mb-1">
                        <AnimatedCounter
                          end={stat.number}
                          suffix={stat.suffix}
                          compact={stat.number >= 100000}
                          localized={stat.number >= 1000 && stat.number < 100000}
                        />
                      </div>
                      <div className="text-gray-400 text-xs md:text-sm font-medium">{stat.label}</div>
                    </div>
                  ))}
                </div>
                {(() => {
                  const updatedDate = new Date(liveStats.updatedAt)
                  const now = new Date()
                  const diffDays = Math.floor((now.getTime() - updatedDate.getTime()) / (1000 * 60 * 60 * 24))
                  const dateLabel = updatedDate.toLocaleDateString('ar-EG-u-nu-latn', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                  const isLive = liveStats.source === 'live'
                  const freshnessLabel = isLive
                    ? diffDays === 0
                      ? 'محدّث اليوم'
                      : diffDays === 1
                      ? 'محدّث أمس'
                      : diffDays < 7
                      ? `محدّث قبل ${diffDays} أيام`
                      : diffDays < 30
                      ? `محدّث قبل ${Math.floor(diffDays / 7)} أسابيع`
                      : `محدّث قبل ${Math.floor(diffDays / 30)} شهر`
                    : 'تحديث شهري'
                  const freshnessColor = diffDays <= 7
                    ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/5'
                    : diffDays <= 30
                    ? 'text-amber-400 border-amber-400/30 bg-amber-400/5'
                    : 'text-gray-400 border-white/10 bg-white/5'
                  return (
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${freshnessColor}`}>
                        <span className="relative flex h-2 w-2">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${diffDays <= 7 ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                          <span className={`relative inline-flex rounded-full h-2 w-2 ${diffDays <= 7 ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                        </span>
                        <span className="text-xs font-medium">{freshnessLabel}</span>
                        <span className="text-xs opacity-60" dir="ltr">·</span>
                        <span className="text-xs opacity-80" dir="ltr">{dateLabel}</span>
                        {!isLive && (
                          <span className="text-xs opacity-60">· يدوي</span>
                        )}
                      </div>
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37]">
                        <span className="text-sm">📅</span>
                        <span className="text-xs font-bold">تاريخ التعديل: {statsUpdatedAt}</span>
                      </div>
                    </div>
                  )
                })()}
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="mt-10 flex justify-center animate-bounce">
              <div className="w-8 h-12 border-2 border-[#D4AF37] rounded-full flex justify-center pt-2">
                <div className="w-1 h-3 bg-[#D4AF37] rounded-full"></div>
              </div>
            </div>
          </section>

          {/* نبذة عن القبيلة Section */}
          <section className="py-24 bg-gradient-to-b from-[#162544] to-[#0a1628]">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-3 bg-[#D4AF37]/10 px-6 py-2 rounded-full mb-6">
                    <span className="text-3xl">📜</span>
                    <span className="text-[#D4AF37] font-bold">نبذة تاريخية</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-white mb-4">قبيلة النعيم أهل الصفرا <span className="text-[#D4AF37]">٥١٥</span></h2>
                  <p className="text-gray-400 text-lg">قبيلة عريقة من قبائل الشام العربية الأصيلة - تراث وتاريخ</p>
                </div>

                <div className="bg-gradient-to-br from-[#0a1628] to-[#162544] rounded-3xl p-10 md:p-14 border border-[#D4AF37]/30">
                  <div className="text-gray-200 text-lg leading-loose space-y-8">

                    {/* النص الرئيسي للنبذة */}
                    <div className="bg-gradient-to-l from-[#D4AF37]/10 to-transparent p-6 rounded-r-2xl border-r-4 border-[#D4AF37]">
                      <p className="text-gray-200 leading-relaxed">
                        تُعدّ قبيلة السادة النعيم من القبائل العربية العريقة التي رسخت حضورها في بلاد الشام عبر أجيال متعاقبة، وحافظت على مكانتها المرموقة بين القبائل العربية بما تمتلكه من إرثٍ اجتماعي وتاريخي أصيل. وقد عُرف أبناء القبيلة بالسيادة والوجاهة والتمسك بالقيم العربية النبيلة، فكان لهم دورٌ بارز في تعزيز أواصر التآلف والتكافل الاجتماعي، والإسهام في مساعي الصلح والإصلاح، والمحافظة على الأعراف العربية الأصيلة التي شكّلت جزءًا من هويتهم المتوارثة.
                      </p>
                      <p className="text-gray-200 leading-relaxed mt-4">
                        كما مثّلت القبيلة عبر تاريخها نموذجًا للتلاحم الاجتماعي ووحدة الانتماء، وظلت روابط القربى والتعاون بين أبنائها من أبرز السمات التي حافظت على تماسكها واستمرار حضورها بين القبائل العربية.
                      </p>
                    </div>

                    {/* أبيات الشعر */}
                    <div className="bg-[#D4AF37]/5 rounded-2xl p-6 border border-[#D4AF37]/20 text-center">
                      <div className="text-[#D4AF37] font-bold text-xl mb-4">✦ ✦ ✦</div>
                      <p className="text-white text-xl leading-relaxed">يا دار النعيم يا عزّ العرب والسيوف الصقيله</p>
                      <p className="text-white text-xl leading-relaxed">دارٍ للهواشم نسبها من جذورٍ راسخةٍ قويه</p>
                      <p className="text-white text-xl leading-relaxed">قبيلةٍ لها من صميم العرب عزٍّ وطيبه</p>
                      <p className="text-white text-xl leading-relaxed">شامخه مثل الجبال الراسيات الرصينه</p>
                      <div className="text-[#D4AF37] font-bold text-xl mt-4">✦ ✦ ✦</div>
                    </div>

                    {/* المكانة والقيادة */}
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-2xl">👑</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-xl mb-2">المكانة والقيادة</h3>
                        <p className="text-gray-300 leading-relaxed">
                          احتلت قبيلة النعيم مكانة رفيعة بين القبائل العربية، مستندةً إلى ما عُرف عن شيوخها ووجهائها من حكمةٍ وسداد رأي وحسن تدبير. وقد كانت مجالسهم عبر السنين محافل للمشورة وملتقى لأهل الرأي، يسعون من خلالها إلى إصلاح ذات البين وترسيخ قيم العدل والتسامح والتوافق الاجتماعي.
                        </p>
                        <p className="text-gray-300 leading-relaxed mt-3">
                          ولم تقتصر مكانة القيادة على الوجاهة الاجتماعية فحسب، بل ارتبطت بمسؤولية الحفاظ على وحدة الصف وخدمة أبناء القبيلة والوقوف إلى جانب المحتاج والمظلوم، وهي قيم ظلت حاضرة في الذاكرة الجمعية للقبيلة جيلاً بعد جيل.
                        </p>
                      </div>
                    </div>

                    {/* أبيات المكانة */}
                    <div className="bg-[#D4AF37]/5 rounded-2xl p-6 border border-[#D4AF37]/20 text-center">
                      <div className="text-[#D4AF37] font-bold text-xl mb-4">✦ ✦ ✦</div>
                      <p className="text-white text-xl leading-relaxed">شيخٍ تشهد له سود الليالي العصيبه</p>
                      <p className="text-white text-xl leading-relaxed">لا نطق بالحقّ ردّ الشكوك المريبه</p>
                      <p className="text-white text-xl leading-relaxed">حسـامٍ ليا شبّت النار اللهيبـه</p>
                      <p className="text-white text-xl leading-relaxed">يشهد له التاريخ بفعولٍ ثقيله</p>
                      <div className="text-[#D4AF37] font-bold text-xl mt-4">✦ ✦ ✦</div>
                    </div>

                    {/* القيم العربية */}
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-2xl">⚔️</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-xl mb-2">القيم العربية الأصيلة</h3>
                        <p className="text-gray-300 leading-relaxed">
                          حافظ أبناء النعيم على منظومةٍ راسخة من القيم العربية الأصيلة التي توارثوها عبر الأجيال، فجعلوا الكرم عنوانًا لمجالسهم، والشهامة خُلُقًا لمواقفهم، والنخوة منهجًا يسيرون عليه في مختلف الظروف. كما ظل الوفاء بالعهود وإكرام الضيف وإغاثة الملهوف واحترام الجار من الصفات التي شكّلت جزءًا من الموروث الاجتماعي للقبيلة.
                        </p>
                        <p className="text-gray-300 leading-relaxed mt-3">
                          وقد أسهم هذا الإرث الأخلاقي في ترسيخ مكانة القبيلة وتعزيز روابطها الاجتماعية، لتبقى هذه القيم حاضرة في سلوك أبنائها ومواقفهم وموروثهم الثقافي.
                        </p>
                      </div>
                    </div>

                    {/* أبيات القيم */}
                    <div className="bg-[#D4AF37]/5 rounded-2xl p-6 border border-[#D4AF37]/20 text-center">
                      <div className="text-[#D4AF37] font-bold text-xl mb-4">✦ ✦ ✦</div>
                      <p className="text-white text-xl leading-relaxed">لنا مع الطيب والمراجل سلايل</p>
                      <p className="text-white text-xl leading-relaxed">للضيف نقدّم واجب الطيب كلّه</p>
                      <p className="text-white text-xl leading-relaxed">وقت الشدايد لا ذكرنا المنيّه</p>
                      <p className="text-white text-xl leading-relaxed">نحمي حمى روس الطنايا العليّه</p>
                      <div className="text-[#D4AF37] font-bold text-xl mt-4">✦ ✦ ✦</div>
                    </div>

                    {/* الجد الجامع */}
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-2xl">🏠</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-xl mb-2">الجدّ الجامع</h3>
                        <p className="text-gray-300 leading-relaxed">
                          يُعدّ الشيخ عزّ الدين أبو حمرة (أحمد بن نعيم) الجدّ الجامع لقبيلة النعيم، وأحد أبرز الشخصيات التاريخية المرتبطة بمسيرتها وامتدادها. وقد ارتبط اسمه بمرحلة مهمة من تاريخ القبيلة، وظل حاضرًا في الذاكرة المتوارثة بوصفه رمزًا لوحدة النسب وعمق الجذور والأصالة الممتدة عبر الأجيال.
                        </p>
                        <p className="text-gray-300 leading-relaxed mt-3">
                          كما حملت بلدة عزّ الدين اسمه تخليدًا لذكراه وتقديرًا لمكانته، لتبقى شاهدًا على حضور اسمه في الوجدان الاجتماعي لأبناء القبيلة، وعلى ما يمثله من معاني الانتماء والترابط والاعتزاز بالموروث التاريخي.
                        </p>
                      </div>
                    </div>

                    {/* أبيات الجد */}
                    <div className="bg-[#D4AF37]/5 rounded-2xl p-6 border border-[#D4AF37]/20 text-center">
                      <div className="text-[#D4AF37] font-bold text-xl mb-4">✦ ✦ ✦</div>
                      <p className="text-white text-xl leading-relaxed">عزّ الدين شيخٍ له من المجد هيبه</p>
                      <p className="text-white text-xl leading-relaxed">بنى صروح العزّ والمجد بيده</p>
                      <p className="text-white text-xl leading-relaxed">أبو حمرة اللي خلّد الطيب ذكره</p>
                      <p className="text-white text-xl leading-relaxed">تشهد له الدنيا بفعايل حميده</p>
                      <div className="text-[#D4AF37] font-bold text-xl mt-4">✦ ✦ ✦</div>
                    </div>

                    {/* النسب والانتماء */}
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-2xl">📜</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-xl mb-2">النسب والانتماء</h3>
                        <p className="text-gray-300 leading-relaxed">
                          تعتز قبيلة النعيم بأصولها العربية العريقة وبما تحمله من موروثٍ قبلي متجذر، وقد حافظ أبناء القبيلة على روابطهم الأسرية والاجتماعية ووحدة انتمائهم عبر الأجيال، مما أسهم في استمرار تماسك البنية القبلية وتعزيز روح التضامن والتكافل بين أفرادها.
                        </p>
                        <p className="text-gray-300 leading-relaxed mt-3">
                          ويشكّل الاعتزاز بالانتماء والوفاء للموروث أحد الركائز الأساسية التي حافظت على حضور القبيلة ومكانتها في محيطها الاجتماعي عبر مختلف المراحل التاريخية.
                        </p>
                      </div>
                    </div>

                    {/* أبيات النسب */}
                    <div className="bg-[#D4AF37]/5 rounded-2xl p-6 border border-[#D4AF37]/20 text-center">
                      <div className="text-[#D4AF37] font-bold text-xl mb-4">✦ ✦ ✦</div>
                      <p className="text-white text-xl leading-relaxed">حَنّا بني هاشم على الدين والطيبـه</p>
                      <p className="text-white text-xl leading-relaxed">أهل الوفا والمجد والسيرة النبيله</p>
                      <p className="text-white text-xl leading-relaxed">لنا من صميم العرب ساسٍ وقبيله</p>
                      <p className="text-white text-xl leading-relaxed">ونصون عهد الجدود وعاداتٍ أصيله</p>
                      <div className="text-[#D4AF37] font-bold text-xl mt-4">✦ ✦ ✦</div>
                    </div>

                    {/* الفاصل */}
                    <div className="text-[#D4AF37] font-bold text-xl text-center">✦ ✦ ✦</div>

                    {/* الانتشار الجغرافي */}
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-2xl">🌍</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-xl mb-2">الانتشار الجغرافي</h3>
                        <p className="text-gray-300 leading-relaxed">
                          تنتشر عشائر وأفخاذ قبيلة النعيم في عددٍ من مناطق بلاد الشام، حيث أسهم هذا الانتشار في تعزيز حضور القبيلة الاجتماعي وترسيخ روابطها الممتدة بين أبنائها. وعلى الرغم من تباعد أماكن الإقامة وتنوع البيئات، فقد حافظ أبناء القبيلة على وحدة الانتماء والتواصل المستمر، وظلت الروابط الاجتماعية والعائلية عاملًا أساسيًا في توثيق الصلات بينهم.
                        </p>
                      </div>
                    </div>

                    {/* الفاصل */}
                    <div className="text-[#D4AF37] font-bold text-xl text-center">✦ ✦ ✦</div>

                    {/* البطون الكبرى */}
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-2xl">🛡️</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-xl mb-3">البطون الكبرى لقبيلة النعيم</h3>
                        <p className="text-gray-300 leading-relaxed mb-4">
                          تتألف قبيلة النعيم من أربعة بطون رئيسية شكّلت الأساس التاريخي لتركيبتها القبلية، وتفرعت عنها عشائر وأفخاذ عديدة حافظت على وحدة الانتماء والروابط الاجتماعية المتينة عبر الأجيال، وهي:
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                            <span className="text-[#D4AF37] font-bold">١-</span>
                            <span className="text-white font-semibold mr-2">الفخر</span>
                          </div>
                          <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                            <span className="text-[#D4AF37] font-bold">٢-</span>
                            <span className="text-white font-semibold mr-2">المحمدية (المحاميد)</span>
                          </div>
                          <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                            <span className="text-[#D4AF37] font-bold">٣-</span>
                            <span className="text-white font-semibold mr-2">الحزومين</span>
                          </div>
                          <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                            <span className="text-[#D4AF37] font-bold">٤-</span>
                            <span className="text-white font-semibold mr-2">البو طارق</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* الفاصل */}
                    <div className="text-[#D4AF37] font-bold text-xl text-center">✦ ✦ ✦</div>

                    {/* الكلمة الختامية */}
                    <div className="bg-gradient-to-l from-[#D4AF37]/20 to-transparent p-6 rounded-r-2xl border-r-4 border-[#D4AF37]">
                      <h3 className="font-bold text-[#D4AF37] text-xl mb-3 text-center">✦ كلمة ختامية ✦</h3>
                      <p className="text-gray-200 leading-relaxed">
                        وتبقى قبيلة النعيم أهل الصفرا ٥١٥ صفحةً مشرقة في سجل القبائل العربية الأصيلة، بما تحمله من إرثٍ تاريخي واجتماعي وثقافي عريق. وقد حافظ أبناؤها على قيم الكرم والشهامة والوفاء والتكاتف، وظلت هذه القيم ركيزةً أساسية في مسيرتهم جيلاً بعد جيل.
                      </p>
                      <p className="text-gray-200 leading-relaxed mt-4">
                        وتمثل هذه الصفحة نافذةً للتعريف بتاريخ القبيلة وموروثها ورجالاتها، وتأكيدًا على الاعتزاز بالجذور والأصالة والانتماء، واستمرارًا لرسالة الآباء والأجداد في حفظ الهوية وصون الموروث للأجيال القادمة.
                      </p>
                    </div>

                  </div>

                  {/* الهوية البصرية Section */}
                  <div className="mt-12">
                    <h3 className="text-2xl font-bold text-[#D4AF37] mb-6 text-center">الهوية البصرية لقبيلة النعيم</h3>
                    <div className="grid md:grid-cols-2 gap-8">
                      {/* بطاقة الشعار */}
                      <div className="bg-gradient-to-br from-[#162544] to-[#0a1628] rounded-2xl p-8 border-2 border-[#D4AF37]/30 hover:border-[#D4AF37]/50 transition-all">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-16 h-16 bg-[#D4AF37]/20 rounded-2xl flex items-center justify-center">
                            <span className="text-3xl">🛡️</span>
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-white">الشعار الرسمي</h4>
                            <p className="text-gray-400 text-sm">رمز الهوية والانتماء</p>
                          </div>
                        </div>
                        <div className="flex justify-center mb-6">
                          <OptimizedImage src="/images/tribe-logo-calligraphy.jpg"
                            alt="شعار قبيلة السادة النعيم"
                            className="max-w-[200px] w-full rounded-xl shadow-lg border-2 border-[#D4AF37]/30"
                          />
                        </div>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-start gap-3">
                            <span className="text-[#D4AF37]">⚪</span>
                            <div>
                              <p className="text-white font-semibold">الخلفية البيضاء</p>
                              <p className="text-gray-400">لون النقاء والطهارة - من أحب الألوان إلى الإسلام</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className="text-[#D4AF37]">☪️</span>
                            <div>
                              <p className="text-white font-semibold">كلمة التوحيد</p>
                              <p className="text-gray-400">أساس الدين وأول واجب على العباد</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className="text-[#D4AF37]">☕</span>
                            <div>
                              <p className="text-white font-semibold">الدلة العربية</p>
                              <p className="text-gray-400">رمز الكرم والضيافة العربية الأصيلة</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className="text-[#D4AF37]">⚔️</span>
                            <div>
                              <p className="text-white font-semibold">سيف ذو الفقار</p>
                              <p className="text-gray-400">رمز الشجاعة والعزة - منسوب للإمام علي رضي الله عنه</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* بطاقة الراية */}
                      <div className="bg-gradient-to-br from-[#162544] to-[#0a1628] rounded-2xl p-8 border-2 border-green-500/30 hover:border-green-500/50 transition-all">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center">
                            <span className="text-3xl">🚩</span>
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-white">الراية الرسمية</h4>
                            <p className="text-gray-400 text-sm">هوية تراثية وإسلامية متجذرة</p>
                          </div>
                        </div>
                        <div className="flex justify-center mb-6">
                          <OptimizedImage src="/images/tribe-flag.jpg"
                            alt="راية قبيلة السادة النعيم"
                            className="max-w-[250px] w-full rounded-xl shadow-lg border-2 border-green-500/30"
                          />
                        </div>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-start gap-3">
                            <span className="text-green-400">⚪</span>
                            <div>
                              <p className="text-white font-semibold">اللون الأبيض</p>
                              <p className="text-gray-400">رمز النقاء والشرف والصدق - كان النبي ﷺ يحب البياض</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className="text-green-400">☪️</span>
                            <div>
                              <p className="text-white font-semibold">شهادة الإسلام</p>
                              <p className="text-gray-400">التزام القبيلة بتحكيم شرع الله</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className="text-green-400">🌴⚔️</span>
                            <div>
                              <p className="text-white font-semibold">النخلة والسيف</p>
                              <p className="text-gray-400">رمز الحياة والعطاء والشجاعة</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className="text-green-400">🐪</span>
                            <div>
                              <p className="text-white font-semibold">النخوة: "أهل الصفرا"</p>
                              <p className="text-gray-400">نسبةً إلى الإبل الصفراء والفخر</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Heritage Section - متحف التراث */}
          <section id="heritage" className="py-24 bg-[#0a1628]">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                  <div className="inline-flex items-center gap-3 bg-[#D4AF37]/10 px-6 py-2 rounded-full mb-6">
                    <span className="text-3xl">🏛️</span>
                    <span className="text-[#D4AF37] font-bold">المتحف الرقمي</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-white mb-4">قاعات التراث</h2>
                  <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    استكشف مختلف جوانب تراثنا العربي الأصيل عبر قاعاتنا المتخصصة
                  </p>
                </div>

                {/* Featured Card - النسب */}
                <div className="mb-12">
                  <Link
                    to="/history"
                    className="group relative bg-gradient-to-br from-[#0a1628] via-[#162544] to-[#0a1628] rounded-3xl p-12 border-2 border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all duration-500 block overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-64 h-64 bg-[#D4AF37] rounded-full opacity-10 blur-[100px]"></div>
                    <div className="relative flex flex-col md:flex-row items-center gap-8">
                      <div className="w-32 h-32 bg-[#D4AF37] rounded-2xl flex items-center justify-center text-6xl">
                        📖
                      </div>
                      <div className="flex-1 text-center md:text-right">
                        <h3 className="text-3xl font-bold text-white mb-4">قاعة النسب والتاريخ</h3>
                        <p className="text-gray-300 text-lg mb-4">سلسلة النسب الهاشمي - تاريخ قبيلة النعيم - البطون والأفخاذ</p>
                        <div className="flex items-center gap-2 text-[#D4AF37] font-semibold">
                          <span>ادخل القاعة</span>
                          <ArrowRightIcon />
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Grid of Heritage Topics — 9 بطاقات (تم حذف النسب والتاريخ لأنها ظاهرة كـ featured card فوق) */}
                <div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  role="list"
                  aria-label="قاعات التراث"
                >
                  {heritageTopics.filter(t => t.link !== '/history').map((topic, index) => (
                    <HeritageCard
                      key={index}
                      icon={topic.icon}
                      title={topic.title}
                      description={topic.description}
                      link={topic.link}
                      color={topic.color}
                    />
                  ))}
                </div>

                {/* Featured Card - البادية السورية (الحماد) - في الأسفل */}
                <div className="mt-12">
                  <Link
                    to="/badia"
                    className="group relative bg-gradient-to-br from-[#0a1628] via-stone-900/40 to-[#0a1628] rounded-3xl p-12 border-2 border-stone-500/30 hover:border-amber-500 transition-all duration-500 block overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-80 h-80 bg-amber-700 rounded-full opacity-10 blur-[120px]"></div>
                    <div className="relative flex flex-col md:flex-row items-center gap-8">
                      <div className="w-32 h-32 bg-gradient-to-br from-amber-700 to-stone-800 rounded-2xl flex items-center justify-center text-6xl shadow-2xl">
                        🏜️
                      </div>
                      <div className="flex-1 text-center md:text-right">
                        <h3 className="text-3xl font-bold text-white mb-4">قاعة البادية السورية (الحماد)</h3>
                        <p className="text-gray-300 text-lg mb-4">
                          هضبة الحماد السوري - مهد قبيلة النعيم - الأرض والتاريخ والجغرافيا
                        </p>
                        <div className="flex items-center gap-2 text-amber-400 font-semibold">
                          <span>ادخل القاعة</span>
                          <ArrowRightIcon />
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Videos Section */}
          <section id="videos" className="py-24 bg-gradient-to-b from-[#0a1628] to-[#162544]">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-3 bg-red-600/20 px-6 py-2 rounded-full mb-6">
                    <span className="text-3xl">📺</span>
                    <span className="text-red-400 font-bold">محتوى مرئي</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-white mb-4">الفيديوهات المميزة</h2>
                </div>

                {/* Featured Video */}
                <a
                  href={`https://www.youtube.com/watch?v=${featuredVideo.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative bg-gradient-to-br from-white/10 to-white/5 rounded-3xl overflow-hidden border-2 border-red-600/50 hover:border-red-600 transition-all duration-500 block"
                >
                  <div className="relative aspect-video">
                    <OptimizedImage src={`https://i.ytimg.com/vi/${featuredVideo.id}/maxresdefault.jpg`}
                      alt={featuredVideo.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://i.ytimg.com/vi/${featuredVideo.id}/sddefault.jpg`;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-transparent to-transparent"></div>
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center shadow-lg transform scale-0 group-hover:scale-100 transition-transform">
                        <PlayIcon />
                      </div>
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-white mb-4 text-center group-hover:text-red-400 transition-colors">
                      {featuredVideo.title}
                    </h3>
                    <p className="text-gray-300 text-center">{featuredVideo.description}</p>
                    <div className="text-center mt-6">
                      <span className="inline-flex items-center gap-2 px-8 py-3 bg-red-600 text-white font-bold rounded-full">
                        <YoutubeIcon />
                        شاهد على يوتيوب
                      </span>
                    </div>
                  </div>
                </a>
              </div>

              {/* Latest Videos Grid */}
              {latestVideos.length > 0 && (
                <div className="mt-16">
                  <h3 className="text-3xl font-black text-white mb-8 text-center">أحدث الفيديوهات</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {latestVideos.map((video) => (
                      <a
                        key={video.id}
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block bg-gradient-to-br from-white/5 to-white/0 rounded-2xl overflow-hidden border border-white/10 hover:border-red-600/50 transition-all duration-300 hover:transform hover:scale-[1.02]"
                      >
                        <div className="relative aspect-video bg-[#0a1628]">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            loading="lazy"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = `https://i.ytimg.com/vi/${video.id}/sddefault.jpg`
                            }}
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                              <PlayIcon />
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="text-white text-sm font-bold line-clamp-2 group-hover:text-red-400 transition-colors">
                            {video.title}
                          </h4>
                        </div>
                      </a>
                    ))}
                  </div>
                  <div className="text-center mt-8">
                    <a
                      href={socialLinks.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-8 py-3 bg-red-600/20 border border-red-600/50 text-red-400 font-bold rounded-full hover:bg-red-600 hover:text-white transition-all"
                    >
                      <YoutubeIcon />
                      <span>شاهد كل الفيديوهات على يوتيوب</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="py-24 bg-[#0a1628]">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-3 bg-[#D4AF37]/10 px-6 py-2 rounded-full mb-6">
                    <span className="text-3xl">📱</span>
                    <span className="text-[#D4AF37] font-bold">تواصل معنا</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-white mb-4">تابعونا</h2>
                  <p className="text-gray-400 text-lg">انضموا إلينا في رحلة توثيق التاريخ والتراث العربي</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6" role="list" aria-label="حساباتنا على وسائل التواصل الاجتماعي">
                  <a
                    href={socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    role="listitem"
                    aria-label="تابعنا على يوتيوب (يفتح في نافذة جديدة)"
                    className="bg-gradient-to-br from-red-600/20 to-red-600/5 rounded-2xl p-6 text-center border border-red-600/30 hover:border-red-600 transition-all hover:transform hover:scale-105 block focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <div className="w-14 h-14 bg-red-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-white" aria-hidden="true">
                      <YoutubeIcon />
                    </div>
                    <span className="text-white font-bold">يوتيوب</span>
                  </a>

                  <a
                    href={socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    role="listitem"
                    aria-label="تابعنا على فيسبوك (يفتح في نافذة جديدة)"
                    className="bg-gradient-to-br from-blue-600/20 to-blue-600/5 rounded-2xl p-6 text-center border border-blue-600/30 hover:border-blue-600 transition-all hover:transform hover:scale-105 block focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-white" aria-hidden="true">
                      <FacebookIcon />
                    </div>
                    <span className="text-white font-bold">فيسبوك</span>
                  </a>

                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    role="listitem"
                    aria-label="تابعنا على انستغرام (يفتح في نافذة جديدة)"
                    className="bg-gradient-to-br from-pink-600/20 to-pink-600/5 rounded-2xl p-6 text-center border border-pink-600/30 hover:border-pink-600 transition-all hover:transform hover:scale-105 block focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-xl flex items-center justify-center mx-auto mb-4 text-white" aria-hidden="true">
                      <InstagramIcon />
                    </div>
                    <span className="text-white font-bold">انستغرام</span>
                  </a>

                  <a
                    href={socialLinks.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    role="listitem"
                    aria-label="تابعنا على تيك توك (يفتح في نافذة جديدة)"
                    className="bg-gradient-to-br from-gray-600/20 to-gray-600/5 rounded-2xl p-6 text-center border border-gray-600/30 hover:border-gray-600 transition-all hover:transform hover:scale-105 block focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center mx-auto mb-4 text-white" aria-hidden="true">
                      <TiktokIcon />
                    </div>
                    <span className="text-white font-bold">تيك توك</span>
                  </a>
                </div>

                {/* Hashtags */}
                <div className="mt-12 bg-gradient-to-br from-[#162544] to-[#0a1628] rounded-3xl p-10 border border-[#D4AF37]/30 text-center">
                  <h3 className="text-2xl font-bold text-[#D4AF37] mb-8">هاشتاقاتنا</h3>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {['#قبيلة_النعيم', '#السادة_النعيم', '#تراث_النعيم', '#نسب_النعيم', '#تاريخ_النعيم', '#أهل_الصفرا', '#عزالدين_أبو_حمرة', '#فروسية_النعيم'].map((tag, index) => (
                      <span key={index} className="px-4 py-2 bg-white/5 rounded-full text-gray-300 hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] transition-all border border-white/10">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Newsletter Section */}
          <section className="py-20 bg-gradient-to-b from-[#0a1628] to-[#162544]">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <Newsletter />
              </div>
            </div>
          </section>

          {/* Footer */}
          <Footer />
        </div>
        </>
      }/>

      {/* Heritage Pages - lazy loaded with Suspense */}
      <Route path="/history" element={<Suspense fallback={<PageLoader />}><HistoryPage /></Suspense>} />
      <Route path="/camels" element={<Suspense fallback={<PageLoader />}><CamelsPage /></Suspense>} />
      <Route path="/horses" element={<Suspense fallback={<PageLoader />}><HorsesPage /></Suspense>} />
      <Route path="/sheep" element={<Suspense fallback={<PageLoader />}><SheepPage /></Suspense>} />
      <Route path="/wasm" element={<Suspense fallback={<PageLoader />}><WasmPage /></Suspense>} />
      <Route path="/poetry" element={<Suspense fallback={<PageLoader />}><PoetryPage /></Suspense>} />
      <Route path="/coffee" element={<Suspense fallback={<PageLoader />}><CoffeePage /></Suspense>} />
      <Route path="/traditions" element={<Suspense fallback={<PageLoader />}><TraditionsPage /></Suspense>} />
      <Route path="/tent" element={<Suspense fallback={<PageLoader />}><TentPage /></Suspense>} />
      <Route path="/town" element={<Suspense fallback={<PageLoader />}><TownPage /></Suspense>} />
      <Route path="/badia" element={<Suspense fallback={<PageLoader />}><BadiaPage /></Suspense>} />
      <Route path="/search" element={<Suspense fallback={<PageLoader />}><SearchPage /></Suspense>} />
      <Route path="/blog" element={<Suspense fallback={<PageLoader />}><BlogPage /></Suspense>} />
      <Route path="/blog/:id" element={<Suspense fallback={<PageLoader />}><BlogPostPage /></Suspense>} />
      <Route path="*" element={<Suspense fallback={<PageLoader />}><NotFoundPage /></Suspense>} />
    </Routes>
    </main>
    <PWAInstallPrompt />
    <ThemeToggle />
    </>
  )
}

export default App