import DefaultLayout from "../layout/DefaultLayout"
import { useEffect } from "react"
import { useState } from "react";
import { useAuth } from "../auth/AuthProvider"
import { Navigate } from "react-router-dom";
import { AUTH_API_URL } from "../auth/constants";
import { AuthResponseError } from "../types/types";

export default function Login() {
    const [errorResponse, setErrorResponse] = useState("");

    // If is already authenticated, redirect to dashboard
    const auth = useAuth();
    
    // If not, render the login page
    const handleCredentialResponse = async (response: any) => {
        console.log("Google ID token: " + response.credential)
        // send post http request to backend using fetch and handle response body using async await and try catch
        try {
            const responseAuth = await fetch(`${AUTH_API_URL}/login/google`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }, 
                body: JSON.stringify({ credential: response.credential }),
            });
            // if response is ok
            if (responseAuth.ok) {
                console.log(`token successfully verified by backend`);
                const res = await responseAuth.json();
                console.log(res);
                // Save user data
                auth.saveUserData(res);     // State navigate to dashboard
            } else {
                // Get error message
                // If 400 series error, token is invalid
                console.log(`Received status: ${responseAuth.status}`);
                console.log(`Received text: ${responseAuth.statusText}`);
                const res = (await responseAuth.json()) as AuthResponseError;
                console.log(res.error)
                setErrorResponse(res.error);   // Show error message to user
            }
        } catch (error) {
            console.log("Fetch error: something went wrong");
            console.log(error);
            setErrorResponse("Servicio no disponible: intentalo nuevamente en unos minutos");   // Flow App auth service is down
        }
    }

    useEffect(() => {
        const onPageLoad = () => {
            /* global google */
            google.accounts.id.initialize({
                client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                callback: handleCredentialResponse,
            });

            google.accounts.id.renderButton(
                document.getElementById("signInDiv"),
                { theme: "outline", size: "large", shape: "rectangular"}
            );
        }
        if (document.readyState === 'complete') {
            onPageLoad();
        } else {
            window.addEventListener('load', onPageLoad);
            // Remove the event listener when component unmounts
            return () => window.removeEventListener('load', onPageLoad);
        }

    }, [])

    if (auth.isAuthenticated) {
        return <Navigate to="/dashboard" />
    }

    return (
        <DefaultLayout>
            <h1>Flow App</h1>
            <h2>Iniciar Sesión</h2>
            {errorResponse && <div className="errorMessage">{errorResponse}</div>}
            <div id="signInDiv"></div>
        </DefaultLayout>
    )
}
