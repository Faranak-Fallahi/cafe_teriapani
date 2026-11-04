import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { CategoriesScreen } from './components/CategoriesScreen.jsx'
import { WelcomeScreen } from './components/WelcomeScreen.jsx'
import { AppDataProvider } from './context/AppDataContext.jsx'
import { useAppData } from './hooks/useAppData.js'

function getAnchorPosition(frame, anchor) {
  const frameRect = frame.getBoundingClientRect()
  const anchorRect = anchor.getBoundingClientRect()

  return {
    x: anchorRect.left - frameRect.left,
    y: anchorRect.top - frameRect.top,
    width: anchorRect.width,
    height: anchorRect.height,
  }
}

function AppContent() {
  const { siteSettings } = useAppData()
  const [screen, setScreen] = useState('welcome')
  const [introPhase, setIntroPhase] = useState('holding')
  const [mascotBounds, setMascotBounds] = useState(null)
  const frameRef = useRef(null)
  const welcomeMascotRef = useRef(null)
  const headerMascotRef = useRef(null)
  const transitionTimerRef = useRef(null)
  const transitionStartedRef = useRef(false)
  const prefersReducedMotion = useReducedMotion()

  useLayoutEffect(() => {
    const frame = frameRef.current
    const welcomeAnchor = welcomeMascotRef.current
    const headerAnchor = headerMascotRef.current
    if (!frame || !welcomeAnchor || !headerAnchor) return

    const measure = () => {
      setMascotBounds({
        welcome: getAnchorPosition(frame, welcomeAnchor),
        header: getAnchorPosition(frame, headerAnchor),
      })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(frame)
    observer.observe(welcomeAnchor)
    observer.observe(headerAnchor)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  useEffect(() => {
    if (screen !== 'welcome' || prefersReducedMotion) return undefined
    const timerId = window.setTimeout(() => setIntroPhase('flight'), 3000)
    return () => window.clearTimeout(timerId)
  }, [screen, prefersReducedMotion])

  const startMenuTransition = useCallback(() => {
    if (transitionTimerRef.current !== null) {
      window.clearTimeout(transitionTimerRef.current)
      transitionTimerRef.current = null
    }
    if (transitionStartedRef.current) return

    transitionStartedRef.current = true
    setIntroPhase('flight')
    setScreen('transitioning')
  }, [])

  useEffect(() => {
    if (screen !== 'welcome' || transitionStartedRef.current) return undefined

    const timeoutId = window.setTimeout(startMenuTransition, 3000)
    transitionTimerRef.current = timeoutId
    return () => {
      window.clearTimeout(timeoutId)
      if (transitionTimerRef.current === timeoutId) transitionTimerRef.current = null
    }
  }, [screen, startMenuTransition, prefersReducedMotion])

  const returnToWelcome = useCallback(() => {
    if (screen !== 'menu') return
    setScreen('returning')
  }, [screen])

  const handleMascotAnimationComplete = useCallback(() => {
    if (screen === 'transitioning') {
      setScreen('menu')
    } else if (screen === 'returning') {
      transitionStartedRef.current = false
      setScreen('welcome')
    }
  }, [screen])

  const isWelcomeVisible = screen === 'welcome' || screen === 'transitioning'
  const isMenuVisible = screen === 'menu' || screen === 'returning'
  const mascotDestination = screen === 'transitioning' || screen === 'menu'
    ? mascotBounds?.header
    : mascotBounds?.welcome

  return (
    <main className="min-h-screen bg-stone-100 sm:flex sm:items-center sm:justify-center sm:px-5 sm:py-6">
      <section
        ref={frameRef}
        aria-label="منوی کافه تریاپانی"
        className="app-frame mx-auto flex h-[100svh] w-full max-w-md flex-col overflow-hidden bg-background sm:h-[min(900px,calc(100svh-3rem))] sm:rounded-3xl sm:shadow-xl sm:shadow-stone-900/10 sm:ring-1 sm:ring-stone-900/5"
      >
        <div className={`app-layer ${isWelcomeVisible ? 'app-layer--active' : 'app-layer--inactive'}`} aria-hidden={!isWelcomeVisible}>
          <WelcomeScreen
            onEnter={startMenuTransition}
            prefersReducedMotion={prefersReducedMotion}
            doodlesActive={screen === 'welcome'}
            mascotAnchorRef={welcomeMascotRef}
            siteSettings={siteSettings}
          />
        </div>
        <div className={`app-layer ${isMenuVisible ? 'app-layer--active' : 'app-layer--inactive'}`} aria-hidden={!isMenuVisible}>
          <CategoriesScreen onBack={returnToWelcome} mascotAnchorRef={headerMascotRef} mascotVisible={screen === 'menu'} />
        </div>

        {mascotBounds && (screen === 'welcome' || screen === 'transitioning' || screen === 'returning') && (
          <motion.img
            src="/assets/mascot.webp"
            alt="مسکات لبخندزن تریاپانی با لباس نارنجی"
            className="mascot-flight"
            initial={mascotBounds.welcome}
            animate={screen === 'welcome' && introPhase === 'holding' ? mascotBounds.welcome : mascotDestination}
            transition={
              screen === 'welcome' && introPhase === 'holding'
                ? { duration: 0 }
                : prefersReducedMotion
                  ? { duration: 0.01 }
                  : { type: 'spring', stiffness: 150, damping: 23, mass: 0.85 }
            }
            onAnimationComplete={screen === 'transitioning' || screen === 'returning' ? handleMascotAnimationComplete : undefined}
          />
        )}
      </section>
    </main>
  )
}

export default function App() {
  return <AppDataProvider><AppContent /></AppDataProvider>
}
