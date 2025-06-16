"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { ArrowLeft } from "lucide-react";

// Form interfaces
interface FormFields {
  driver: string;
  copilot: string;
  route: string;
  hour: string;
  day: string;
}



//Datos ejemplo para edición de turno
const shiftMock: FormFields = {
  driver: "Pablo Ramos",
  copilot: "Alejandro Naranjo",
  route: "A45",
  hour: "07:00",
  day: "2024-06-20", // yyyy-mm-dd
};

// Genera todas las medias horas del día
const HOURS = Array.from({ length: 48 }, (_, i) => {
  const hour = String(Math.floor(i / 2)).padStart(2, "0");
  const min = i % 2 === 0 ? "00" : "30";
  return `${hour}:${min}`;
});

  export default function EditShift() {
  const router = useRouter();
  const [form, setForm] = useState({ ...shiftMock });
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  interface FormErrors {
    driver?: string;
    copilot?: string;
    route?: string;
    hour?: string;
    day?: string;
  }

  const validate = () => {
    const newErrors: FormErrors = {};
    if (!form.driver) newErrors.driver = "Campo obligatorio";
    if (!form.route) newErrors.route = "Campo obligatorio";
    if (!form.hour) newErrors.hour = "Campo obligatorio";
    if (!form.day) newErrors.day = "Campo obligatorio";
    if (form.driver && !/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{1,20}$/.test(form.driver)) {
      newErrors.driver = "Conductor solo puede tener texto alfabético (max 20 )";
    }
    if (form.copilot && !/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{1,20}$/.test(form.copilot)) {
      newErrors.copilot = "Copiloto solo puede tener texto alfabético (max 20 )";
    }
    if (form.route && !/^[A-Za-z0-9]{1,5}$/.test(form.route)) {
      newErrors.route = "Ruta debe ser alfanumerico (max 5)";
    }
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const valErrors = validate();
    setErrors(valErrors);
    if (Object.keys(valErrors).length === 0) {
      setSuccessMsg("Se ha modificado correctamente el turno");
    }
  };

  const handleDelete = () => {
    setDeleteConfirm(true);
  };

  const confirmDelete = () => {
    setDeleteConfirm(false);
    setSuccessMsg("Se ha eliminado correctamente el turno");
  };
  
  const cancelDelete = () => {
    setDeleteConfirm(false);
  };

  const handleSuccessClose = () => {
    setSuccessMsg(null);
    router.push("/shifts");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userName="Admin *Usuario*" role="Administrador" />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-primary text-2xl font-bold mb-2">Panel de administración</h1>
        <div className="flex flex-col gap-6 bg-white rounded-lg shadow-sm p-8 border border-gray-200">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={() => router.back()} className="hover:text-primary transition"><ArrowLeft size={24} /></button>
            <h2 className="text-2xl font-bold text-black">Editar Turno</h2>
            <div className="flex-1"></div>
            <button
              className="bg-red-500 text-white font-semibold rounded-md px-6 py-2 hover:bg-red-700 transition mr-2"
              onClick={handleDelete}
            >Eliminar</button>
            <button
              className="bg-[#407BFF] text-white font-semibold rounded-md px-6 py-2 hover:bg-primary/80 transition"
              onClick={handleSubmit}
            >Aceptar</button>
          </div>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2" onSubmit={handleSubmit}>
            <div>
              <label className="font-semibold block mb-1" htmlFor="driver">Conductor</label>
              <input
                type="text"
                name="driver"
                id="driver"
                value={form.driver}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-md px-3 py-2 focus:outline-primary"
                autoComplete="off"
              />
              {errors.driver && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><span>▲</span> {errors.driver}</p>}
            </div>
            <div>
              <label className="font-semibold block mb-1" htmlFor="route">Ruta</label>
              <input
                type="text"
                name="route"
                id="route"
                value={form.route}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-md px-3 py-2 focus:outline-primary"
                autoComplete="off"
              />
              {errors.route && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><span>▲</span> {errors.route}</p>}
            </div>
            <div>
              <label className="font-semibold block mb-1" htmlFor="copilot">Copiloto</label>
              <input
                type="text"
                name="copilot"
                id="copilot"
                value={form.copilot}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-md px-3 py-2 focus:outline-primary"
                autoComplete="off"
              />
              {errors.copilot && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><span>▲</span> {errors.copilot}</p>}
            </div>
            <div>
              <label className="font-semibold block mb-1" htmlFor="hour">Hora</label>
              <select
                name="hour"
                id="hour"
                value={form.hour}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-md px-3 py-2 focus:outline-primary bg-white"
              >
                <option value="">Seleccione una hora</option>
                {HOURS.map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
              {errors.hour && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><span>▲</span> {errors.hour}</p>}
            </div>
            <div>
              <label className="font-semibold block mb-1" htmlFor="day">Día</label>
              <input
                type="date"
                name="day"
                id="day"
                value={form.day}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-md px-3 py-2 focus:outline-primary bg-white"
              />
              {/* Formato visual mm/dd si se ha seleccionado */}
              {/*
              {form.day && (
                <div className="w-full text-center mt-1 text-base font-semibold tracking-wide">{formatDayToMMDD(form.day)}</div>
              )}
              */}
              {errors.day && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><span>▲</span> {errors.day}</p>}
            </div>
          </form>
        </div>
      </div>

      {/* MODALES */}
      {/* Confirmación de éxito al modificar/eliminar */}
      {successMsg && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-xl shadow-xl px-10 py-8 text-center">
            <p className="text-lg mb-6">{successMsg}</p>
            <button
              className="bg-[#407BFF] text-white font-semibold rounded-md px-8 py-2 hover:bg-primary/80 transition"
              onClick={handleSuccessClose}
            >Volver</button>
          </div>
        </div>
      )}
      {/* Modal de confirmación para eliminar */}
      {deleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-xl shadow-xl px-10 py-8 text-center">
            <h3 className="font-bold text-lg mb-3">Eliminacion de turno</h3>
            <p className="mb-5">¿Estas seguro que deseas eliminar este turno?</p>
            <div className="flex gap-5 justify-center">
              <button
                className="border border-gray-700 text-black font-semibold rounded-md px-8 py-2 hover:bg-gray-200 transition"
                onClick={confirmDelete}
              >SI</button>
              <button
                className="bg-[#407BFF] text-white font-semibold rounded-md px-8 py-2 hover:bg-primary/80 transition"
                onClick={cancelDelete}
              >No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
