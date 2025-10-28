export default function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="container py-8 flex items-center justify-between text-sm text-white/60">
        <p>© {new Date().getFullYear()} LYN AutoSales</p>
        <p>Panama City, FL</p>
      </div>
    </footer>
  );
}
