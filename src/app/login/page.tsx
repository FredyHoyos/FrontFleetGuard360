"use client";

import React, { useState } from "react";
import InputField from "../../components/InputField";
import InputCodigo from "../../components/InputCodigo";
import RoleSelector from "../../components/RoleSelector";
import Button from "../../components/Button";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1); // 1: Login inicial, 2: Verificación de código
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "driver">("admin");
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resetPassword = () => {
    router.push("/resetLoginPass");
  }

  const handleInitialSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError("");

      try {
        const res = await fetch("https://backfleetguard360-10.onrender.com/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: email, // o podrías tener username separado si lo deseas
            password,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Credenciales incorrectas");
        }

        // Guardar tokens en localStorage (o cookies seguras si usás SSR)
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("userId", data.userId);

        // Redirigir según rol
        if (role === "admin") {
          router.push("/admin");
        } else {
          router.push("/driver");
        }
      } catch (err: unknown) {
        console.error("Login error", err);
        if (err instanceof Error) {
          setError(err.message || "Error en el login");
        } else {
          setError("Error en el login");
        }
      }

      setLoading(false);
    };


  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    console.log("Verificando código...", { verificationCode });

    // Simulación de llamada a la API para verificar el código
    // Reemplaza esto con tu lógica real de llamada al backend
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simular espera de la API

    const response = { success: true }; // Simulación de respuesta del backend

    if (response.success) {
      if (role === "admin") {
        router.push("/admin");
      } else if (role === "driver") {
        router.push("/driver");
      }
    } else {
      setError("El código de verificación es incorrecto");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary md:text-4xl">
            Sistema de Gestión de Conductores
          </h1>
          <p className="mt-3 text-gray-500">Inicia sesión para acceder al sistema</p>
        </div>

        <div className="flex flex-col items-center lg:block mt-8 lg:rounded-3xl lg:bg-white p-8 lg:shadow-xl">
          <h2 className="text-2xl font-bold text-gray-900">Iniciar sesión</h2>

          {step === 1 && (
            <>
              <h3 className="mt-1 text-[19px] lg:text-sm text-gray-500">
                Selecciona tu rol e ingresa tus credenciales
              </h3>

              <RoleSelector selectedRole={role} onChange={setRole} />

              <form className="mt-4 w-full" onSubmit={handleInitialSubmit}>
                <label className="mb-2 font-bold text-black block" htmlFor="email">
                  Usuario:
                </label>
                <InputField
                  type="text"
                  id="email"
                  placeholder="Ingresa tu usuario"
                  icon="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <label className="mb-2 font-bold text-black block mt-4" htmlFor="password">
                  Contraseña:
                </label>
                <InputField
                  type="password"
                  id="password"
                  placeholder="Ingresa tu contraseña"
                  icon="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <div className="flex flex-col lg:flex-col-reverse items-center justify-between gap-4 mt-6">
                  <Button
                    type="submit"
                    className="cursor-pointer w-40 hover:bg-primary/80 transition-transform duration-200 hover:scale-105"
                    disabled={loading}
                  >
                    Ingresar
                  </Button>
                  <button
                      onClick={resetPassword}
                      className="text-[#3DAEF4] hover:text-primary/80 hover:underline self-center lg:self-start cursor-pointer bg-transparent border-none p-0"
                    >
                      ¿Haz olvidado tu contraseña?
                  </button>
                </div>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <h3 className="mt-1 text-[19px] lg:text-sm text-gray-500">
                Ingresa el código que te mandamos al correo
              </h3>
              <form className="mt-4 w-full" onSubmit={handleVerificationSubmit}>
                <label
                  className="mb-2 font-bold text-black block"
                  htmlFor="verificationCode"
                >
                  Código de verificación:
                </label>
                <InputCodigo
                    placeholder="Ingresa el código de verificación"
                    id="verificationCode"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                 />

                <div className="flex items-center flex-col justify-between gap-4 mt-6">
                  <Button
                    type="submit"
                    className="cursor-pointer w-40 hover:bg-primary/80 transition-transform duration-200 hover:scale-105"
                    disabled={loading}
                  >
                    Ingresar
                  </Button>
                </div>

                <div className="flex items-start flex-col justify-between gap-4 mt-6">
                  <button
                    type="button"
                    className="cursor-pointer block text-gray-500 text-5xl hover:text-gray-700 hover:underline"
                    onClick={() => setStep(1)}
                  >
                    ←
                  </button>
                </div>
              </form>
            </>
          )}

          {error && (
            <div className="mt-4 text-red-500">Error: {error}</div>
          )}
          {loading && (
            <div className="mt-4 text-gray-500">Cargando...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;