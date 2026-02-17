import { Hero } from '@/components/landing/hero';
import { Features } from '@/components/landing/features';
import { Pricing } from '@/components/landing/pricing';
import { Footer } from '@/components/landing/footer';

export default function Home() {
  return (
    <main className="bg-white dark:bg-zinc-900 scroll-smooth">
      {/* Navigation could go here */}
      <nav className="absolute top-0 z-50 w-full p-6 flex justify-between items-center max-w-7xl mx-auto left-0 right-0">
        <div className="font-bold text-2xl tracking-tighter text-indigo-600 dark:text-indigo-400">SnapCut AI</div>
        <div className="flex gap-4">
          <a href="/login" className="text-sm font-semibold leading-6 text-gray-900 dark:text-white px-4 py-2">Log in</a>
          <a href="/register" className="text-sm font-semibold leading-6 text-white bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-500">Sign up</a>
        </div>
      </nav>

      <Hero />
      <Features />
      <Pricing />
      <Footer />

      {/* Placeholder for other sections */}
      <div id="features" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Deploy faster</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Everything you need to scale your SaaS
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              More features coming soon...
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
