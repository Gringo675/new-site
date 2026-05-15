function serializeNode(node) {
  if (!node) return 'null'

  if (node.nodeType === Node.COMMENT_NODE) {
    return {
      type: 'comment',
      content: node.textContent?.slice(0, 100),
    }
  }

  if (node instanceof Element) {
    return {
      type: 'element',
      tag: node.tagName,
      id: node.id,
      className: node.className,
      text: node.innerText?.slice(0, 100),
      outerHTML: node.outerHTML?.slice(0, 500),
    }
  }

  return {
    type: 'other',
    nodeType: node.nodeType,
    nodeName: node.nodeName,
  }
}

export default defineNuxtPlugin(() => {
  // console.log(`dom-patch plugin activated`)
  // This plugin must only run on the client
  if (import.meta.server) return

  const originalInsertBefore = Node.prototype.insertBefore

  Node.prototype.insertBefore = function (newNode, referenceNode) {
    try {
      // const parentS = serializeNode(this)
      // const newNodeS = serializeNode(newNode)
      // const referenceNodeS = serializeNode(referenceNode)

      // console.log(`parent: ${JSON.stringify(parentS, null, 2)}`)
      // console.log(`newNode: ${JSON.stringify(newNodeS, null, 2)}`)
      // console.log(`referenceNode: ${JSON.stringify(referenceNodeS, null, 2)}`)

      return originalInsertBefore.apply(this, arguments)
    } catch (e) {
      // We only care about the specific NotFoundError related to insertBefore
      if (e instanceof Error && e.name === 'NotFoundError' && e.message.includes('insertBefore')) {
        const context = {
          grandParent: serializeNode(this.parentNode),
          parent: serializeNode(this),
          newNode: serializeNode(newNode),
          referenceNode: serializeNode(referenceNode),
          timestamp: new Date().toISOString(),
          url: window.location.href,
        }

        // Store in window for app/error.vue to pick up
        window.__VUE_INSERT_ERROR_CONTEXT__ = context

        console.error('[DOM Patch] Captured insertBefore failure context:', context)
      }
      // Always re-throw the error so Vue's error handling and app/error.vue still work
      throw e
    }
  }
})
