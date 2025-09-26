import { getAssetFromKV } from '@cloudflare/kv-asset-handler'

export default {
  async fetch(request, env, ctx) {
    try {
      return await getAssetFromKV(
        { request, waitUntil: ctx.waitUntil },
        { ASSET_NAMESPACE: env.__STATIC_CONTENT, ASSET_MANIFEST: env.__STATIC_CONTENT_MANIFEST }
      )
    } catch (e) {
      // fallback to index.html for SPA routes
      return getAssetFromKV(
        { request: new Request(`${new URL(request.url).origin}/index.html`, request), waitUntil: ctx.waitUntil },
        { ASSET_NAMESPACE: env.__STATIC_CONTENT, ASSET_MANIFEST: env.__STATIC_CONTENT_MANIFEST }
      )
    }
  },
}