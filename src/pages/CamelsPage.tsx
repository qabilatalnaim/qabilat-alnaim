import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import Footer from '../components/Footer'
import OptimizedImage from '../components/OptimizedImage'
import Breadcrumbs from '../components/Breadcrumbs'
import { seoConfig } from '../lib/seo-config'
import { useState, useRef, useEffect } from 'react'
import { useLatestVideos, useCamelsPlaylist, LatestVideo } from '../lib/useSocialStats'

// Icons
const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
)

const CamelIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 2l-3 4-2-1-1 2-2-1-2 2h-3l-1-2-3 1 1 2-2 1v3l2 1v1l-2 2v2l3 1 2-1 1 2 2-1h1l1-2 2 1 1-3 2 1v-2l-2-2 2-1v-3l-2-1 1-2 3 1 1-2-3-1h-3l-2 2-2-1-1 2-2-1-2 1-3-4z"/>
  </svg>
)

const MilkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 2h8"/><path d="M9 2v2.789a4 4 0 0 1-.672 2.219l-.656.984A4 4 0 0 0 7 10.212V20a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9.789a4 4 0 0 0-.672-2.219l-.656-.984A4 4 0 0 1 15 4.788V2"/>
  </svg>
)

const WoolIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M12 6v12"/><path d="M6 12h12"/>
  </svg>
)

const MeatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15.5 2.5c2 0 3.5 1.5 3.5 3.5 0 1.58-.98 2.9-2.38 3.38"/><path d="M8.5 2.5c-2 0-3.5 1.5-3.5 3.5 0 1.58.98 2.9 2.38 3.38"/><path d="M3 10c0 4.42 3.58 8 8 8s8-3.58 8-8H3z"/>
  </svg>
)

const PastureIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313-12.454z"/>
    <path d="M17 4a2 2 0 0 0 2 2a2 2 0 0 0 -2 2a2 2 0 0 0 -2-2a2 2 0 0 0 2-2"/>
  </svg>
)

const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5a5.5 5.5 0 0 0-11 0c0 2.29 1.51 4.04 3 5.5l7 7z"/>
  </svg>
)

const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)

const AwardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
  </svg>
)

const TrophyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
  </svg>
)

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) => {
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

  return <div ref={ref}>{count}{suffix}</div>
}

