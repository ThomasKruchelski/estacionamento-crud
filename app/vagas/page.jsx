"use client";

import { useEffect, useState } from "react";

export default function VagasPage() {
  const [cliente, setCliente] = useState("");
  const [cpf, setCpf] = useState("");
  const [placa, setPlaca] = useState("");
  const [vaga, setVaga] = useState("");
  const [horarioEntrada, sethorarioEntrada] = useState("");
  const [horarioSaida, sethorarioSaida] = useState("");

  const [carregado, setCarregado] = useState(false);
  const [veiculos, setVeiculos] = useState([]);

  const todasVagas = ["01", "02", "03", "04", "05", "06", "07", "08"];
  const [vagasDisponiveis, setVagasDisponiveis] = useState([]);

  const [editandoId, setEditandoId] = useState(null);
  const [dadosEdicao, setDadosEdicao] = useState({
    placa: "",
    vaga: "",
    horarioEntrada: "",
    cpf: "",
    cliente: "",
    horarioSaida: "",
  });

  // Carregar veículos através da API interna
  useEffect(() => {
    async function carregarVeiculos() {
      try {
        const response = await fetch("/api/veiculos");
        if (!response.ok) throw new Error("Erro ao buscar dados do servidor");
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

  // Monitorar vagas ocupadas/disponíveis
  useEffect(() => {
    const vagasOcupadas = veiculos.map((veiculo) =>
      veiculo.horarioSaida !== "" ? null : veiculo.vaga
    );

    const vagasNaoOcupadas = todasVagas.filter(
      (numeroDaVaga) => !vagasOcupadas.includes(numeroDaVaga)
    );
    setVagasDisponiveis(vagasNaoOcupadas);
  }, [veiculos, dadosEdicao]);

  // CREATE (POST)
  async function adicionarVeiculo() {
    if (!placa || !vaga || !horarioEntrada || !cpf || !cliente) {
      alert("Preencha todos os campos");
      return;
    }

    const novoVeiculo = {
      placa,
      vaga,
      horarioEntrada,
      cpf,
      cliente,
      horarioSaida: horarioSaida || "",
    };

    try {
      const response = await fetch("/api/veiculos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoVeiculo),
      });

      if (!response.ok) throw new Error();

      const veiculoSalvo = await response.json();

      setVeiculos((estadoAtual) => [...estadoAtual, veiculoSalvo]);

      // Limpar campos
      setPlaca("");
      setVaga("");
      sethorarioEntrada("");
      setCliente("");
      setCpf("");
      sethorarioSaida("");
    } catch (error) {
      alert("Erro ao salvar no banco de dados através da API.");
    }
  }

  // DELETE
  async function removerVeiculo(id) {
    try {
      const response = await fetch(`/api/veiculos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error();

      setVeiculos(veiculos.filter((veiculo) => veiculo.id !== id));
    } catch (error) {
      alert("Erro ao deletar veículo.");
    }
  }

  // UPDATE - Iniciar modo de edição
  function iniciarEdicao(veiculo) {
    setEditandoId(veiculo.id);
    setDadosEdicao({
      placa: veiculo.placa,
      vaga: veiculo.vaga,
      horarioEntrada: veiculo.horarioEntrada,
      cpf: veiculo.cpf,
      cliente: veiculo.cliente,
      horarioSaida: veiculo.horarioSaida,
    });
  }

  function cancelarEdicao() {
    setEditandoId(null);
  }

  // UPDATE - Registrar Saída (PUT)
  async function registrarSaida(id) {
    const getDataSaida = new Date();
    const dataSaida = getDataSaida
      .toString()
      .replace(" GMT-0300 (Horário Padrão de Brasília)", "");

    try {
      const response = await fetch(`/api/veiculos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ horarioSaida: dataSaida }),
      });

      if (!response.ok) throw new Error();

      setVeiculos(
        veiculos.map((v) => (v.id === id ? { ...v, horarioSaida: dataSaida } : v))
      );
    } catch (error) {
      alert("Erro ao registrar saída.");
    }
  }

  // UPDATE - Salvar Edição Completa (PUT)
  async function salvarEdicao() {
    if (
      !dadosEdicao.placa ||
      !dadosEdicao.vaga ||
      !dadosEdicao.horarioEntrada ||
      !dadosEdicao.cpf ||
      !dadosEdicao.cliente
    ) {
      alert("Nenhum campo pode ficar vazio na edição.");
      return;
    }

    try {
      const response = await fetch(`/api/veiculos/${editandoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosEdicao),
      });

      if (!response.ok) throw new Error();

      setVeiculos(
        veiculos.map((v) => (v.id === editandoId ? { ...v, ...dadosEdicao } : v))
      );
      setEditandoId(null);
    } catch (error) {
      alert("Erro ao atualizar os dados.");
    }
  }

  return (
    <main className="p-8 w-full flex flex-col flex-1 items-center justify-center">
      <h1 className="mb-6 text-3xl font-bold flex">Controle de Vagas</h1>

      <div className="mb-6 flex flex-col gap-3 max-w-md w-full">
        <input
          type="text"
          placeholder="Placa"
          value={placa}
          onChange={(e) => setPlaca(e.target.value)}
          className="border p-2 rounded text-white"
        />

        {!carregado ? (
          <input
            type="text"
            placeholder="Carregando..."
            className="border p-2 rounded text-white"
            disabled
          />
        ) : (
          <select
            value={vaga}
            onChange={(e) => setVaga(e.target.value)}
            className="border p-2 rounded text-white"
          >
            <option value="" disabled className="text-black">
              Selecione uma vaga
            </option>
            {vagasDisponiveis.map((vagaDisponivel) => (
              <option key={vagaDisponivel} className="text-black" value={vagaDisponivel}>
                Vaga {vagaDisponivel}
              </option>
            ))}
          </select>
        )}

        <input
          type="text"
          placeholder="Nome do Cliente"
          value={cliente}
          onChange={(e) => setCliente(e.target.value)}
          className="border p-2 rounded text-white"
        />

        <input
          type="text"
          placeholder="CPF do Cliente"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          className="border p-2 rounded text-white"
        />

        <input
          type="datetime-local"
          value={horarioEntrada}
          onChange={(e) => sethorarioEntrada(e.target.value)}
          className="border p-2 rounded text-white"
        />

        <button
          onClick={adicionarVeiculo}
          className="bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
        >
          Registrar veículo
        </button>
      </div>

      <div className="space-y-4 w-full max-w-2xl">
        {!carregado ? (
          <h1>Carregando...</h1>
        ) : (
          veiculos.map((veiculo) => {
            const isEditing = editandoId === veiculo.id;

            return veiculo.horarioSaida !== "" ? (
              <div key={veiculo.id} className="border border-green-400 p-4 rounded bg-green-500/5">
                <p><strong>Placa:</strong> {veiculo.placa}</p>
                <p><strong>Vaga:</strong> {veiculo.vaga}</p>
                <p><strong>Entrada:</strong> {veiculo.horarioEntrada}</p>
                <p><strong>Saída:</strong> {veiculo.horarioSaida}</p>
              </div>
            ) : (
              <div
                key={veiculo.id}
                className="border rounded p-4 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/5"
              >
                <div className="flex flex-col gap-2 w-full">
                  <p className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <strong className="min-w-[110px]">Placa:</strong>
                    <input
                      type="text"
                      value={isEditing ? dadosEdicao.placa : veiculo.placa}
                      onChange={(e) =>
                        setDadosEdicao({ ...dadosEdicao, placa: e.target.value })
                      }
                      disabled={!isEditing}
                      className={`border p-2 rounded flex-1 text-black ${
                        isEditing ? "border-blue-500 bg-white" : "bg-transparent border-transparent text-white"
                      }`}
                    />
                  </p>

                  <p className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <strong className="min-w-[110px]">Vaga:</strong>
                    <select
                      value={isEditing ? dadosEdicao.vaga : veiculo.vaga}
                      onChange={(e) =>
                        setDadosEdicao({ ...dadosEdicao, vaga: e.target.value })
                      }
                      disabled={!isEditing}
                      className={`border p-2 rounded flex-1 text-black ${
                        isEditing ? "border-blue-500 bg-white" : "bg-transparent border-transparent text-white disabled:opacity-100"
                      }`}
                    >
                      <option value={veiculo.vaga}>{veiculo.vaga}</option>
                      {vagasDisponiveis.map((vagaDisponivel) => (
                        <option key={vagaDisponivel} value={vagaDisponivel}>
                          {vagaDisponivel}
                        </option>
                      ))}
                    </select>
                  </p>

                  <p className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <strong className="min-w-[110px]">Nome Cliente:</strong>
                    <input
                      type="text"
                      value={isEditing ? dadosEdicao.cliente : veiculo.cliente}
                      onChange={(e) =>
                        setDadosEdicao({ ...dadosEdicao, cliente: e.target.value })
                      }
                      disabled={!isEditing}
                      className={`border p-2 rounded flex-1 text-black ${
                        isEditing ? "border-blue-500 bg-white" : "bg-transparent border-transparent text-white"
                      }`}
                    />
                  </p>

                  <p className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <strong className="min-w-[110px]">CPF Cliente:</strong>
                    <input
                      type="text"
                      value={isEditing ? dadosEdicao.cpf : veiculo.cpf}
                      onChange={(e) =>
                        setDadosEdicao({ ...dadosEdicao, cpf: e.target.value })
                      }
                      disabled={!isEditing}
                      className={`border p-2 rounded flex-1 text-black ${
                        isEditing ? "border-blue-500 bg-white" : "bg-transparent border-transparent text-white"
                      }`}
                    />
                  </p>

                  <p className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <strong className="min-w-[110px]">Entrada:</strong>
                    <input
                      type="datetime-local"
                      value={isEditing ? dadosEdicao.horarioEntrada : veiculo.horarioEntrada}
                      onChange={(e) =>
                        setDadosEdicao({ ...dadosEdicao, horarioEntrada: e.target.value })
                      }
                      disabled={!isEditing}
                      className={`border p-2 rounded flex-1 text-black ${
                        isEditing ? "border-blue-500 bg-white" : "bg-transparent border-transparent text-white"
                      }`}
                    />
                  </p>
                </div>

                <div className="flex flex-col gap-2 w-full sm:w-auto min-w-[150px]">
                  {isEditing ? (
                    <>
                      <button
                        onClick={salvarEdicao}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                      >
                        SALVAR
                      </button>
                      <button
                        onClick={cancelarEdicao}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                      >
                        CANCELAR
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => iniciarEdicao(veiculo)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
                      >
                        EDITAR
                      </button>
                      <button
                        onClick={() => removerVeiculo(veiculo.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                      >
                        DELETE
                      </button>
                      <button
                        onClick={() => registrarSaida(veiculo.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                      >
                        REGISTRAR SAÍDA
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}