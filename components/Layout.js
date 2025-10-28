import Header from './Header';

export default function Layout({ children, user }){
  return (
    <>
      <Header user={user} />
      <main>{children}</main>
      <footer className="border-t border-brand-line mt-10">
        <div className="container h-16 flex items-center justify-between text-sm text-gray-400">
          <span>© {new Date().getFullYear()} LYN AutoSales</span>
          <div className="flex gap-4">
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
          </div>
        </div>
      </footer>
    </>
  );
}