export default function CamelsPage() {
  const stats = [
    { number: 30000, label: 'رأس من الإبل', suffix: '+' },
    { number: 12, label: 'سلالة أصيلة', suffix: '' },
    { number: 150, label: 'سنة من الخبرة', suffix: '+' },
    { number: 400, label: 'مربي ومالك', suffix: '+' },
  ]

  // قائمة تشغيل "إبل النعيم الصفرا" - المختارة من YouTube (تتحدث ديناميكياً)
  const { videos: playlistVideos, data: playlistData, loading: videosLoading, refresh: refreshPlaylist } = useCamelsPlaylist()
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try { await refreshPlaylist() } finally { setTimeout(() => setIsRefreshing(false), 600) }
  }

  const camelTypes = [
    {
      name: 'الإبل الحُمر (العادية)',
      description: 'الأكثر انتشاراً في البادية، تتميز بتحمّل المشاق وصبرها على العطش والجوع، وكانت سفينة الصحراء في رحلات الترحال والترحال.',
      features: ['تحمّل عالٍ', 'صبر على المشاق', 'سفينة الصحراء'],
      icon: <CamelIcon />
    },
    {
      name: 'الإبل العراب',
      description: 'تُركب للمهمات الرسمية والمسافات البعيدة، تتميز بسرعة الجري وجمال المنظر ورشاقة الحركة وأناقة الخطوة.',
      features: ['سرعة الفائقة', 'جمال المنظر', 'ركوب رسمي'],
      icon: <CamelIcon />
    },
    {
      name: 'المهاري',
      description: 'تُستخدم في السباقات والمعارض، وتتميز بجسمها الرياضي وسرعتها الفائقة وبيئتها المخصصة لرياضة الهجن.',
      features: ['للسباقات', 'جسم رياضي', 'سرعة عالية'],
      icon: <CamelIcon />
    },
    {
      name: 'النخيل (الصفراء)',
      description: 'سُميت بالصفراء نسبة إلى لونها الذهبي المميز، وكانت مفضلة لدى قبيلة النعيم، واشتهرت بها منطقة الصفرا.',
      features: ['لون مميز', 'أصيلة', 'تراث عريق'],
      icon: <CamelIcon />
    },
  ]

  const products = [
    { name: 'حليب الإبل', description: 'غني بالبروتين والفيتامينات', icon: <MilkIcon />, color: 'from-amber-500 to-orange-500' },
    { name: 'لحم الإبل', description: 'لحم صحي قليل الدهون', icon: <MeatIcon />, color: 'from-red-500 to-rose-500' },
    { name: 'الوبر', description: 'للملابس والبطانيات الفاخرة', icon: <WoolIcon />, color: 'from-gray-400 to-gray-600' },
    { name: 'الجلد', description: 'منتجات جلدية أصيلة', icon: <WoolIcon />, color: 'from-yellow-600 to-amber-700' },
  ]

  const traditions = [
    {
      title: 'تراث تربية الإبل',
      description: 'تربية الإبل جزء أصيل من الموروث البدوي، متوارث عبر الأجيال بالخبرة والمعرفة العريقة عن طبيعة البادية.',
      icon: <HeartIcon />
    },
    {
      title: 'سباقات الهجن',
      description: 'تُقام سنوياً سباقات الهجن في العديد من المناسبات، وتُشكّل مصدر فخر لأصحاب الإبل الفائزة.',
      icon: <TrophyIcon />
    },
    {
      title: 'الحماية والتنقل',
      description: 'كانت الإبل وسيلة النقل الأساسية في البادية، وكان اركوبها للتنقل والترحال والبحث عن الماء والكلأ.',
      icon: <ShieldIcon />
    },
  ]

  return (
    <>
      <SEO {...seoConfig.camels} faq={[
        { question: 'ما هي سلالة إبل قبيلة النعيم؟', answer: 'قبيلة النعيم أهل الصفرا ٥١٥ اشتهرت بسلالات الإبل الصغراء الأصيلة المعروفة بجمالها وقوتها وقدرتها على التأقلم مع البيئة الصحراوية.' },
        { question: 'ما هي أهمية الإبل في تراث النعيم؟', answer: 'الإبل رمز الهوية والفخر عند قبيلة النعيم، وتُعدّ رمزا للكرم والضيافة، كما تُستخدم في النقل والحماية وسباقات الهجن.' },
        { question: 'كم عدد بطون قبيلة النعيم؟', answer: 'قبيلة النعيم تتألف من أربعة بطون رئيسية: الفخر، المحمدية (المحاميد)، الحزومين، والبو طارق.' },
      ]} />
      <Breadcrumbs items={[{ label: 'الإبل' }]} />
      <div className="min-h-screen bg-[#0a1628] pt-20 md:pt-24 pb-16">
      {/* Hero Section — الصورة في الأعلى، النص تحتها (متناسب مع كل الأجهزة) */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-3 sm:px-4 pt-4 md:pt-6 pb-8 md:pb-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-4 md:mb-6">
              <div className="inline-flex flex-col items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-blue-600/30 to-amber-600/30 px-5 sm:px-7 md:px-10 py-3 md:py-4 rounded-2xl border border-[#D4AF37]/40 shadow-[0_0_24px_rgba(212,175,55,0.35)] backdrop-blur-md">
                <span className="flex items-center gap-2 text-base sm:text-lg md:text-2xl font-black text-white">
                  <span className="text-2xl md:text-3xl">🐪</span>
                  <span>إبل قبيلة السادة النعيم</span>
                </span>
                <span className="text-xs sm:text-sm md:text-base font-bold text-[#D4AF37]">أهل الصفرا.. موروث الأصالة وهيبة البادية</span>
              </div>
            </div>
            <figure className="relative rounded-2xl md:rounded-3xl overflow-hidden border-2 border-[#D4AF37]/30 shadow-[0_0_40px_rgba(212,175,55,0.25)]">
              <picture>
                <source type="image/avif" srcSet="/images/camels-panorama-2026-400w.avif 400w, /images/camels-panorama-2026-800w.avif 800w, /images/camels-panorama-2026-1200w.avif 1200w, /images/camels-panorama-2026-1600w.avif 1600w, /images/camels-panorama-2026.avif 2000w" sizes="(max-width: 480px) 100vw, (max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px" />
                <source type="image/webp" srcSet="/images/camels-panorama-2026-400w.webp 400w, /images/camels-panorama-2026-800w.webp 800w, /images/camels-panorama-2026-1200w.webp 1200w, /images/camels-panorama-2026-1600w.webp 1600w, /images/camels-panorama-2026-2000w.webp 2000w" sizes="(max-width: 480px) 100vw, (max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px" />
                <img src="/images/camels-panorama-2026-1600w.webp" srcSet="/images/camels-panorama-2026-400w.webp 400w, /images/camels-panorama-2026-800w.webp 800w, /images/camels-panorama-2026-1200w.webp 1200w, /images/camels-panorama-2026-1600w.webp 1600w, /images/camels-panorama-2026-2000w.webp 2000w" sizes="(max-width: 480px) 100vw, (max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px" alt="بانوراما إبل قبيلة السادة النعيم أهل الصفرا ٥١٥ في البادية السورية - إبل الصفرا الأصيلة تتقدم في مسارات البادية" className="w-full h-auto object-cover" loading="eager" decoding="async" fetchPriority="high" width="1672" height="941" />
              </picture>
              <figcaption className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/70 to-transparent px-3 md:px-6 py-2.5 md:py-4">
                <p className="text-center text-white text-xs sm:text-sm md:text-base font-bold drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">إبل قبيلة السادة النعيم أهل الصفرا ٥١٥ — في مسارات البادية والحماد</p>
              </figcaption>
            </figure>
            <div className="flex items-center justify-center gap-3 mt-6 md:mt-8 mb-5 md:mb-7">
              <span className="h-px w-10 md:w-20 bg-gradient-to-r from-transparent to-[#D4AF37]"></span>
              <span className="text-xl md:text-2xl text-[#D4AF37]">✦</span>
              <span className="h-px w-10 md:w-20 bg-gradient-to-l from-transparent to-[#D4AF37]"></span>
            </div>
            <p className="text-sm sm:text-base md:text-xl text-gray-100 max-w-3xl mx-auto text-center leading-relaxed px-2 mb-6 md:mb-8">في ذاكرة البادية، كانت الإبل رفيقة الترحال وعنوان الصبر والأصالة، وفي الموروث الشعبي لقبيلة السادة النعيم ارتبطت «الصفرا» بمعاني النخوة والفخر والاعتزاز بالموروث.</p>
            <div className="text-center mb-6 md:mb-8">
              <div className="inline-block bg-amber-600/20 backdrop-blur-md rounded-2xl px-5 sm:px-6 md:px-8 py-2.5 md:py-4 border border-amber-600/40">
                <p className="text-amber-400 font-bold text-lg md:text-2xl">"روسٍ تعرف المجد"</p>
                <p className="text-gray-400 text-xs md:text-sm mt-1 md:mt-2">من أمثال البادية العربية</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mb-4">
              <a href="#camel-content" className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#c5a032] text-[#0a1628] font-bold px-4 sm:px-5 md:px-7 py-2.5 md:py-3 rounded-full text-sm md:text-base transition-all hover:scale-105 shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                <span>اكتشف الموروث</span>
                <span>↓</span>
              </a>
              <a href="#camel-content" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold px-4 sm:px-5 md:px-7 py-2.5 md:py-3 rounded-full text-sm md:text-base border border-white/20 transition-all">
                <span>موروثٌ لا يُنسى في ذاكرة الحماد</span>
                <span>🏜️</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-b from-[#0a1628] to-[#162544]">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-gradient-to-br from-[#162544] to-[#0a1628] rounded-2xl p-8 text-center border border-white/10 hover:border-[#D4AF37]/50 transition-all hover:transform hover:scale-105">
                  <div className="text-4xl md:text-5xl font-black text-[#D4AF37] mb-2">
                    <AnimatedCounter end={stat.number} suffix={stat.suffix} />
                  </div>
                  <div className="text-gray-400 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section id="camel-content" className="py-20 bg-[#0a1628] scroll-mt-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">

            {/* مقدمة شاعرية مفصّلة - الإبل والصفرا */}
            <div className="space-y-8 mb-16">
              {/* الافتتاحية */}
              <div className="bg-gradient-to-br from-[#162544] to-[#0a1628] rounded-3xl p-10 md:p-14 border border-[#D4AF37]/30">
                <div className="text-center mb-10">
                  <span className="text-7xl">🐪</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-[#D4AF37] mb-8 text-center">
                  إبل قبيلة السادة النعيم | أهل الصفرا
                </h1>
                <div className="text-gray-200 text-lg leading-loose space-y-6 text-justify">
                  <p>
                    منذ أن عرفت البادية حياة الترحال، كانت الإبل رفيقة الإنسان في أسفاره، وذخيرته في أيام الشدة، وعنوانًا للصبر والقوة والتحمل. وفي تراث قبيلة السادة النعيم، تحتل الإبل مكانة راسخة في الذاكرة الشعبية، لما تمثله من أصالةٍ متوارثة، وارتباطٍ عميق بحياة البادية ومراعيها ومواردها، وما تحمله من قيم الكرم والنجدة والصبر والوفاء.
                  </p>
                  <p>
                    وقد عُرفت تربية الإبل بين أبناء القبيلة بوصفها جزءًا من الموروث البدوي الذي تناقلته الأجيال، حيث ارتبطت معرفة أهل البادية بالإبل بخبرات متوارثة في معرفة صفاتها، والعناية بها، واختيار ما يتصف منها بالقوة وحسن البنية وجمال الهيئة والقدرة على التحمل ومواجهة ظروف الصحراء ومشقة الترحال.
                  </p>
                </div>
              </div>

              {/* الصفرا.. رمز النخوة */}
              <div className="bg-gradient-to-br from-[#1a2845] to-[#0a1628] rounded-3xl p-8 md:p-12 border-r-4 border-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.15)]">
                <h3 className="text-2xl md:text-3xl font-bold text-[#D4AF37] mb-6 flex items-center gap-3">
                  <span className="text-3xl">🟡</span>
                  <span>الصفرا.. رمزٌ من رموز النخوة</span>
                </h3>
                <div className="text-gray-200 text-lg leading-loose space-y-4 text-justify">
                  <p>
                    وفي الذاكرة التراثية المتوارثة لقبيلة السادة النعيم، يحضر اسم «أهل الصفرا» بوصفه من رموز النخوة والفخر والاعتزاز بالهوية القبلية.
                  </p>
                  <p>
                    وقد تعددت الروايات الشعبية في تفسير ارتباط هذه النخوة بالصفرا؛ فهناك روايات تربطها بالخيل الصفراء الأصيلة، وأخرى تتناقل ارتباطها بناقة صفراء أو بموضع عُرف باسم الصفرا. ومهما اختلفت الروايات في تفاصيلها، فقد بقيت «الصفرا» حاضرة في الوجدان الشعبي بوصفها رمزًا من رموز الموروث والنخوة التي توارثتها الأجيال.
                  </p>
                  <p>
                    ومن هنا، لم يعد اللون مجرد صفة تُرى بالعين، بل أصبح في الذاكرة الشعبية رمزًا يحمل دلالات الفخر والعز والنجدة والشجاعة، ويستحضر معه تاريخ البادية وقيم أهلها، وما عُرف عن أبناء القبيلة من تمسكهم بموروث الآباء والأجداد.
                  </p>
                </div>
              </div>

              {/* الإبل ذاكرة البادية */}
              <div className="bg-gradient-to-br from-[#1a2845] to-[#0a1628] rounded-3xl p-8 md:p-12 border-r-4 border-amber-600 shadow-[0_0_30px_rgba(217,119,6,0.15)]">
                <h3 className="text-2xl md:text-3xl font-bold text-amber-400 mb-6 flex items-center gap-3">
                  <span className="text-3xl">🐪</span>
                  <span>الإبل.. ذاكرة البادية الحية</span>
                </h3>
                <div className="text-gray-200 text-lg leading-loose space-y-4 text-justify">
                  <p>
                    كانت الإبل جزءًا لا يتجزأ من تفاصيل الحياة البدوية؛ ترافق أهلها في الحل والترحال، وتسير معهم في الفيافي والسهول، وتقطع المسافات الطويلة بين موارد الماء ومواطن الكلأ.
                  </p>
                  <p>
                    وفي ظل هذه الحياة، نشأت بين الإنسان وإبله علاقة خاصة، تقوم على المعرفة والرعاية والصبر. فكان راعي الإبل يعرف طباعها، ويميز صفاتها، ويحفظ أنسابها ومراعيها، ويعتني بها كما يعتني بجزء من موروثه الذي ورثه عن آبائه.
                  </p>
                  <p>
                    ولهذا بقيت الإبل في الذاكرة التراثية لقبيلة السادة النعيم أكثر من مجرد وسيلة للترحال؛ إنها جزء من قصة البادية، وشاهد على حياة الأجداد، ورمز للصبر والجلد والأصالة.
                  </p>
                </div>
              </div>

              {/* بين المراعي والمرابع */}
              <div className="bg-gradient-to-br from-[#1a2845] to-[#0a1628] rounded-3xl p-8 md:p-12 border-r-4 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
                <h3 className="text-2xl md:text-3xl font-bold text-emerald-400 mb-6 flex items-center gap-3">
                  <span className="text-3xl">🌾</span>
                  <span>بين المراعي والمرابع</span>
                </h3>
                <div className="text-gray-200 text-lg leading-loose space-y-4 text-justify">
                  <p>
                    في مواسم الربيع، حين تخضر الأرض وتنبت المراعي، تظهر صورة البادية في أجمل مشاهدها؛ قطعان الإبل تسير في رحاب الأرض، وبينها الإبل التي ارتبطت في الذاكرة الشعبية باسم الصفرا، في مشهد تختلط فيه أصالة الموروث بجمال الطبيعة.
                  </p>
                  <p>
                    وهناك، بين رحابة الحماد والسهول والمراعي، تتجسد صورة من صور الحياة التي عاشها الآباء والأجداد؛ حياةٌ كانت تقوم على الترحال، ومعرفة الأرض، ومواسم المطر، ومواطن الكلأ، وحفظ العادات والسلوم التي شكّلت جزءًا من شخصية المجتمع البدوي عبر الأجيال.
                  </p>
                </div>
              </div>

              {/* موروث لا يُنسى */}
              <div className="bg-gradient-to-br from-[#1a2845] to-[#0a1628] rounded-3xl p-8 md:p-12 border-r-4 border-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.15)]">
                <h3 className="text-2xl md:text-3xl font-bold text-orange-400 mb-6 flex items-center gap-3">
                  <span className="text-3xl">🏜️</span>
                  <span>موروثٌ لا يُنسى</span>
                </h3>
                <div className="text-gray-200 text-lg leading-loose space-y-4 text-justify">
                  <p>
                    إن الحديث عن إبل قبيلة السادة النعيم هو حديث عن جانب أصيل من تراث البادية؛ عن موروثٍ حملته الرواية الشعبية من جيل إلى جيل، وعن حياةٍ تركت بصمتها في الذاكرة، وعن قيمٍ ما زالت حاضرة في وجدان أبناء القبيلة.
                  </p>
                  <p>
                    وتبقى «أهل الصفرا» نخوةً تراثيةً تحمل في معناها رمزية الفخر والاعتزاز، وتستحضر صورة البادية وأصالتها، وتذكّر الأجيال بأن الموروث الحقيقي ليس مجرد حكايات تُروى، بل ذاكرةٌ تحفظ تاريخ الآباء، وقيمٌ تصونها الأجيال، وهويةٌ تستمر ما دام هناك من يعرف قيمتها ويحفظها.
                  </p>
                </div>
              </div>

              {/* الختام الشاعري */}
              <div className="bg-gradient-to-br from-[#162544] via-[#0a1628] to-[#162544] rounded-3xl p-10 md:p-14 border border-[#D4AF37]/40 text-center shadow-[0_0_40px_rgba(212,175,55,0.2)]">
                <div className="mb-6">
                  <span className="text-5xl">🟡</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-[#D4AF37] mb-6">
                  أهل الصفرا
                </h3>
                <div className="space-y-3 mb-8">
                  <p className="text-2xl md:text-3xl text-white font-bold">نخوةٌ تُروى...</p>
                  <p className="text-2xl md:text-3xl text-white font-bold">وموروثٌ يُصان...</p>
                  <p className="text-2xl md:text-3xl text-white font-bold">وذاكرةٌ تحفظها الأجيال...</p>
                </div>
                <div className="max-w-3xl mx-auto text-gray-200 text-lg leading-loose space-y-4 text-justify border-t border-[#D4AF37]/20 pt-8">
                  <p>
                    هكذا تبقى الإبل في تراث قبيلة السادة النعيم شاهدًا على أصالة البادية، وتبقى الصفرا رمزًا حاضرًا في الذاكرة الشعبية، تحمل معها عبق الماضي، وهيبة الموروث، وقيم النخوة والفخر والكرامة.
                  </p>
                  <p>
                    فالإبل موروثٌ من موروث البادية، والصفرا رمزٌ من رموز النخوة، وتراث قبيلة السادة النعيم أمانةٌ تحفظها الأجيال وترويها للأبناء والأحفاد.
                  </p>
                </div>
                <div className="mt-10 inline-block">
                  <div className="bg-amber-600/20 rounded-2xl px-8 py-4 border border-amber-600/40">
                    <p className="text-amber-400 font-bold text-2xl">"روسٍ تعرف المجد"</p>
                    <p className="text-gray-400 text-sm mt-2">من أمثال البادية العربية</p>
                  </div>
                </div>
              </div>
            </div>

            {/* قسم الوسم ٥١٥ - الهوية والنسب */}
            <div className="mb-20">
              <div className="text-center mb-10 md:mb-12">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#D4AF37]/20 to-emerald-600/20 px-6 py-2.5 rounded-full border border-[#D4AF37]/40 mb-4">
                  <span className="text-2xl">📋</span>
                  <span className="text-lg md:text-xl font-bold text-[#D4AF37]">الوسم ٥١٥ — هوية النسب الهاشمي</span>
                </div>
                <p className="text-base md:text-lg text-gray-200 max-w-4xl mx-auto leading-loose text-justify px-2">
                  الوسم في البادية ليس مجرد علامة، بل هو <span className="text-[#D4AF37] font-bold">هوية ونسب وتاريخ</span> يُحفظ عبر الأجيال. ووَسم <span className="text-[#D4AF37] font-black text-xl">٥١٥</span> هو وسم بني هاشم الجامع الذي يرمز إلى الانتماء للنسب الهاشمي الشريف.
                </p>
              </div>

              {/* صورة البانوراما الواقعية لقسم الوسم ٥١٥ */}
              <figure className="mb-10 md:mb-12 relative rounded-2xl md:rounded-3xl overflow-hidden border-2 border-[#D4AF37]/40 shadow-[0_0_50px_rgba(212,175,55,0.3)]">
                {/* Overlay النص العربي في الزاوية اليسرى السفلية */}
                <div className="absolute bottom-0 left-0 right-0 md:right-auto md:max-w-md z-10 pointer-events-none">
                  <div className="bg-gradient-to-tl from-[#0a1628]/95 via-[#0a1628]/75 to-transparent p-4 md:p-6">
                    <p className="text-[#D4AF37] text-base sm:text-lg md:text-2xl font-black leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] mb-1">
                      إبل قبيلة النعيم أهل الصفرا
                    </p>
                    <p className="text-white text-sm md:text-base font-bold leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] mb-2">
                      موروث الأصالة وهيبة البادية
                    </p>
                    <p className="text-gray-200 text-xs md:text-sm leading-loose drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                      في ربيع الحماد السوري، تخضر الأرض وتسمو الأصالة، وتبقى الإبل عنوان الصبر والعز، موروث الآباء والأجداد.
                    </p>
                  </div>
                </div>
                <picture>
                  <source
                    type="image/avif"
                    srcSet="/images/wasm-panorama-2026-400w.avif 400w, /images/wasm-panorama-2026-800w.avif 800w, /images/wasm-panorama-2026-1200w.avif 1200w, /images/wasm-panorama-2026-1600w.avif 1600w, /images/wasm-panorama-2026-2000w.avif 2000w"
                    sizes="(max-width: 480px) 100vw, (max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
                  />
                  <source
                    type="image/webp"
                    srcSet="/images/wasm-panorama-2026-400w.webp 400w, /images/wasm-panorama-2026-800w.webp 800w, /images/wasm-panorama-2026-1200w.webp 1200w, /images/wasm-panorama-2026-1600w.webp 1600w, /images/wasm-panorama-2026-2000w.webp 2000w"
                    sizes="(max-width: 480px) 100vw, (max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
                  />
                  <img
                    src="/images/wasm-panorama-2026-1600w.webp"
                    srcSet="/images/wasm-panorama-2026-400w.webp 400w, /images/wasm-panorama-2026-800w.webp 800w, /images/wasm-panorama-2026-1200w.webp 1200w, /images/wasm-panorama-2026-1600w.webp 1600w, /images/wasm-panorama-2026-2000w.webp 2000w"
                    sizes="(max-width: 480px) 100vw, (max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
                    alt="قطيع إبل قبيلة السادة النعيم أهل الصفرا ٥١٥ الأصيلة تتقدم في ربيع الحماد السوري - وسم ٥١٥ على الإبل الصفراء، الأرض تخضر وتسمو الأصالة"
                    className="w-full h-auto object-cover"
                    loading="lazy"
                    decoding="async"
                    width="1983"
                    height="793"
                  />
                </picture>
                <figcaption className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/70 to-transparent px-3 md:px-6 py-2.5 md:py-4">
                  <p className="text-center text-white text-xs sm:text-sm md:text-base font-bold drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                    إبل قبيلة النعيم أهل الصفرا — موروث الأصالة وهيبة البادية
                  </p>
                </figcaption>
              </figure>
              <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-8">
                <div className="group relative bg-gradient-to-br from-[#162544] via-[#1a2845] to-[#0a1628] rounded-3xl p-8 md:p-10 border-2 border-[#D4AF37]/40 shadow-[0_0_40px_rgba(212,175,55,0.2)] hover:border-[#D4AF37]/70 transition-all hover:transform hover:scale-[1.02]">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[#D4AF37]/20 rounded-2xl mb-4 group-hover:scale-110 transition-transform"><span className="text-4xl">📋</span></div>
                    <h3 className="text-2xl md:text-3xl font-black text-[#D4AF37] mb-2">وسم بني هاشم</h3>
                    <div className="text-5xl md:text-6xl font-black text-white drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]">٥١٥</div>
                  </div>
                  <div className="space-y-5">
                    <div>
                      <h4 className="text-lg font-bold text-[#D4AF37] mb-2 flex items-center gap-2"><span className="text-xl">📌</span><span>أصل الوسم</span></h4>
                      <p className="text-gray-200 leading-loose text-justify">وسم <span className="font-black text-[#D4AF37]">٥١٥</span> هو الوسم الجامع لقبائل بني هاشم، الذي أجمع عليه المشايخ والعوارف، ليكون رمزاً موحداً يجمع أبناء النسب الهاشمي تحت راية واحدة.</p>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-[#D4AF37] mb-2 flex items-center gap-2"><span className="text-xl">📌</span><span>دلالته</span></h4>
                      <p className="text-gray-200 leading-loose text-justify">يُمثّل الوسم العزّ ووحدة الصف وقوة الرابط بين أبناء القبائل، ويُجسّد تاريخاً ممتداً من المجد والأصالة.</p>
                    </div>
                  </div>
                </div>
                <div className="group relative bg-gradient-to-br from-[#162544] via-[#1a2845] to-[#0a1628] rounded-3xl p-8 md:p-10 border-2 border-emerald-500/40 shadow-[0_0_40px_rgba(16,185,129,0.2)] hover:border-emerald-500/70 transition-all hover:transform hover:scale-[1.02]">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"></div>
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/20 rounded-2xl mb-4 group-hover:scale-110 transition-transform"><span className="text-4xl">✒️</span></div>
                    <h3 className="text-2xl md:text-3xl font-black text-emerald-400 mb-2">وسم قبيلة النعيم</h3>
                    <div className="text-5xl md:text-6xl font-black text-white drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]">٥١</div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-gray-200 leading-loose text-justify text-base">ارتبط وسم <span className="font-black text-emerald-400 text-xl">٥١</span> بأبناء قبيلة النعيم، ويعبّر عن خصوصية داخلية تعكس عمق الانتماء وتراث القبيلة. وهو رمز يُستخدم للتمييز بين أبناء القبيلة.</p>
                    <div className="bg-emerald-500/10 rounded-2xl p-4 border border-emerald-500/30 text-center">
                      <p className="text-emerald-300 font-bold text-base">رمز الانتماء الخاص بأبناء القبيلة</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative bg-gradient-to-br from-[#162544] via-[#0a1628] to-[#162544] rounded-3xl p-8 md:p-12 border-2 border-[#D4AF37]/50 shadow-[0_0_50px_rgba(212,175,55,0.25)] text-center overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#D4AF37]/10 rounded-full blur-[80px]"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-[80px]"></div>
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-[#D4AF37]/20 rounded-2xl mb-5"><span className="text-5xl">📢</span></div>
                  <h3 className="text-2xl md:text-4xl font-black text-[#D4AF37] mb-4">إعلان القبيلة — تأكيد الهوية</h3>
                  <p className="text-lg md:text-xl text-gray-100 leading-loose max-w-4xl mx-auto mb-6 text-justify">تعلن قبيلة النعيم التزامها بـ <span className="font-black text-[#D4AF37] text-2xl mx-1">الوسم (٥١٥)</span> كرمز موحّد، تأكيداً على وحدة الصف واعتزازاً بالانتماء للنسب الهاشمي الشريف.</p>
                  <div className="max-w-3xl mx-auto my-8">
                    <div className="bg-[#0a1628]/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-[#D4AF37]/30">
                      <p className="text-2xl md:text-3xl text-[#D4AF37] font-black leading-relaxed" style={{ fontFamily: 'Cairo, serif' }}>﴿ وَاعْتَصِمُوا بِحَبْلِ اللَّهِ جَمِيعاً وَلَا تَفَرَّقُوا ﴾</p>
                      <p className="text-gray-400 text-sm mt-3">سورة آل عمران — الآية ١٠٣</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                    <div className="bg-[#D4AF37]/15 rounded-full px-5 py-2 border border-[#D4AF37]/40"><span className="text-[#D4AF37] font-bold text-sm md:text-base">هوية موحدة</span></div>
                    <div className="bg-emerald-500/15 rounded-full px-5 py-2 border border-emerald-500/40"><span className="text-emerald-300 font-bold text-sm md:text-base">نسب هاشمي</span></div>
                    <div className="bg-blue-500/15 rounded-full px-5 py-2 border border-blue-500/40"><span className="text-blue-300 font-bold text-sm md:text-base">وحدة الصف</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════
                قسم قائمة تشغيل الإبل - احترافي مثل YouTube
                ═══════════════════════════════════════════════════════════ */}
            <div className="mb-20">
              <div className="text-center mb-8 md:mb-10">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-red-600/20 to-[#D4AF37]/20 px-6 py-2.5 rounded-full border border-red-500/40 mb-4">
                  <span className="text-2xl">📺</span>
                  <span className="text-lg md:text-xl font-bold text-[#D4AF37]">قائمة تشغيل الإبل — فيديوهات مختارة</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
                  تعرّف على الإبل عبر الشاشة
                </h2>
                <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
                  مجموعة منتقاة من فيديوهات القناة تتناول سلالات الإبل، تربيتها، رعايتها، ودورها في حياة قبيلة السادة النعيم
                </p>
                {playlistData && (
                  <div className="mt-5 flex flex-wrap items-center justify-center gap-2 md:gap-3 text-xs md:text-sm">
                    <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 text-gray-300 px-3 py-1.5 rounded-full">
                      <span>🎬</span>
                      <span className="font-bold text-white">{playlistData.count}</span>
                      <span>فيديو</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 text-gray-300 px-3 py-1.5 rounded-full">
                      <span className={`w-2 h-2 rounded-full ${playlistData.source === 'live' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                      <span>{playlistData.source === 'live' ? 'مباشر من يوتيوب' : 'نسخة احتياطية'}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 text-gray-300 px-3 py-1.5 rounded-full">
                      <span>⏰</span>
                      <span>آخر تحديث: {new Date(playlistData.updatedAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                    </span>
                    <button
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                      className="inline-flex items-center gap-1.5 bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 border border-[#D4AF37]/40 text-[#D4AF37] hover:text-white px-3 py-1.5 rounded-full font-bold transition-all disabled:opacity-50"
                      aria-label="تحديث قائمة التشغيل"
                    >
                      <span className={isRefreshing ? 'animate-spin' : ''}>↻</span>
                      <span>{isRefreshing ? 'جاري التحديث...' : 'تحديث'}</span>
                    </button>
                  </div>
                )}
              </div>

              {videosLoading && (
                <div className="text-center py-12">
                  <div className="inline-block w-12 h-12 border-4 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin"></div>
                  <p className="text-gray-400 mt-4">جاري تحميل قائمة التشغيل...</p>
                </div>
              )}

              {!videosLoading && playlistVideos.length > 0 && (
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* المشغل الرئيسي (يسار) */}
                  <div className="lg:col-span-2">
                    <div className="bg-gradient-to-br from-[#162544] to-[#0a1628] rounded-3xl overflow-hidden border-2 border-[#D4AF37]/30 shadow-[0_0_40px_rgba(212,175,55,0.2)]">
                      <div className="relative aspect-video bg-black">
                        {activeVideoId ? (
                          <iframe
                            key={activeVideoId}
                            src={`https://www.youtube-nocookie.com/embed/${activeVideoId}?rel=0&modestbranding=1&hl=ar`}
                            title="مشغل فيديو الإبل"
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            loading="lazy"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            {playlistVideos[0] && (
                              <img
                                src={playlistVideos[0].thumbnail.replace('hqdefault', 'maxresdefault')}
                                alt={playlistVideos[0].title}
                                className="w-full h-full object-cover opacity-60"
                                loading="lazy"
                              />
                            )}
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mb-4 shadow-2xl shadow-red-600/50">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                                  <path d="M8 5v14l11-7z"/>
                                </svg>
                              </div>
                              <p className="text-white text-xl font-bold mb-2">قائمة تشغيل الإبل</p>
                              <p className="text-gray-300 text-sm">اختر فيديو من القائمة لبدء المشاهدة</p>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="p-4 md:p-5">
                        <h3 className="text-lg md:text-xl font-bold text-white mb-2 line-clamp-2">
                          {(activeVideoId ? playlistVideos.find(v => v.id === activeVideoId) : playlistVideos[0])?.title || 'تشغيل الفيديو'}
                        </h3>
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <span>📺</span>
                            <span>قناة قبيلة النعيم أهل الصفرا ٥١٥</span>
                          </div>
                          <a
                            href={playlistData?.playlistUrl || 'https://www.youtube.com/playlist?list=PLkJUzCOLsXAP224xba8-lMtGyw3ErpeDF'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-1.5 rounded-full text-sm transition-all"
                          >
                            <span>كل الفيديوهات</span>
                            <span>↗</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* قائمة التشغيل (يمين) */}
                  <div className="lg:col-span-1">
                    <div className="bg-gradient-to-br from-[#162544] to-[#0a1628] rounded-3xl border-2 border-white/10 p-3 md:p-4 h-full">
                      <div className="flex items-center justify-between mb-3 px-2">
                        <h3 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
                          <span>▶</span>
                          <span>قائمة التشغيل</span>
                        </h3>
                        <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded-full">
                          {playlistVideos.length} فيديو
                        </span>
                      </div>
                      <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
                        {playlistVideos.map((video, idx) => {
                          const isActive = (activeVideoId || playlistVideos[0]?.id) === video.id
                          return (
                            <button
                              key={video.id}
                              onClick={() => setActiveVideoId(video.id)}
                              className={`w-full text-right flex gap-2 md:gap-3 p-2 rounded-xl transition-all group ${
                                isActive
                                  ? 'bg-[#D4AF37]/15 border-2 border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.3)]'
                                  : 'hover:bg-white/5 border-2 border-transparent'
                              }`}
                            >
                              <div className="relative w-24 md:w-28 aspect-video rounded-lg overflow-hidden flex-shrink-0 bg-black">
                                <img
                                  src={video.thumbnail}
                                  alt={video.title}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                                {isActive && (
                                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                                      <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                                        <path d="M8 5v14l11-7z"/>
                                      </svg>
                                    </div>
                                  </div>
                                )}
                                <div className="absolute top-1 right-1 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded">
                                  {idx + 1}
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className={`text-xs md:text-sm font-bold leading-snug line-clamp-2 mb-1 ${
                                  isActive ? 'text-[#D4AF37]' : 'text-white group-hover:text-[#D4AF37]'
                                }`}>
                                  {video.title}
                                </h4>
                                <p className="text-[10px] md:text-xs text-gray-400 truncate">
                                  قبيلة النعيم ٥١٥
                                </p>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CTA لمشاهدة كل الفيديوهات */}
              <div className="mt-8 text-center">
                <a
                  href="https://www.youtube.com/playlist?list=PLkJUzCOLsXAP224xba8-lMtGyw3ErpeDF"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg transition-all hover:scale-105 shadow-[0_0_30px_rgba(220,38,38,0.4)]"
                >
                  <span className="text-2xl">📺</span>
                  <span>شاهد قائمة "إبل النعيم الصفرا" كاملة على يوتيوب</span>
                  <span>↗</span>
                </a>
              </div>
            </div>

            {/* Camel Types Grid */}
            <div className="mb-20">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4">سلالات الإبل العربية</h2>
                <p className="text-gray-400 text-lg">أنواع الإبل المتوارثة في القبيلة</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {camelTypes.map((type, index) => (
                  <div key={index} className="group bg-gradient-to-br from-[#162544] to-[#0a1628] rounded-3xl p-8 border border-white/10 hover:border-[#D4AF37]/50 transition-all duration-500 hover:transform hover:scale-[1.02] hover:shadow-[0_20px_60px_rgba(212,175,55,0.2)]">
                    <div className="flex items-start gap-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-600/20 to-amber-600/20 rounded-2xl flex items-center justify-center text-[#D4AF37] flex-shrink-0 group-hover:scale-110 transition-transform">
                        {type.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-3">{type.name}</h3>
                        <p className="text-gray-400 mb-4 leading-relaxed">{type.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {type.features.map((feature, i) => (
                            <span key={i} className="px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full text-sm font-medium">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Products Section */}
            <div className="mb-20">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4">منتجات الإبل</h2>
                <p className="text-gray-400 text-lg">منتجات أصيلة من إبل قبيلة النعيم</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {products.map((product, index) => (
                  <div key={index} className="group bg-gradient-to-br from-[#162544] to-[#0a1628] rounded-2xl p-8 text-center border border-white/10 hover:border-[#D4AF37]/50 transition-all hover:transform hover:scale-105">
                    <div className={`w-16 h-16 bg-gradient-to-br ${product.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                      {product.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                    <p className="text-gray-400 text-sm">{product.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Traditions Section */}
            <div className="mb-20">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4">التراث والتجربة</h2>
                <p className="text-gray-400 text-lg">الإرث العريق في تربية الإبل</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {traditions.map((item, index) => (
                  <div key={index} className="bg-gradient-to-br from-[#162544] to-[#0a1628] rounded-3xl p-10 border border-white/10 text-center hover:border-[#D4AF37]/30 transition-all">
                    <div className="w-20 h-20 bg-[#D4AF37]/20 rounded-full flex items-center justify-center text-[#D4AF37] mx-auto mb-6">
                      {item.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Famous Camels Section */}
            <div className="bg-gradient-to-br from-[#162544] to-[#0a1628] rounded-3xl p-10 md:p-14 border border-white/10">
              <div className="text-center mb-10">
                <h2 className="text-4xl font-bold text-white mb-4">الإبل في التاريخ والتراث</h2>
                <p className="text-gray-400 text-lg">قصص وإرث منسي للأجيال القادمة</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-blue-600/10 to-transparent rounded-2xl p-8 border border-blue-600/30">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-400">
                      <AwardIcon />
                    </div>
                    <h3 className="text-xl font-bold text-blue-400">قصة دخول الإبل إلى العرب</h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    تُروى قصص عديدة عن دخول الإبل إلى شبه الجزيرة العربية، وتعود في أصلها إلى رحلات التجارة من الهند والمناطق الشرقية. ومن تلك اللحظات التاريخية تأسست علاقة العرب بالإبل.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-amber-600/10 to-transparent rounded-2xl p-8 border border-amber-600/30">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-amber-600/20 rounded-xl flex items-center justify-center text-amber-400">
                      <TrophyIcon />
                    </div>
                    <h3 className="text-xl font-bold text-amber-400">الإبل في الشعر النبطي</h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    تغنّى الشعراء بالإبل في قصائدهم، وجعلوها رمزاً للكرم والشجاعة والأصالة. والشاعر النبطي لا يكتمل شعره إلا بذكر الإبل ومراعيها.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-600/10 to-transparent rounded-2xl p-8 border border-green-600/30">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center text-green-400">
                      <PastureIcon />
                    </div>
                    <h3 className="text-xl font-bold text-green-400">المراعي والمواسم</h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    معرفة أفضل المراعي وأوقات التنقل من أهم فنون الرعي، حيث يعرف الراعي خبرةً مواقع الكلأ بعد الأمطار ومواعيد الجفاف.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-600/10 to-transparent rounded-2xl p-8 border border-purple-600/30">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center text-purple-400">
                      <ShieldIcon />
                    </div>
                    <h3 className="text-xl font-bold text-purple-400">الإبل والكرم</h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    من أعراف العرب تقديم الضيافة من لحم الإبل وحليبها للزوار، وهذه العادة لا تزال حية في قبيلة النعيم وفي البوادي.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Back to Home */}
      <div className="text-center mt-16">
        <Link
          to="/"
          className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] text-[#0a1628] font-bold text-xl rounded-full hover:shadow-[0_0_40px_rgba(212,175,55,0.5)] transition-all transform hover:scale-105"
        >
          <span>العودة للرئيسية</span>
          <ArrowRightIcon />
        </Link>
      </div>
    </div>
          <Footer />
    </>
  )
}