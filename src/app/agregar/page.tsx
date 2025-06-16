"use client"
import Header from "@/components/Header";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react"; 



export default function Agregar() {
    const router = useRouter();

    useEffect(() => {
    const checkAuth = async () => {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");

        if (!accessToken) {
            router.push("/login");
            return;
        }

        try {
            const payload = JSON.parse(atob(accessToken.split(".")[1]));
            const currentTime = Math.floor(Date.now() / 1000);

            if (payload.exp < currentTime) {
                if (refreshToken) {
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
                    }
                } else {
                    localStorage.clear();
                    router.push("/login");
                }
            }
        } catch {
            localStorage.clear();
            router.push("/login");
        }
    };

    checkAuth();
}, [router]);

    


    // const [isVisible, setIsVisible] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        documentType: 3,
        documentNumber: "",
        rol: "conductor",
        address: "",
        birthDate: "",
        phoneNumber: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [message, setMessage] = useState("");


    interface FormData {
        name: string;
        username: string;
        documentType: number;
        documentNumber: string;
        rol: string;
        address: string;
        birthDate: string;
        phoneNumber: string;
        email: string;
        password: string;
        confirmPassword: string;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData((prev: FormData) => ({ ...prev, [id]: value }));
    };

    const goBack = () => {
        router.back();
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.username || !formData.documentNumber || !formData.email) {
            setMessage("Por favor, completa todos los campos obligatorios.");
            return;
        }

        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setMessage("Correo electrónico inválido.");
            return;
        }

        if (formData.password.length < 6) {
            setMessage("La contraseña debe tener al menos 6 caracteres.");
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setMessage("Las contraseñas no coinciden.");
            return;
        }

        let accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        if (!accessToken) {
            router.push("/login");
            return;
        }


        // Verifica si el token está expirado
        const payload = JSON.parse(atob(accessToken.split(".")[1]));
        const currentTime = Math.floor(Date.now() / 1000);

        if (payload.exp < currentTime && refreshToken) {
            try {
                const res = await fetch("https://backfleetguard360-10.onrender.com/api/auth/refresh", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ refreshToken }),
                });

                const data = await res.json();

                if (res.ok) {
                    accessToken = data.accessToken;
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
        }

        const payloadData = {
            name: formData.name,
            username: formData.username,
            documentType: Number(formData.documentType),
            documentNumber: formData.documentNumber,
            rol: formData.rol,
            address: formData.address,
            birthDate: formData.birthDate,
            phoneNumber: formData.phoneNumber,
            email: formData.email,
            password: formData.password,
        };

        try {
            setMessage("Conectando...");
            const response = await fetch("https://backfleetguard360-10.onrender.com/api/driver/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                },
                body: JSON.stringify(payloadData),
            });

            if (response.ok) {
                setMessage("Conductor registrado correctamente.");
                router.push("/admin");
                setFormData({
                    name: "",
                    username: "",
                    documentType: 3,
                    documentNumber: "",
                    rol: "conductor",
                    address: "",
                    birthDate: "",
                    phoneNumber: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                });
            } else {
                const errorData = await response.json();
                setMessage(`Error: ${errorData.message || "No se pudo registrar el conductor"}`);
            }
        } catch {
            setMessage("Error de red al registrar el conductor.");
        }
    };
    


    return (
        <div className="min-h-screen bg-gray-100">
            <Header userName={""} role="Administrador" />
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex flex-col">
                        <h2 className="text-2xl font-bold text-gray-800">Panel de administración</h2>
                        <p className="text-sm text-gray-600 mb-4">Gestiona la información de los conductores registrados en el sistema.</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm overflow-hidden p-8">
                    <div className="flex justify-between mb-10">
                        <div className="flex items-center justify-start">
                            <ArrowLeft className="w-5 h-5 mr-1  cursor-pointer" onClick={goBack}/>
                            <h2 className="text-2xl font-bold text-gray-800">Agregar empleado</h2>
                        </div>
                        <button className="cursor-pointer rounded-md bg-primary py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700" onClick={handleSubmit}>
                            Agregar
                        </button>
                    </div>

                    <div className="space-y-7">
                        <div className=" space-y-7 flex flex-col lg:flex-row lg:justify-around">
                            <div className="space-y-7">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                                    <input type="text" id="name" value={formData.name} onChange={handleChange} className={`mt-1 block w-full rounded-md shadow-sm border-2 ${formData.name.trim() === "" ? "border-red-500" : "border-green-300"}`} required />
                                </div>
                                <div>
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nombre de usuario</label>
                                    <input type="text" id="username" value={formData.username} onChange={handleChange} className={`mt-1 block w-full rounded-md shadow-sm border-2 ${formData.username.trim() === "" ? "border-red-500" : "border-green-300"}`} required />
                                </div>
                                <div>
                                    <label htmlFor="documentNumber" className="block text-sm font-medium text-gray-700">Documento de identidad</label>
                                    <input type="text" id="documentNumber" value={formData.documentNumber} onChange={handleChange} className={`mt-1 block w-full rounded-md shadow-sm border-2 ${formData.documentNumber.trim() === "" ? "border-red-500" : "border-green-300"}`} required />
                                </div>
                                <div>
                                    <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">Fecha de nacimiento</label>
                                    <input type="date" id="birthDate" value={formData.birthDate} onChange={handleChange} className={`mt-1 block w-full rounded-md shadow-sm border-2 ${formData.birthDate.trim() === "" ? "border-red-500" : "border-green-300"}`} required />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
                                    <input type="password" id="password" value={formData.password} onChange={handleChange} className={`mt-1 block w-full rounded-md shadow-sm border-2 ${formData.password.trim() === "" ? "border-red-500" : "border-green-300"}`} required />
                                </div>
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirmar contraseña</label>
                                    <input type="password" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className={`mt-1 block w-full rounded-md shadow-sm border-2 ${formData.confirmPassword.trim() === "" ? "border-red-500" : "border-green-300"}`} required />
                                </div>
                            </div>

                            <div className="space-y-7">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo electrónico</label>
                                    <input type="email" id="email" value={formData.email} onChange={handleChange} className={`mt-1 block w-full rounded-md shadow-sm border-2 ${formData.email.trim() === "" ? "border-red-500" : "border-green-300"}`} required />
                                </div>
                                <div>
                                    <label htmlFor="documentType" className="block text-sm font-medium text-gray-700">Tipo de documento</label>
                                    <select id="rol" value={formData.rol} onChange={handleChange} required className={`mt-1 block w-full rounded-md shadow-sm border-2 ${formData.rol.trim() === "" ? "border-red-500" : "border-green-300"}`}>
                                        <option value="">1</option>
                                        <option value="ADMIN">2</option>
                                        <option value="conductor">3</option>
                                    </select>                                </div>
                                <div>
                                    <label htmlFor="rol" className="block text-sm font-medium text-gray-700">Rol</label>
                                    <select id="rol" value={formData.rol} onChange={handleChange} required className={`mt-1 block w-full rounded-md shadow-sm border-2 ${formData.rol.trim() === "" ? "border-red-500" : "border-green-300"}`}>
                                        <option value="">Selecciona un rol</option>
                                        <option value="ADMIN">Administrador</option>
                                        <option value="conductor">Conductor</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Teléfono</label>
                                    <input type="text" id="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className={`mt-1 block w-full rounded-md shadow-sm border-2 ${formData.phoneNumber.trim() === "" ? "border-red-500" : "border-green-300"}`} required />
                                </div>
                                <div>
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Dirección</label>
                                    <input type="text" id="address" value={formData.address} onChange={handleChange} className={`mt-1 block w-full rounded-md shadow-sm border-2 ${formData.address.trim() === "" ? "border-red-500" : "border-green-300"}`} required />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col space-y-4">
                            <div className="cursor-pointer flex justify-around lg:center space-x-2">
                                <button className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 hover:text-primary hover:border-primary w-50">
                                    Foto
                                </button>
                            </div>
                        </div>
                        {message && <p className="text-red-500 mt-4">{message}</p>}
                    </div>
                </div>
            </div>
            {/* {isVisible && <div className="p-4 bg-blue-100 rounded z-999">Este es el popup</div>} */}
        </div>
    );
}
