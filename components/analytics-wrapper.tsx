"use client"

import { type ReactNode, useEffect } from "react"
import { trackEvent } from "@/lib/analytics"

interface AnalyticsWrapperProps {
  children: ReactNode
  pageEvent: string
}

export default function AnalyticsWrapper({ children, pageEvent }: AnalyticsWrapperProps) {
  useEffect(() => {
    // Track page view
    trackEvent(pageEvent)

    // Track page load
    const onLoad = () => {
      trackEvent("페이지_로드_완료")
    }

    // Track scroll depth
    const onScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.body.offsetHeight
      const winHeight = window.innerHeight
      const scrollPercent = scrollTop / (docHeight - winHeight)

      if (scrollPercent > 0.25 && !window.scrollTracked25) {
        window.scrollTracked25 = true
        trackEvent("페이지_스크롤_깊이", { 깊이: "25%" })
      }

      if (scrollPercent > 0.5 && !window.scrollTracked50) {
        window.scrollTracked50 = true
        trackEvent("페이지_스크롤_깊이", { 깊이: "50%" })
      }

      if (scrollPercent > 0.75 && !window.scrollTracked75) {
        window.scrollTracked75 = true
        trackEvent("페이지_스크롤_깊이", { 깊이: "75%" })
      }

      if (scrollPercent > 0.9 && !window.scrollTracked90) {
        window.scrollTracked90 = true
        trackEvent("페이지_스크롤_깊이", { 깊이: "90%" })
      }
    }

    window.addEventListener("load", onLoad)
    window.addEventListener("scroll", onScroll)

    // Cleanup
    return () => {
      window.removeEventListener("load", onLoad)
      window.removeEventListener("scroll", onScroll)
    }
  }, [pageEvent])

  return <>{children}</>
}
