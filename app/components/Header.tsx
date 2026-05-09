import Link from "next/link";

export function Header() {
  return (
    <header className="w-full border-b bg-gray-900">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          ParkFlow
        </Link>

        <nav className="hidden gap-6 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-gray-50 hover:text-blue-600"
          >
            Home
          </Link>

          <Link
            href="/vagas"
            className="text-sm font-medium text-gray-50 hover:text-blue-600"
          >
            Vagas
          </Link>
        </nav>

        <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          Entrar
        </button>
      </div>
    </header>
  );
}
