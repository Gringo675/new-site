// console.log(`from custom js`)
const TITLE_TARGET_SELECTOR = '#workbench\\.parts\\.auxiliarybar h2'
const TABS_TARGET_SELECTOR =
  '#workbench\\.parts\\.auxiliarybar .monaco-split-view2.horizontal .split-view-view.visible:has(.tabs-container)'
const TERMINAL_TARGET_SELECTOR =
  '#workbench\\.parts\\.auxiliarybar .monaco-split-view2.horizontal .split-view-view.visible:has(.terminal-outer-container)'

let attemptCount = 0
const maxAttempts = 10

// 1. This function handles the actual logic
function initializeCustomTitle(element) {
  console.log('Target element found! Attaching direct listener...')

  element.addEventListener('click', () => {
    const terminal = document.querySelector(TERMINAL_TARGET_SELECTOR)
    if (terminal) {
      // console.log('Terminal found! Set style:"left: 0, width: 100%"')
      terminal.style.left = '0'
      terminal.style.width = '100%'
    }
  })
}

// 2. Create the observer to watch for the element's appearance
const observer = new MutationObserver((mutations, obs) => {
  // console.log(`from observer`)
  const element = document.querySelector(TITLE_TARGET_SELECTOR)

  if (element) {
    initializeCustomTitle(element)
    obs.disconnect()
  }
  if (++attemptCount === maxAttempts) obs.disconnect()
})

// 3. Start observing the document body for changes in the child tree
observer.observe(document.body, {
  childList: true,
  subtree: true,
})
