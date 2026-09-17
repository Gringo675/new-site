export function playNotificationSound() {
  if (typeof window === 'undefined') return

  try {
    const AudioContextClass = window.AudioContext || window['webkitAudioContext']
    if (!AudioContextClass) return

    const ctx = new AudioContextClass()

    if (ctx.state === 'suspended') {
      ctx.resume()
    }

    const now = ctx.currentTime

    // First tone (E5 - 659.25Hz)
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(659.25, now)
    gain1.gain.setValueAtTime(0.24, now)
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.35)
    osc1.connect(gain1)
    gain1.connect(ctx.destination)
    osc1.start(now)
    osc1.stop(now + 0.35)

    // Second tone (B5 - 987.77Hz)
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(987.77, now + 0.12)
    gain2.gain.setValueAtTime(0.30, now + 0.12)
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.55)
    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.start(now + 0.12)
    osc2.stop(now + 0.55)
  } catch (e) {
    console.warn('Could not play notification sound:', e)
  }
}
