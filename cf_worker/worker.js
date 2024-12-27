const CACHE_TTL = 86400; // Cache for 1 day (in seconds)

export default {
  async fetch(request, env, event) {
    if (request.method === 'OPTIONS') {
      // Handle preflight requests
      return handleOptions();
    }

    if (request.method === 'POST') {
      return handlePost(request, env, event);
    }

    return addCorsHeaders(new Response("Invalid Request", { status: 400 }));
  }
}

// Handle POST requests and summarize content
async function handlePost(request, env, event) {
  try {
    const { url } = await request.json();
    const allowedDomain = "arunsr.in";
    const parsedUrl = new URL(url);

    // Validate the URL domain
    if (parsedUrl.hostname !== allowedDomain && !parsedUrl.hostname.endsWith(`.${allowedDomain}`)) {
      return addCorsHeaders(new Response("Unauthorized domain", { status: 403 }));
    }

    const cacheKey = new Request(url);
    const cache = caches.default;

    let cachedResponse = await cache.match(cacheKey);
    if (cachedResponse) {
      return addCorsHeaders(cachedResponse);
    }

    const pageResponse = await fetch(url);
    const pageText = await pageResponse.text();

    const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.OPENAPI_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Summarize the following HTML document, and focus on summarizing the content not the styling, navigation, footer or layout. Say 'This page' instead of 'This html document'. Focus on content with a heart emoji, if present. The response should not have markup like asterisks. I'm the author of all content you are summarizing, so you can refer to me, the author as 'Arun'." },
          { role: "user", content: pageText }
        ],
        max_tokens: 150
      })
    });

    const result = await aiResponse.json();
    const summary = result.choices[0].message.content;

    const response = new Response(JSON.stringify({ summary }), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": `s-maxage=${CACHE_TTL}, public`
      }
    });

    // Store in cache
    event.waitUntil(cache.put(cacheKey, response.clone()));

    return addCorsHeaders(response);
  } catch (error) {
    return addCorsHeaders(new Response("Failed to fetch or summarize content", { status: 500 }));
  }
}

// Handle OPTIONS preflight requests
function handleOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "https://www.arunsr.in",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}

// Attach CORS headers to all responses
function addCorsHeaders(response) {
  const newHeaders = new Headers(response.headers);
  newHeaders.set("Access-Control-Allow-Origin", "https://www.arunsr.in");
  newHeaders.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  newHeaders.set("Access-Control-Allow-Headers", "Content-Type");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  });
}

