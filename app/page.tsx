import Link from "next/link";

export default function Home() {
  return (
    <main className="p-8 w-full flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">Sistema de Estacionamento</h1>

      <Link
        href="/vagas"
        className="mt-4 inline-block rounded bg-blue-600 px-4 py-2 text-white"
      >
        Ir para controle de vagas
      </Link>
    </main>
  );
}
