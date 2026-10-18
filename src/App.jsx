import { Coffee, MapPin, Menu, Search } from 'lucide-react'

function App() {
  return (
    <main className="min-h-screen bg-stone-100 px-4 py-6 sm:py-10">
      <section
        aria-label="منوی کافه تریاپانی"
        className="mx-auto flex min-h-[calc(100svh-3rem)] w-full max-w-md flex-col overflow-hidden rounded-3xl bg-background shadow-xl shadow-stone-900/10 ring-1 ring-stone-900/5 sm:min-h-[min(52rem,calc(100svh-5rem))]"
      >
        <header className="flex items-center justify-between border-b border-dark/10 px-5 py-4">
          <button aria-label="باز کردن منو" className="rounded-full p-2 text-dark hover:bg-dark/5">
            <Menu size={21} />
          </button>
          <div className="text-center">
            <p className="text-xs font-medium tracking-wide text-dark/60">کافه</p>
            <h1 className="text-xl font-extrabold text-dark">تریاپانی</h1>
          </div>
          <button aria-label="جستجو" className="rounded-full p-2 text-dark hover:bg-dark/5">
            <Search size={21} />
          </button>
        </header>

        <div className="flex flex-1 flex-col px-5 pb-6 pt-7">
          <div className="rounded-3xl bg-primary px-5 py-6 text-white">
            <p className="mb-2 text-sm font-medium text-white/85">طعم خوب، حال خوب</p>
            <h2 className="text-2xl font-extrabold leading-relaxed">به تریاپانی خوش آمدید</h2>
            <p className="mt-1 text-sm text-white/85">منوی کافه در مرودشت</p>
            <div className="mt-5 flex items-center gap-2 text-sm font-semibold">
              <Coffee size={18} />
              <span>یک فنجان حال خوب</span>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2 rounded-2xl bg-white/75 px-4 py-3 text-sm text-dark/65 ring-1 ring-dark/5">
            <MapPin size={17} className="shrink-0 text-sage" />
            <span>مرودشت، فارس</span>
          </div>

          <div className="mt-auto pt-8 text-center">
            <p className="text-sm font-semibold text-dark">منوی ما به‌زودی آماده است</p>
            <p className="mt-1 text-xs text-dark/55">برای دیدن نوشیدنی‌ها و خوراکی‌ها همراه‌مان باشید</p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
