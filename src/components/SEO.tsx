import { useEffect } from 'react'

export interface SEOProps {
  title: string
  description: string
  keywords?: string
  image?: string
  url?: string
  type?: 'website' | 'article'
  author?: string
  publishedTime?: string
  modifiedTime?: string
  section?: string
  noindex?: boolean
}

const SITE_NAME = 'قبيلة النعيم أهل الصفرا ٥١٥'
const SITE_URL = 'https://qabilat-al-naim.vercel.app'
const DEFAULT_IMAGE = `${SITE_URL}/images/logo.webp`
const DEFAULT_AUTHOR = 'قبيلة النعيم أهل الصفرا ٥١٥'

export default function SEO({
  title,
  description,
  keywords,
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  author = DEFAULT_AUTHOR,
  publishedTime,
  modifiedTime,
  section,
  noindex = false,
  faq, // New: array of { question, answer } for FAQ schema
}: SEOProps & { faq?: Array<{ question: string; answer: string }> }) {
  const fullUrl = url ? `${SITE_URL}${url}` : SITE_URL
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`

  useEffect(() => {
    // Title
    document.title = fullTitle

    // Helper to set/update meta tag
    const setMeta = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, name)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    const setLink = (rel: string, href: string) => {
      let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement
      if (!el) {
        el = document.createElement('link')
        el.setAttribute('rel', rel)
        document.head.appendChild(el)
      }
      el.setAttribute('href', href)
    }

    // Basic SEO
    setMeta('description', description)
    if (keywords) setMeta('keywords', keywords)
    setMeta('author', author)
    setMeta('robots', noindex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1')

    // Open Graph
    setMeta('og:type', type, 'property')
    setMeta('og:url', fullUrl, 'property')
    setMeta('og:title', fullTitle, 'property')
    setMeta('og:description', description, 'property')
    setMeta('og:image', image, 'property')
    setMeta('og:locale', 'ar_AR', 'property')
    setMeta('og:site_name', SITE_NAME, 'property')

    // Twitter
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:url', fullUrl)
    setMeta('twitter:title', fullTitle)
    setMeta('twitter:description', description)
    setMeta('twitter:image', image)

    // Article specific
    if (type === 'article') {
      if (publishedTime) setMeta('article:published_time', publishedTime, 'property')
      if (modifiedTime) setMeta('article:modified_time', modifiedTime, 'property')
      if (section) setMeta('article:section', section, 'property')
      if (author) setMeta('article:author', author, 'property')
    }

    // Canonical
    setLink('canonical', fullUrl)

    // Schema.org JSON-LD Structured Data
    const removeOldScripts = () => {
      const oldScripts = document.querySelectorAll('script[data-seo-schema]')
      oldScripts.forEach(s => s.remove())
    }
    removeOldScripts()

    // Organization schema (only on home page, persistent)
    if (url === '/' || !url) {
      const orgScript = document.createElement('script')
      orgScript.type = 'application/ld+json'
      orgScript.setAttribute('data-seo-schema', 'organization')
      orgScript.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
        logo: DEFAULT_IMAGE,
        description: 'قبيلة النعيم أهل الصفرا ٥١٥ (أهل الصفرا) من القبائل العربية العريقة في بلاد الشام. نسب هاشمي متصل بالإمام الحسين رضي الله عنه.',
        sameAs: [
          'https://www.youtube.com/@qabilatalnaim',
          'https://www.facebook.com/share/19n8j2XqBu/',
          'https://www.instagram.com/qabilatalnaim',
          'https://www.tiktok.com/@qabilaalnaim',
        ],
      })
      document.head.appendChild(orgScript)
    }

    // WebSite schema with SearchAction (home only)
    if (url === '/' || !url) {
      const websiteScript = document.createElement('script')
      websiteScript.type = 'application/ld+json'
      websiteScript.setAttribute('data-seo-schema', 'website')
      websiteScript.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_NAME,
        url: SITE_URL,
        inLanguage: 'ar',
        potentialAction: {
          '@type': 'SearchAction',
          target: `${SITE_URL}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      })
      document.head.appendChild(websiteScript)
    }

    // Article schema (for article-type pages)
    if (type === 'article') {
      const articleScript = document.createElement('script')
      articleScript.type = 'application/ld+json'
      articleScript.setAttribute('data-seo-schema', 'article')
      articleScript.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: fullTitle,
        description: description,
        image: image,
        url: fullUrl,
        author: {
          '@type': 'Organization',
          name: author,
          url: SITE_URL,
        },
        publisher: {
          '@type': 'Organization',
          name: SITE_NAME,
          logo: {
            '@type': 'ImageObject',
            url: DEFAULT_IMAGE,
          },
        },
        datePublished: publishedTime || '2024-01-01',
        dateModified: modifiedTime || new Date().toISOString().split('T')[0],
        inLanguage: 'ar',
        articleSection: section || 'التراث',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': fullUrl,
        },
      })
      document.head.appendChild(articleScript)
    }

    // BreadcrumbList schema (for non-home pages)
    if (url && url !== '/') {
      const breadcrumbScript = document.createElement('script')
      breadcrumbScript.type = 'application/ld+json'
      breadcrumbScript.setAttribute('data-seo-schema', 'breadcrumb')
      breadcrumbScript.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'الرئيسية',
            item: SITE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: title.split('|')[0].trim(),
            item: fullUrl,
          },
        ],
      })
      document.head.appendChild(breadcrumbScript)
    }

    // FAQ schema (for pages with FAQ content)
    if (faq && faq.length > 0) {
      const faqScript = document.createElement('script')
      faqScript.type = 'application/ld+json'
      faqScript.setAttribute('data-seo-schema', 'faq')
      faqScript.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      })
      document.head.appendChild(faqScript)
    }

    // Person schema (for important figures)
    if (section === 'التاريخ' || section === 'التراث') {
      const personScript = document.createElement('script')
      personScript.type = 'application/ld+json'
      personScript.setAttribute('data-seo-schema', 'person')
      personScript.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'عز الدين أبو حمرة (أحمد بن نعيم)',
        alternateName: 'الجد الجامع لقبيلة النعيم أهل الصفرا ٥١٥',
        description: 'الجدّ الجامع لقبيلة النعيم أهل الصفرا ٥١٥، رمز وحدة النسب وعمق الجذور. تحمل بلدة عز الدين اسمه تخليدًا لذكراه.',
        jobTitle: 'الجد الجامع',
        affiliation: {
          '@type': 'Organization',
          name: 'قبيلة النعيم أهل الصفرا ٥١٥',
        },
        birthPlace: {
          '@type': 'Place',
          name: 'بلاد الشام',
        },
        knowsAbout: [
          'نسب هاشمي',
          'السادة الرفاعية',
          'القبائل العربية',
          'تاريخ بلاد الشام',
        ],
      })
      document.head.appendChild(personScript)
    }
  }, [title, url, fullTitle, description, keywords, image, fullUrl, type, author, publishedTime, modifiedTime, section, noindex, faq])

  return null
}
