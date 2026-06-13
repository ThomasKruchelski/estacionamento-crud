import { NextResponse } from "next/server";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../lib/firebase"; // Ajuste o caminho para o seu arquivo do firebase

export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, "veiculos"));
    const lista= [];

    querySnapshot.forEach((doc) => {
      lista.push({ id: doc.id, ...doc.data() });
    });

    return NextResponse.json(lista, { status: 200 });
  } catch (error) {
    console.error("Erro na API de veículos:", error);
    return NextResponse.json(
      { error: "Erro interno ao buscar veículos" },
      { status: 500 }
    );
  }
}