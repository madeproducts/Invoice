"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Download, Share, PlusSquare } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function InstallPrompt() {
  const [isStandalone, setIsStandalone] = useState(true)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    
    // Check if app is already installed/running in standalone mode
    const checkStandalone = () => {
      const isStandaloneMode = 
        window.matchMedia("(display-mode: standalone)").matches || 
        (window.navigator as any).standalone || 
        document.referrer.includes("android-app://");
      
      setIsStandalone(isStandaloneMode)
    }

    checkStandalone()

    // Detect iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    setIsIOS(ios)

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    // Listen for display mode changes (e.g., when the app is installed and opened)
    const mediaQuery = window.matchMedia("(display-mode: standalone)")
    const handleChange = (e: MediaQueryListEvent) => {
      setIsStandalone(e.matches)
    }
    
    mediaQuery.addEventListener("change", handleChange)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      mediaQuery.removeEventListener("change", handleChange)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      setShowInstructions(true)
      return
    }

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === "accepted") {
      setDeferredPrompt(null)
    }
  }

  // Prevent hydration mismatch by returning null until mounted
  if (!isMounted || isStandalone) {
    return null
  }

  return (
    <>
      <Button 
        onClick={handleInstallClick}
        variant="outline"
        className="flex items-center gap-2"
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">Install App</span>
        <span className="sm:hidden">Install</span>
      </Button>

      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent className="sm:max-w-md w-[90%] rounded-lg">
          <DialogHeader>
            <DialogTitle>Install Application</DialogTitle>
            <DialogDescription className="text-left">
              {isIOS ? (
                <div className="flex flex-col gap-4 mt-4 text-slate-700 dark:text-slate-300">
                  <p>To install this app on your iOS device:</p>
                  <ol className="space-y-4">
                    <li className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-medium">1</span>
                      <span className="flex items-center gap-2">Tap the <Share className="w-4 h-4" /> Share button</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-medium">2</span>
                      <span className="flex items-center gap-2">Select <PlusSquare className="w-4 h-4" /> <strong>Add to Home Screen</strong></span>
                    </li>
                  </ol>
                </div>
              ) : (
                <div className="mt-4 text-slate-700 dark:text-slate-300 space-y-2">
                  <p>
                    Automatic installation is not supported by your current browser, or the prompt was dismissed. 
                  </p>
                  <p>
                    Please look for the <strong>Install</strong> icon in your address bar, or open your browser menu and select <strong>Install app</strong> or <strong>Add to Home Screen</strong>.
                  </p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setShowInstructions(false)}>Got it</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
