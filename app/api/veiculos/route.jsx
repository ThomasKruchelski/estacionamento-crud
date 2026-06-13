import { NextResponse } from "next/server";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase"; // Ajuste o caminho conforme seu projeto

// GET: Listar veículos
export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, "veiculos"));
    const lista = [];
    querySnapshot.forEach((doc) => {
      lista.push({ id: doc.id, ...doc.data() });
    });
    return NextResponse.json(lista, { status: 200 });
  } catch (error) {
    console.error("Erro ao listar:", error);
    return NextResponse.json({ error: "Erro ao buscar veículos" }, { status: 500 });
  }
}

// POST: Criar veículo
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validação básica no servidor
    if (!body.placa || !body.vaga || !body.horarioEntrada || !body.cpf || !body.cliente) {
      return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });
    }

    const novoVeiculo = {
      placa: body.placa,
      vaga: body.vaga,
      horarioEntrada: body.horarioEntrada,
      cpf: body.cpf,
      cliente: body.cliente,
      horarioSaida: body.horarioSaida || "",
    };

    const docRef = await addDoc(collection(db, "veiculos"), novoVeiculo);
    return NextResponse.json({ id: docRef.id, ...novoVeiculo }, { status: 201 });
  } catch (error) {
    console.error("Erro ao adicionar:", error);
    return NextResponse.json({ error: "Erro ao salvar veículo" }, { status: 500 });
  }
}