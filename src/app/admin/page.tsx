"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { UserPlus } from "lucide-react";
import { FolderClock } from 'lucide-react';
import DriversTable from "@/components/DriversTable";

export default function AdminPage() {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  type Driver = {
    id: string;
    name: string;
    documentNumber: string;
    rol: string;
    email: string;
    phoneNumber: string;
    [key: string]: unknown;
  };

  const [admin, setAdmin] = useState<Driver | null>(null);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (!accessToken) {
        router.push("/login");
        return;
      }

      const payload = JSON.parse(atob(accessToken.split(".")[1]));
      const currentTime = Math.floor(Date.now() / 1000);

      if (payload.exp < currentTime) {
        if (refreshToken) {
          try {
            const res = await fetch("https://backfleetguard360-10.onrender.com/api/auth/refresh", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refreshToken }),
            });

            const data = await res.json();

            if (res.ok) {
              localStorage.setItem("accessToken", data.accessToken);
              localStorage.setItem("refreshToken", data.refreshToken);
            } else {
              localStorage.clear();
              router.push("/login");
              return;
            }
          } catch {
            localStorage.clear();
            router.push("/login");
            return;
          }
        } else {
          localStorage.clear();
          router.push("/login");
          return;
        }
      }

      // Obtener datos de conductores
      try {
        const driversRes = await fetch("https://backfleetguard360-10.onrender.com/api/driver/all", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        const data = await driversRes.json();

        if (driversRes.ok) {
          const adminDriver = data.find((d: Driver) => d.id === payload.sub);
          const otherDrivers = data.filter((d: Driver) => d.id !== payload.sub);

          setAdmin(adminDriver);
          setDrivers(otherDrivers);
        } else {
          throw new Error("No se pudo obtener la lista de conductores");
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error al obtener datos");
        }
      } finally {
        setLoading(false);
        setCheckingAuth(false);
      }
    };

    checkAuthAndLoadData();
  }, [router]);

  const handleEditProfile = () => {
    router.push("/agregar");
  };

  const handleShifts = () => {
    router.push("/shifts");
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Verificando sesión...
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header userName="Cargando..." />
        <div className="container mx-auto px-4 py-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-gray-100">
      <Header userName={admin?.name || ""} role="Administrador" />
      <div className="container mx-auto px-4 py-8">
        <div className="flex lg:justify-between  flex-col lg:flex-row items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Panel de administración</h2>
            <p className="text-sm text-gray-600 mb-4">
              Gestiona la información de los conductores registrados en el sistema.
            </p>
          </div>
          <div className="lg:flex hidden flex-row gap-4">
            <button
              className=" cursor-pointer flex items-center gap-2 bg-primary hover:bg-primary/70 text-white px-4 py-2 rounded-md font-medium"
              onClick={handleShifts}
            >
              Gestion de turnos
              <FolderClock  size={20} />
            </button>
            <button
              className="cursor-pointer flex items-center gap-2 bg-primary hover:bg-primary/70 text-white px-4 py-2 rounded-md font-medium"
              onClick={handleEditProfile}
            >
              Agregar empleado
              <UserPlus size={20} />
            </button>
          </div>
        </div>
        <DriversTable drivers={drivers} />
        <div className="lg:hidden flex justify-between mb-6 p-4">
        <button
              className="cursor-pointer flex items-center gap-2 bg-primary hover:bg-primary/70 text-white px-4 py-2 rounded-md font-medium"
              onClick={handleShifts}
            >
              Gestion de turnos
              <FolderClock  size={20} />
            </button>
          <button
            className="cursor-pointer flex items-center gap-2 bg-primary hover:bg-primary/70 text-white px-4 py-2 rounded-md font-medium"
            onClick={handleEditProfile}
          >
            Agregar empleado
            <UserPlus size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
