import { ArrowRight, Camera, Coffee } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { storyChapters } from '../data/storyChapters.js'

export function OurStoryView({ onBack, mascotAnchorRef }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className="our-story-screen flex min-h-0 flex-1 flex-col">
      <header className="story-header">
        <button type="button" className="story-back-button" onClick={onBack} aria-label="بازگشت به دسته‌بندی‌ها">
          <ArrowRight size={23} aria-hidden="true" />
        </button>
        <div className="story-heading">
          <h1><Coffee size={25} aria-hidden="true" /> قصه‌ی تریاپانی</h1>
          <p>سه فصل، یک خاطره‌ی مشترک</p>
          <span aria-hidden="true" />
        </div>
        <aside className="header-mascot" aria-label="مسکات تریاپانی">
          <div className="header-speech">یه قصه‌ی گرم از تریاپانی!</div>
          <div ref={mascotAnchorRef} className="header-mascot-anchor h-14 w-14" aria-hidden="true" />
        </aside>
      </header>

      <main className="story-scroll min-h-0 flex-1 overflow-y-auto" aria-label="داستان کافه‌ی تریاپانی">
        <div className="story-timeline">
          {storyChapters.map((chapter, index) => (
            <motion.article
              key={chapter.id}
              className="story-chapter"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0.01 : 0.28, delay: prefersReducedMotion ? 0 : index * 0.08 }}
            >
              <div className="story-photo-frame" role="img" aria-label={chapter.photoLabel}>
                <div className="story-photo-placeholder" aria-hidden="true">
                  <Camera size={27} strokeWidth={1.6} />
                  <span>جای عکس خاطره</span>
                </div>
                <span className="story-photo-tape" aria-hidden="true" />
              </div>

              <div className="story-chapter-copy">
                <span className="story-chapter-marker" aria-hidden="true">{chapter.chapter}</span>
                <h2>{chapter.title}</h2>
                <p>{chapter.description}</p>
                <img src="/assets/mascot.webp" alt="مسکات خندان تریاپانی" className="story-mascot-sticker" />
              </div>
            </motion.article>
          ))}
        </div>

        <section className="story-ending" aria-label="پایان داستان">
          <img src="/assets/mascot.webp" alt="مسکات تریاپانی همراه قصه‌ی کافه" />
          <div className="story-ending-copy">
            <p>تو هم از تریاپانی خاطره داری؟ <span aria-hidden="true">💛</span></p>
            <button type="button" onClick={onBack}>
              برگشت به منو
              <ArrowRight size={19} aria-hidden="true" />
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}
