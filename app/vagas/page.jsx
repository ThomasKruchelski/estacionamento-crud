"use client";

import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

const STORAGE_KEY = "veiculos-estacionamento";

export default function VagasPage() {
  const [cliente, setCliente] = useState("");
  const [cpf, setCpf] = useState("");
  const [placa, setPlaca] = useState("");
  const [vaga, setVaga] = useState("");
  const [horarioEntrada, sethorarioEntrada] = useState("");
  const [horarioSaida, sethorarioSaida] = useState("");

  const [carregado, setCarregado] = useState(false);

  const [veiculos, setVeiculos] = useState([]);

  // Novos states para controlar a edição
  const [editandoId, setEditandoId] = useState(null);
  const [dadosEdicao, setDadosEdicao] = useState({
    placa: "",
    vaga: "",
    horarioEntrada: "",
    cpf: "",
    cliente: "",
    horarioSaida: "",
  });

  // Caso precise fazer a consulga manual ao local storage, mudado para linha 15,16,17
  // useEffect(() => {
  //   const dadosSalvos = localStorage.getItem(STORAGE_KEY);

  //   if (dadosSalvos) {
  //     setVeiculos(JSON.parse(dadosSalvos));
  //   }
  // }, []);

  useEffect(() => {
    async function carregarVeiculos() {
      try {
        const querySnapshot = await getDocs(collection(db, "veiculos"));
        const lista = [];

        querySnapshot.forEach((doc) => {
          console.log("doc");
          console.log(doc);
          lista.push({ id: doc.id, ...doc.data() });
        });

        setVeiculos(lista);
      } catch (error) {
        console.error("Erro ao buscar veículos:", error);
      } finally {
        setCarregado(true);
      }
    }

    carregarVeiculos();
  }, []);

  useEffect(() => {
    console.log("veiculos");
    console.log(veiculos);
  }, [veiculos]);

  function adicionarVeiculo() {
    if (!placa || !vaga || !horarioEntrada || !cpf || !cliente) {
      alert("Preencha todos os campos");
      return;
    }

    const novoVeiculo = {
      id: crypto.randomUUID(),
      placa,
      vaga,
      horarioEntrada,
      cpf,
      cliente,
      horarioSaida,
    };

    setVeiculos((estadoAtual) => [...estadoAtual, novoVeiculo]);

    setPlaca("");
    setVaga("");
    sethorarioEntrada("");
    setCliente("");
    setCpf("");
  }

  function removerVeiculo(id) {
    const novaLista = veiculos.filter((veiculo) => veiculo.id !== id);
    setVeiculos(novaLista);
  }

  // --- Funções de Edição ---
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

  function registrarSaida(veiculo) {
    const getDataSaida = new Date();

    const dataSaida = getDataSaida
      .toString()
      .replace(" GMT-0300 (Horário Padrão de Brasília)", "");
    console.log(dataSaida);

    const novaLista = veiculos.map((v) =>
      v.id === veiculo ? { ...v, horarioSaida: dataSaida } : v,
    );

    setVeiculos(novaLista);
  }

  function salvarEdicao() {
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

    const novaLista = veiculos.map((v) =>
      v.id === editandoId ? { ...v, ...dadosEdicao } : v,
    );

    setVeiculos(novaLista);
    setEditandoId(null);
  }

  return (
    <main className="p-8 w-full flex flex-col flex-1 items-center justify-center">
      <h1 className="mb-6 text-3xl font-bold flex">Controle de Vagas</h1>

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
          type="text"
          placeholder="Nome do Cliente"
          value={cliente}
          onChange={(e) => setCliente(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="text"
          placeholder="CPF do Cliente"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
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
            // Verifica se o item atual é o que está sendo editado
            const isEditing = editandoId === veiculo.id;

            return veiculo.horarioSaida !== "" ? (
              <div key={veiculo.id} className="border border-green-400 p-4">
                <p>Placa: {veiculo.placa}</p>
                <p>Entrada: {veiculo.horarioEntrada}</p>
                <p>Saída: {veiculo.horarioSaida}</p>
              </div>
            ) : (
              <div
                key={veiculo.id}
                className="border rounded p-4 flex flex-col sm:flex-row justify-between items-center gap-4"
              >
                <div className="flex flex-col gap-2 w-full">
                  <p className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <strong className="min-w-[80px]">Placa:</strong>
                    <input
                      type="text"
                      placeholder="Placa"
                      value={isEditing ? dadosEdicao.placa : veiculo.placa}
                      onChange={(e) =>
                        setDadosEdicao({
                          ...dadosEdicao,
                          placa: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                      className={`border p-2 rounded flex-1 ${isEditing ? "border-blue-500" : ""}`}
                    />
                  </p>

                  <p className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <strong className="min-w-[80px]">Vaga:</strong>
                    <input
                      type="text"
                      placeholder="Vaga"
                      value={isEditing ? dadosEdicao.vaga : veiculo.vaga}
                      onChange={(e) =>
                        setDadosEdicao({ ...dadosEdicao, vaga: e.target.value })
                      }
                      disabled={!isEditing}
                      className={`border p-2 rounded flex-1 ${isEditing ? "border-blue-500" : ""}`}
                    />
                  </p>

                  <p className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <strong className="min-w-[80px]">Nome Cliente:</strong>
                    <input
                      type="text"
                      placeholder="Nome do Cliente"
                      value={isEditing ? dadosEdicao.cliente : veiculo.cliente}
                      onChange={(e) =>
                        setDadosEdicao({
                          ...dadosEdicao,
                          cliente: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                      className={`border p-2 rounded flex-1 ${isEditing ? "border-blue-500" : ""}`}
                    />
                  </p>

                  <p className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <strong className="min-w-[80px]">CPF Cliente:</strong>
                    <input
                      type="text"
                      placeholder="Nome do Cliente"
                      value={isEditing ? dadosEdicao.cpf : veiculo.cpf}
                      onChange={(e) =>
                        setDadosEdicao({
                          ...dadosEdicao,
                          cpf: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                      className={`border p-2 rounded flex-1 ${isEditing ? "border-blue-500" : ""}`}
                    />
                  </p>

                  <p className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <strong className="min-w-[80px]">Entrada:</strong>
                    <input
                      type="datetime-local"
                      value={
                        isEditing
                          ? dadosEdicao.horarioEntrada
                          : veiculo.horarioEntrada
                      }
                      onChange={(e) =>
                        setDadosEdicao({
                          ...dadosEdicao,
                          horarioEntrada: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                      className={`border p-2 rounded flex-1 ${isEditing ? " border-blue-500" : ""}`}
                    />
                  </p>
                </div>

                {/* Botões de Ação */}
                <div className="flex flex-col gap-2 w-full sm:w-auto">
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
                        ADICIONAR SAIDA
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
