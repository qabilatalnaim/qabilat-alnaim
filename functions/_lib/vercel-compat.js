export async function runVercelHandler(context, handler) {
  const { request, env } = context

  const processObject = globalThis.process || { env: {} }
  processObject.env = processObject.env || {}

  for (const [key, value] of Object.entries(env || {})) {
    if (value !== undefined && value !== null) {
      processObject.env[key] = String(value)
    }
  }

  if (!processObject.env.NODE_ENV) {
    processObject.env.NODE_ENV = 'production'
  }

  globalThis.process = processObject
  const url = new URL(request.url)

  let body

  if (!['GET', 'HEAD'].includes(request.method)) {
    const contentType = request.headers.get('content-type') || ''

    if (contentType.includes('application/json')) {
      try {
        body = await request.json()
      } catch {
        body = undefined
      }
    }
  }

  const req = {
    method: request.method,
    body,
    query: Object.fromEntries(url.searchParams.entries()),
    headers: Object.fromEntries(request.headers.entries()),
  }

  let statusCode = 200
  const responseHeaders = new Headers()

  const res = {
    status(code) {
      statusCode = code
      return res
    },

    setHeader(name, value) {
      responseHeaders.set(
        name,
        Array.isArray(value) ? value.join(', ') : String(value)
      )
      return res
    },

    json(data) {
      if (!responseHeaders.has('Content-Type')) {
        responseHeaders.set(
          'Content-Type',
          'application/json; charset=utf-8'
        )
      }

      return new Response(JSON.stringify(data), {
        status: statusCode,
        headers: responseHeaders,
      })
    },

    end(data = null) {
      return new Response(data, {
        status: statusCode,
        headers: responseHeaders,
      })
    },
  }

  try {
    const result = await handler(req, res)

    if (result instanceof Response) {
      return result
    }

    return new Response(null, {
      status: statusCode,
      headers: responseHeaders,
    })
  } catch (error) {
    console.error('Cloudflare API error:', error)

    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      }
    )
  }
}

