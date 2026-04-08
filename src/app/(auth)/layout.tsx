export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center"
      style={{
        backgroundImage: 'url(/hero-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center 20%',
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-black/80" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 to-black/90" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_0%,rgba(252,76,2,0.10)_0%,transparent_70%)]" />
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
