import { NextResponse } from "next/server";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../../../lib/firebase";

// PUT: Atualizar dados ou registrar saída
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const veiculoRef = doc(db, "veiculos", id);
    await updateDoc(veiculoRef, body);

    return NextResponse.json({ message: "Atualizado com sucesso" }, { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar:", error);
    return NextResponse.json({ error: "Erro ao atualizar veículo" }, { status: 500 });
  }
}

// DELETE: Remover veículo
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const veiculoRef = doc(db, "veiculos", id);
    await deleteDoc(veiculoRef);

    return NextResponse.json({ message: "Removido com sucesso" }, { status: 200 });
  } catch (error) {
    console.error("Erro ao deletar:", error);
    return NextResponse.json({ error: "Erro ao remover veículo" }, { status: 500 });
  }
}