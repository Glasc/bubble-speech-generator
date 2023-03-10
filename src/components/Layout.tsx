import type { ReactNode } from "react"

type LayoutProps = {
  children: ReactNode
  Alerts: JSX.Element | null
}

export const Layout = ({ children, Alerts = null }: LayoutProps) => {
  return (
    <>
      {children}
      {Alerts}
    </>
  )
}
