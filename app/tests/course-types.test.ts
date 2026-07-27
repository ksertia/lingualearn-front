import { describe, it, expect } from 'vitest'
import type { LessonBlock } from '../types/course'

describe('lesson block typing', () => {
  it('supports ordered lesson blocks with explicit section and content types', () => {
    const blocks = [
      { order: 1, sectionType: 'introduction', contentType: 'text', content: 'Bonjour' },
      { order: 2, sectionType: 'main', contentType: 'video', content: '/uploads/video/demo.mp4' },
      { order: 3, sectionType: 'example_audio', contentType: 'audio', content: '/uploads/audio/demo.mp3' },
    ] satisfies LessonBlock[]

    expect(blocks).toHaveLength(3)
    expect(blocks[0].sectionType).toBe('introduction')
    expect(blocks[1].contentType).toBe('video')
  })
})
