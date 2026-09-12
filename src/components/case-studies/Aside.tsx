interface AsideProps {
  children: React.ReactNode
}

export function Aside({ children }: AsideProps) {
  return (
    <aside>
      {children}
    </aside>
  )
}
