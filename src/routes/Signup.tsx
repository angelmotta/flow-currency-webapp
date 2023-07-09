import DefaultLayout from "../layout/DefaultLayout"
import { useEffect } from "react"
import { useState } from "react";
import { AUTH_API_URL } from "../auth/constants";
import { useAuth } from "../auth/AuthProvider"
import { Navigate, useNavigate } from "react-router-dom";
import { AuthResponseError } from "../types/types";

export default function Signup() {
    const [errorResponse, setErrorResponse] = useState("");

    const auth = useAuth();
    const goTo = useNavigate();

    // If not, render the login page
    const handleCredentialResponse = async (response: any) => {
        console.log("Google ID token: " + response.credential)
        // Send post request
        try {
            const responseAuth = await fetch(`${AUTH_API_URL}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }, 
                body: JSON.stringify({ credential: response.credential }),
            });
            // if response is ok
            if (responseAuth.ok) {
                console.log(`user successfully registered`);
                const res = await responseAuth.json();
                console.log(res);
                // Save user data
                auth.saveUserData(responseAuth);     // Navigate to dashboard
                // TODO: Request user data (DNI, name, last name, home address, phone number) to complete registration)
                // Navigate to Create account page
            } else {
                // User already exists (409: conflict)
                console.log(`Received status: ${responseAuth.status}`);
                const res = (await responseAuth.json()) as AuthResponseError;
                console.log(res.error)
                setErrorResponse(res.error);   // Show error message to user
            }
        } catch (error) {
            console.log("Fetch error: something went wrong");
            console.log(error);
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
                document.getElementById("signUpDiv"),
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
        return <Navigate to="/dashboard" />;
    }

    return (
        <DefaultLayout>
            <h1>Flow App</h1>
            <h2>Registrate</h2>
            {errorResponse && <div className="errorMessage">{errorResponse}</div>}
            <div id="signUpDiv"></div>
        </DefaultLayout>
    )
}