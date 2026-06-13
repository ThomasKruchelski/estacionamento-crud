"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [veiculos, setVeiculos] = useState<any[]>([]);
  const [carregado, setCarregado] = useState(false);

  const todasVagas = ["01", "02", "03", "04", "05", "06", "07", "08"];

  useEffect(() => {
    async function carregarVeiculos() {
      try {
        // Agora fazemos a requisição para a nossa própria API, escondendo o Firebase do cliente
        const response = await fetch("/api/veiculos");
        
        if (!response.ok) {
          throw new Error("Falha na requisição");
        }

        const data = await response.json();
        setVeiculos(data);
      } catch (error) {
        console.error("Erro ao buscar veículos:", error);
      } finally {
        setCarregado(true);
      }
    }

    carregarVeiculos();
  }, []);

  return (
    <main className="p-8 w-full flex gap-12 items-center justify-center flex-1">
      <div className="flex itens-center flex-col justify-center items-center flex-1">
        <h1 className="text-3xl font-bold text-center">Sistema de Estacionamento</h1>

        <Link
          href="/vagas"
          className="mt-4 inline-block rounded bg-blue-600 hover:bg-blue-500 px-4 py-2 text-white max-w-[350px] text-center"
        >
          Ir para controle de vagas
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-4">Vagas disponíveis</h1>
        <div className="border border-white p-4 flex-1 flex w-full flex-wrap justify-center">
          {!carregado ? (
            <h1>Carregando...</h1>
          ) : (
            todasVagas.map((vaga) => {
              const vagaOcupada = veiculos.find(
                (veiculo) =>
                  Number(veiculo.vaga) === Number(vaga) &&
                  veiculo.horarioSaida === ""
              );

              // Renderização limpa: se ocupada exibe vermelho com placa, se não, exibe verde.
              return (
                <div
                  key={vaga}
                  className={`m-4 w-1/5 flex items-center justify-center flex-col p-4 border rounded ${
                    vagaOcupada !== undefined
                      ? "border-red-500 bg-red-500/10"
                      : "border-green-500 bg-green-500/10"
                  }`}
                >
                  <h1 className="font-bold text-xl mb-2">Vaga {vaga}</h1>
                  <div>
                    {vagaOcupada !== undefined ? (
                      <p className="font-medium">Veículo: {vagaOcupada.placa}</p>
                    ) : (
                      <p className="text-sm italic opacity-70">Livre</p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}