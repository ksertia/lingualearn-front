function playTone(
  ctx: AudioContext,
  freq: number,
  startAt: number,
  duration: number,
  volume = 0.28,
) {
  const osc  = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.type = 'sine'
  osc.frequency.setValueAtTime(freq, startAt)
  gain.gain.setValueAtTime(volume, startAt)
  gain.gain.exponentialRampToValueAtTime(0.001, startAt + duration)
  osc.start(startAt)
  osc.stop(startAt + duration)
}

export function useNotificationSound() {
  // Two ascending tones — like a chat ping
  function playMessage() {
    try {
      const ctx = new AudioContext()
      playTone(ctx, 880,  ctx.currentTime,        0.18)
      playTone(ctx, 1320, ctx.currentTime + 0.14, 0.22)
    } catch {}
  }

  // Single soft bell — for system notifications
  function playNotification() {
    try {
      const ctx = new AudioContext()
      playTone(ctx, 1047, ctx.currentTime, 0.35, 0.22)
    } catch {}
  }

  return { playMessage, playNotification }
}
