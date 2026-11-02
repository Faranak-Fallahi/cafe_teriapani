import { ArrowRight, Camera, Coffee } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { useAppData } from '../hooks/useAppData.js'
import { BackButton } from './BackButton.jsx'

export function OurStoryView({ onBack, mascotAnchorRef, mascotInteractionProps }) {
  const prefersReducedMotion = useReducedMotion()
  const { story } = useAppData()

  return (
    <div className="our-story-screen flex min-h-0 flex-1 flex-col">
      <header className="story-header">
        <BackButton className="story-back-button" onClick={onBack} label="بازگشت به دسته‌بندی‌ها" />
        <div className="story-heading">
          <h1><Coffee size={25} aria-hidden="true" /> قصه‌ی تریاپانی</h1>
          <p>سه فصل، یک خاطره‌ی مشترک</p>
          <span aria-hidden="true" />
        </div>
        <aside className="header-mascot" aria-label="مسکات تریاپانی">
          <div className="header-speech">یه قصه‌ی گرم از تریاپانی!</div>
          <button ref={mascotAnchorRef} type="button" className="header-mascot-anchor h-14 w-14" aria-label="برای فعال‌کردن ورود مدیر، مسکات را نگه دارید" {...mascotInteractionProps} />
        </aside>
      </header>

      <main className="story-scroll min-h-0 flex-1 overflow-y-auto" aria-label="داستان کافه‌ی تریاپانی">
        <div className="story-timeline">
          {story.map((chapter, index) => (
            <motion.article
              key={chapter.id}
              className="story-chapter"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0.01 : 0.28, delay: prefersReducedMotion ? 0 : index * 0.08 }}
            >
              <div className="story-photo-frame" role="img" aria-label={chapter.photoLabel}>
                {chapter.image ? <img src={chapter.image} alt={chapter.photoLabel || chapter.title} style={{ width: '100%', height: '100%', borderRadius: '0.75rem', objectFit: 'cover' }} /> : (
                  <div className="story-photo-placeholder" aria-hidden="true">
                    <Camera size={27} strokeWidth={1.6} />
                    <span>{chapter.photoLabel || 'جای عکس خاطره'}</span>
                  </div>
                )}
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
