"use client";
import Link from "next/link";

import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

const STORAGE_KEY = "veiculos-estacionamento";

export default function Home() {

  const [veiculos, setVeiculos] = useState([]);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
      async function carregarVeiculos() {
        try {
          const querySnapshot = await getDocs(collection(db, "veiculos"));
          const lista:any = [];

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

  return (
    <main className="p-8 w-full flex flex-col items-center justify-center flex-1">
      <div className="flex itens-center flex-col justify-center items-center">
        <h1 className="text-3xl font-bold">Sistema de Estacionamento</h1>

        <Link
          href="/vagas"
          className="mt-4 inline-block rounded bg-blue-600 hover:bg-blue-500 px-4 py-2 text-white max-w-[350px]"
        >
          Ir para controle de vagas
        </Link>
      </div>
      <div>
        
      </div>
    </main>
  );
}
