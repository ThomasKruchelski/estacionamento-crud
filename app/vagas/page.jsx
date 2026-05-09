"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "veiculos-estacionamento";

export default function VagasPage() {
  const [placa, setPlaca] = useState("");
  const [vaga, setVaga] = useState("");
  const [horarioEntrada, sethorarioEntrada] = useState("");

  const [veiculos, setVeiculos] = useState([]);

  // Carregar do localStorage
  useEffect(() => {
    const dadosSalvos = localStorage.getItem(STORAGE_KEY);

    if (dadosSalvos) {
      setVeiculos(JSON.parse(dadosSalvos));
    }
  }, []);

  // Salvar no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(veiculos));
    console.log("veiculos");
    console.log(veiculos);
  }, [veiculos]);

  function adicionarVeiculo() {
    if (!placa || !vaga || !horarioEntrada) {
      alert("Preencha todos os campos");
      return;
    }

    const novoVeiculo = {
      id: crypto.randomUUID(),
      placa,
      vaga,
      horarioEntrada,
    };

    setVeiculos((estadoAtual) => [...estadoAtual, novoVeiculo]);

    setPlaca("");
    setVaga("");
    sethorarioEntrada("");
  }

  function removerVeiculo(id) {
    const novaLista = veiculos.filter((veiculo) => veiculo.id !== id);

    setVeiculos(novaLista);
  }

  return (
    <main className="p-8 w-full flex flex-col items-center justify-center">
      <h1 className="mb-6 text-3xl font-bold">Controle de Vagas</h1>

      <div className="mb-6 flex flex-col gap-3 max-w-md">
        <input
          type="text"
          placeholder="Placa"
          value={placa}
          onChange={(e) => setPlaca(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Vaga"
          value={vaga}
          onChange={(e) => setVaga(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="datetime-local"
          value={horarioEntrada}
          onChange={(e) => sethorarioEntrada(e.target.value)}
          className="border p-2 rounded"
        />

        <button
          onClick={adicionarVeiculo}
          className="bg-green-600 text-white p-2 rounded"
        >
          Registrar veículo
        </button>
      </div>

      <div className="space-y-4">
        {veiculos.map((veiculo) => (
          <div
            key={veiculo.id}
            className="border rounded p-4 flex justify-between items-center"
          >
            <div>
              <p>
                <strong>Placa:</strong> {veiculo.placa}
              </p>

              <p>
                <strong>Vaga:</strong> {veiculo.vaga}
              </p>

              <p>
                <strong>Entrada:</strong> {veiculo.horarioEntrada}
              </p>
            </div>

            <button
              onClick={() => removerVeiculo(veiculo.id)}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              DELETE
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
