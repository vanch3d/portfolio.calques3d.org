import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Lab',
    template: '%s · Lab · Nicolas Van Labeke',
  },
}

type LabLayoutProps = {
  children: React.ReactNode
}

// Lab layout is a pure wrapper — each section manages its own breadcrumb and
// section navigation within its own layout or page component.
export default function LabLayout({ children }: LabLayoutProps) {
  return <>{children}</>
}
