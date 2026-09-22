// /api/subscribe.js
// Newsletter subscription endpoint — stores in Vercel KV / KV-rest compatible storage
// Falls back to logging (dev mode) if no storage configured.

// Simple in-memory fallback (resets on cold start, fine for dev)
const memoryStore = new Set()

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email } = req.body || {}

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'بريد إلكتروني غير صحيح' })
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'صيغة البريد الإلكتروني غير صحيحة' })
  }

  try {
    const KV_URL = process.env.KV_REST_API_URL
    const KV_TOKEN = process.env.KV_REST_API_TOKEN

    if (KV_URL && KV_TOKEN) {
      // Production: store in Vercel KV
      const listKey = 'newsletter:subscribers'
      await fetch(`${KV_URL}/sadd/${listKey}/${encodeURIComponent(email)}`, {
        headers: { Authorization: `Bearer ${KV_TOKEN}` },
      })
    } else {
      // Dev: in-memory
      memoryStore.add(email)
      console.log(`[Newsletter] New subscriber: ${email} (total: ${memoryStore.size})`)
    }

    return res.status(200).json({
      message: 'تم الاشتراك بنجاح! سنتواصل معك قريباً بأحدث الفيديوهات والمقالات التراثية.',
      subscriberCount: memoryStore.size,
    })
  } catch (err) {
    console.error('Subscribe error:', err)
    return res.status(500).json({ error: 'خطأ في الخادم، حاول لاحقاً' })
  }
}
