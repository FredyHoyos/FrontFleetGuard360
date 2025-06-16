"use client"
import Header from "@/components/Header";
import { useState } from "react";
import { useRouter } from "next/navigation";
/*import { useEffect } from "react";*/
/*import { Driver } from "@/types/driver";*/
import Graficar from "./Grafico/page";

export default function RegistroTurnos() {

  type Driver = {
    id: string;
    name: string;
    documentNumber: string;
    rol: string;
    email: string;
    phoneNumber: string;
    [key: string]: unknown;
  };


  const [admin] = useState<Driver | null>(null);
  /*const [drivers, setDrivers] = useState<Driver[]>([]);*/
  /*const [loading, setLoading] = useState(true);*/
  const [error] = useState<string | null>(null);
  const [controlPopUp, setControlPopUp] = useState(false);

  const mostrarPopUp = () => {
    setControlPopUp(!controlPopUp);
  };

 const router = useRouter();
  const goBack = () => {
    router.back();
  };





  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header userName="Error" />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // 

  return (
    <div className="min-h-screen bg-gray-100">
      <Header userName={admin?.name || ""} role="Administrador" />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Informe de turnos</h2>
            <p className="text-sm text-gray-600 mb-4 mt-4">
              Revisa tu rendimiento laboral, siempre hay algo que mejorar
            </p>
          </div>
        </div>
        <div className="flex flex-row-reverse items-center gap-[30px]">
          <button
            className="cursor-pointer flex items-center gap-2 bg-primary hover:bg-primary/70 text-white px-4 py-2 rounded-md font-medium" onClick={mostrarPopUp}>
            Graficar
          </button>
          <button
            className="cursor-pointer flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-800 px-4 py-2 rounded-md font-medium border border-gray-300 " onClick={goBack}>
            Volver

          </button>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8 bg-white rounded-[15px]">
        <div className="">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="text-left text-sm font-semibold text-gray-700">
              <tr className="text-center">
                <th className="px-6 py-3">Ruta</th>

                <th className="px-6 py-3">Hora</th>
                <th className="px-6 py-3">Dias</th>
                <th className="px-6 py-3">Asistencia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-center">

              <tr>

                <td className="px-6 py-4">
                  A45
                </td>

                <td className="px-6 py-4">
                  7:00
                </td>
                <td className="px-6 py-4">
                  06/02
                </td>
                <td className="px-6 py-4">
                  O
                </td>

              </tr>
              <tr>

                <td className="px-6 py-4">
                  B14
                </td>

                <td className="px-6 py-4">
                  14:00
                </td>
                <td className="px-6 py-4">
                  06/15
                </td>
                <td className="px-6 py-4">
                  X
                </td>


              </tr>
              <tr>

                <td className="px-6 py-4">
                  C21
                </td>

                <td className="px-6 py-4">
                  12:00
                </td>
                <td className="px-6 py-4">
                  06/17
                </td>
                <td className="px-6 py-4">
                  +
                </td>

              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {controlPopUp && (
        <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50  ">
          <div className="bg-white p-8 rounded-lg shadow-lg relative w-[800px]">
            <Graficar />
            <button
              className="absolute top-2 right-2 text-red-500 font-bold"
              onClick={() => setControlPopUp(false)}
            >X</button>
          </div>
        </div>
      )}

    </div>



  );
}
