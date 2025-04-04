export default function DropdownLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex center max-w-4xl mx-auto my-5">
      {children}
    </div>
  )
}
