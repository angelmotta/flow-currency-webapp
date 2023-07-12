import DefaultLayout from "../layout/DefaultLayout"
import { useState } from "react";
import { AUTH_API_URL } from "../auth/constants";
import { useAuth } from "../auth/AuthProvider"
import { Navigate, useNavigate } from "react-router-dom";
import { AuthResponse, AuthResponseError } from "../types/types";

export default function SignupUser() {
    const [dni, setDni] = useState("");
    const [nombre, setNombre] = useState("");
    const [apellidop, setApellidop] = useState("");
    const [apellidom, setApellidom] = useState("");
    const [direccion, setDireccion] = useState("");
    const [errorResponse, setErrorResponse] = useState("");

    const auth = useAuth();

    async function handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
        e.preventDefault();
        console.log("Data from signup form:");
        console.log(dni, nombre, apellidop, apellidom, direccion);
    
        try {
          const response = await fetch(`${AUTH_API_URL}/signup/user`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `${auth.externalToken}`,
            },
            
            body: JSON.stringify({ dni, nombre, apellidop, apellidom, direccion }),
          });
          if (response.ok) {
            const json = (await response.json()) as AuthResponse;
            console.log(json);
            auth.saveUserData(json);    // Navigate to dashboard
          } else {
            const json = (await response.json()) as AuthResponseError;
            setErrorResponse(json.error);
          }
        } catch (error) {
          console.log(error);
        }
    }

    if (auth.isAuthenticated) {
        return <Navigate to="/dashboard" />;
    }

    return (
        <DefaultLayout>
            <h1>Flow App</h1>
            <h2>Crea tu cuenta</h2>
            <form onSubmit={handleSubmit} className="form">
                {errorResponse && <div className="errorMessage">{errorResponse}</div>}
                <label>DNI</label>
                <input
                    type="text"
                    name="dni"
                    onChange={(e) => setDni(e.target.value)}
                    value={dni}
                />
                <label>Nombre</label>
                <input
                    type="text"
                    name="nombre"
                    onChange={(e) => setNombre(e.target.value)}
                    value={nombre}
                />
                <label>Apellido Paterno</label>
                <input
                    type="text"
                    name="apellidop"
                    onChange={(e) => setApellidop(e.target.value)}
                    value={apellidop}
                />
                <label>Apellido Materno</label>
                <input
                    type="text"
                    name="apellidom"
                    onChange={(e) => setApellidom(e.target.value)}
                    value={apellidom}
                />
                <label>Dirección</label>
                <input
                    type="text"
                    name="direccion"
                    onChange={(e) => setDireccion(e.target.value)}
                    value={direccion}
                />
                <button>Crear cuenta</button>
            </form>
        </DefaultLayout>
    )
}