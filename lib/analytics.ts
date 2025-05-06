// Google Analytics 4 implementation

declare global {
  interface Window {
    gtag: (...args: any[]) => void
    scrollTracked25: boolean
    scrollTracked50: boolean
    scrollTracked75: boolean
    scrollTracked90: boolean
  }
}

export function trackEvent(eventName: string, properties?: Record<string, any>) {
  console.log(`[Analytics] Tracking event: ${eventName}`, properties || {})

  // Google Analytics 4 tracking
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, properties)
  }
}

// Initialize analytics
export function initAnalytics(measurementId: string) {
  console.log("[Analytics] Initializing Google Analytics 4", { measurementId })

  // Load the Google Analytics script
  const script = document.createElement("script")
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  script.async = true
  document.head.appendChild(script)

  // Initialize gtag
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    window.dataLayer.push(arguments)
  }
  window.gtag("js", new Date())
  window.gtag("config", measurementId)
}
