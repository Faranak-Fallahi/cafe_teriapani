import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion'
import { CategoriesScreen } from './components/CategoriesScreen.jsx'
import { WelcomeScreen } from './components/WelcomeScreen.jsx'

function App() {
  const [screen, setScreen] = useState('welcome')
  const prefersReducedMotion = useReducedMotion()
  const enterMenu = useCallback(() => setScreen('categories'), [])

  useEffect(() => {
    if (screen !== 'welcome') return undefined

    const timeoutId = window.setTimeout(enterMenu, 1500)
    return () => window.clearTimeout(timeoutId)
  }, [screen, enterMenu])

  return (
    <main className="min-h-screen bg-stone-100 sm:flex sm:items-center sm:justify-center sm:px-5 sm:py-6">
      <section
        aria-label="منوی کافه تریاپانی"
        className="app-frame mx-auto flex h-[100svh] w-full max-w-md flex-col overflow-hidden bg-background sm:h-[min(900px,calc(100svh-3rem))] sm:rounded-3xl sm:shadow-xl sm:shadow-stone-900/10 sm:ring-1 sm:ring-stone-900/5"
      >
        <LayoutGroup id="trixapani-menu">
          <AnimatePresence initial={false} mode="sync">
            {screen === 'welcome' ? (
              <motion.div
                key="welcome"
                className="flex min-h-0 flex-1 flex-col"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: prefersReducedMotion ? 0.05 : 0.22 }}
              >
                <WelcomeScreen onEnter={enterMenu} prefersReducedMotion={prefersReducedMotion} />
              </motion.div>
            ) : (
              <motion.div
                key="categories"
                className="flex min-h-0 flex-1 flex-col"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: prefersReducedMotion ? 0.05 : 0.22 }}
              >
                <CategoriesScreen
                  onBack={() => setScreen('welcome')}
                  prefersReducedMotion={prefersReducedMotion}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </LayoutGroup>
      </section>
    </main>
  )
}

export default App
