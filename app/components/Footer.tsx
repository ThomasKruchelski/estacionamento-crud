export function Footer() {
  return (
    <footer className=" bg-gray-900">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 md:flex-row">
        <p className="text-sm text-gray-50">
          © 2026 Pucpr. Todos os direitos reservados.
        </p>

        <div className="flex gap-6 text-sm text-gray-50">
          <a href="#">Privacidade</a>
          <a href="#">Termos</a>
          <a href="#">Suporte</a>
        </div>
      </div>
    </footer>
  );
}
