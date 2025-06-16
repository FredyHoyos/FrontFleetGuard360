"use client";

import { Clock, SquarePen } from "lucide-react";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Simular usuario actual
const currentUser = "Juan Martinez";

// Datos mock, algunos del usuario, otros de distintos conductores
const shifts = [
  {
    route: "A45",
    driver: "Pablo Ramos",
    copilot: "N/A",
    time: "7:00",
    day: "06/02",
    myAssignment: false,
  },
  {
    route: "A46",
    driver: currentUser,
    copilot: "N/A",
    time: "8:00",
    day: "06/02",
    myAssignment: true,
  },
  {
    route: "A47",
    driver: "Ana Lopez",
    copilot: currentUser,
    time: "9:00",
    day: "06/02",
    myAssignment: true,
  },
  {
    route: "B14",
    driver: "Carlos Lopez",
    copilot: "Alejandro Cataño",
    time: "14:00",
    day: "06/15",
    myAssignment: false,
  },
  {
    route: "C19",
    driver: "Juan Martinez",
    copilot: "Jose Gomez",
    time: "12:00",
    day: "05/10",
    myAssignment: true,
  },
  {
    route: "B22",
    driver: "Juan Martinez",
    copilot: "Ana Ríos",
    time: "16:00",
    day: "07/03",
    myAssignment: true,
  },
  {
    route: "Z11",
    driver: "Andrés Molina",
    copilot: "N/A",
    time: "09:00",
    day: "06/12",
    myAssignment: false,
  },
];

export default function ShiftsPage() {
  const router = useRouter();
  const [showMine, setShowMine] = useState(false);

  // Filtrar según el check
  const shownShifts = showMine ? shifts.filter(s => s.myAssignment) : shifts;

  const handleAddShift = () => {
    router.push('/addShift');
  };

  const goBack = () => {
    router.push('/admin');
  };

  const handleEditShift = (route: string) => {
    //TODO: Petición para obtener turno con ruta como ID
    router.push(`/editShift/${route}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userName="Admin *Usuario*" role="Administrador" />
      <div className="container mx-auto px-4 py-8">
        {/* Título principal */}
        <h1 className="text-primary text-2xl font-bold mb-2">Panel de administración</h1>
        <div className="flex flex-col gap-6 bg-gray-100 rounded-lg shadow-sm p-8 border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-3">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 leading-tight mb-1">Gestión de turnos</h2>
              <p className="text-base text-gray-600">Organiza los turnos que tendran los conductores</p>
            </div>
            <div className="flex flex-row gap-3 items-center">
              <button className="rounded border border-gray-500 bg-white text-gray-900 font-medium px-6 py-2 hover:bg-gray-200 transition"
              onClick={goBack}>Volver</button>
              <button 
                className="flex items-center gap-1 rounded bg-primary text-white font-semibold px-6 py-2 hover:bg-primary/80 transition"
                onClick={handleAddShift}
              >
                Asignar 
                <Clock size={20} />
              </button>
            </div>
          </div>

          {/* Filtro "Mis asignaciones" (checkbox) */}
          <div className="flex items-center mb-4">
            <input
              id="my-assignments"
              type="checkbox"
              name="filter"
              checked={showMine}
              onChange={e => setShowMine(e.target.checked)}
              className="accent-primary w-5 h-5"
            />
            <label htmlFor="my-assignments" className="ml-2 text-gray-700">
              Mis asignaciones
            </label>
          </div>

          {/* Tabla de turnos */}
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0 bg-white rounded-lg shadow-sm">
              <thead>
                <tr className="text-gray-500 text-left">
                  <th className="px-6 py-3 font-semibold">Ruta</th>
                  <th className="px-6 py-3 font-semibold">Conductor</th>
                  <th className="px-6 py-3 font-semibold">Copiloto</th>
                  <th className="px-6 py-3 font-semibold">Hora</th>
                  <th className="px-6 py-3 font-semibold">Día</th>
                  <th className="px-6 py-3 font-semibold text-center">Editar</th>
                </tr>
              </thead>
              <tbody>
                {shownShifts.map((shift) => (
                  <tr
                    key={shift.route}
                    className={
                      shift.myAssignment
                        ? "bg-[#407BFF] text-white font-semibold hover:bg-[#255edc]"
                        : "hover:bg-gray-100 transition"
                    }
                  >
                    <td className="px-6 py-3 whitespace-nowrap">{shift.route}</td>
                    <td className="px-6 py-3 whitespace-nowrap">{shift.driver}</td>
                    <td className="px-6 py-3 whitespace-nowrap">{shift.copilot}</td>
                    <td className="px-6 py-3 whitespace-nowrap">{shift.time}</td>
                    <td className="px-6 py-3 whitespace-nowrap">{shift.day}</td>
                    <td className="px-6 py-3 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => handleEditShift(shift.route)}
                        className="hover:scale-110 hover:text-primary transition"
                        aria-label="Editar turno"
                      >
                        <SquarePen size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
