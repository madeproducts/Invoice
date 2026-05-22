import OrderForm from "@/components/order-form"
import { InstallPrompt } from "@/components/install-prompt"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col p-4 md:p-8 lg:p-24 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-5xl mx-auto flex-grow w-full">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center sm:text-left flex-grow">MadeProducts Invoice Generator</h1>
          <div className="shrink-0">
            <InstallPrompt />
          </div>
        </div>
        <OrderForm />
      </div>
      <footer className="mt-8 text-center text-slate-500 text-sm">
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <a
            href="https://github.com/abhinhere"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-800 transition-colors underline underline-offset-2"
          >
            abhin-madewebs
          </a>
          . All rights reserved.
        </p>
      </footer>
    </main>
  )
}
