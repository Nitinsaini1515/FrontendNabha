"use client"

import { Fragment, useEffect } from "react"
import "../lib/i18n"

export default function I18nProvider({ children }) {
  // Ensure i18n is initialized immediately on the client before children render
  useEffect(() => {
    // No-op; the side-effectful import above guarantees initialization
  }, [])

  return <Fragment>{children}</Fragment>
}
