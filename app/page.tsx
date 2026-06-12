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

  const todasVagas = ["01", "02", "03", "04", "05", "06", "07", "08"];

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
    <main className="p-8 w-full flex gap-12 items-center justify-center flex-1">
      <div className="flex itens-center flex-col justify-center items-center flex-1">
        <h1 className="text-3xl font-bold">Sistema de Estacionamento</h1>

        <Link
          href="/vagas"
          className="mt-4 inline-block rounded bg-blue-600 hover:bg-blue-500 px-4 py-2 text-white max-w-[350px]"
        >
          Ir para controle de vagas
        </Link>
      </div>
      
        
          <div className="flex-1 flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-4">Vagas disponiveis</h1>
            <div className="border border-white p-4 flex-1 flex w-full flex-wrap">
              {!carregado ? (
                <h1>Carregando...</h1>
              ) : (
                todasVagas.map((vaga) => {
                  const vagaOcupanda = veiculos.find(
                    (veiculo) => Number(veiculo.vaga) === Number(vaga) && veiculo.horarioSaida === ""
                  );

                  console.log("vaga ocupada" + vaga)
                  console.log(vagaOcupanda)
                  
                  return vagaOcupanda != undefined? (
                    <div key={vaga} className={`border border-red-500 m-4 w-1/5 flex items-center flex-col`}>
                    <h1 className="font-bold">Vaga {vaga}</h1>
                    <div>
                      <p>Veiculo: {vagaOcupanda.placa}</p>
                    </div>
                    
                  </div>
                  ) : (
                    <div key={vaga} className={`border border-green-500 m-4 w-1/5 flex items-center flex-col`}>
                    <h1 className="font-bold">Vaga {vaga}</h1>
                   
                    
                  </div>
                  )

                  return(
                  <div key={vaga} className={` ${vagaOcupanda != undefined? "border border-red-500": "border border-green-500"} m-4 w-1/5 flex items-center flex-col`}>
                    <h1>Vaga {vaga}</h1>
                    <div>
                      {vaga}
                    </div>
                    
                  </div>
                )})
              )}
            </div>
          </div>
          
    </main>
  );
}
