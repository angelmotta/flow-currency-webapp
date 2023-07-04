import DefaultLayout from "../layout/DefaultLayout"
import { useEffect } from "react"
import { useAuth } from "../auth/AuthProvider"
import { Navigate } from "react-router-dom";

// Bug found to render Google button (first approach to remember myself about it)
// export default function Login() {

//     const handleCredentialResponse = (response: any) => {
//         console.log("Encoded JWT ID token: " + response.credential)
//     }

//     useEffect(() => {
//         /* global google */
//         google.accounts.id.initialize({
//             client_id: "535433429806-oc8egpmgdvuot4bic0pc900q3pl3i7rv.apps.googleusercontent.com",
//             callback: handleCredentialResponse,
//         });

//         google.accounts.id.renderButton(
//             document.getElementById("signInDiv"),
//             { theme: "outline", size: "large", text: "continue_with", shape: "rectangular" }
//         );

//     }, [])

//     return (
//         <DefaultLayout>
//             <h1>Flow App</h1>
//             <h2>Tu casa de cambio al mejor precio</h2>
//             <div id="signInDiv"></div>
//         </DefaultLayout>
//     )
// }

// Version 2
export default function Login() {
    // If is already authenticated, redirect to dashboard
    const auth = useAuth();
    if (auth.isAuthenticated) {
        return <Navigate to="/dashboard" />
    }

    // If not, render the login page
    const handleCredentialResponse = (response: any) => {
        console.log("Encoded JWT ID token: " + response.credential)
        // TODO: Handle response
        auth.saveUserData(response.credential);
        
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

    return (
        <DefaultLayout>
            <h1>Flow App</h1>
            <h2>Tu casa de cambio al mejor precio</h2>
            <div id="signInDiv"></div>
        </DefaultLayout>
    )
}


// Approach with no error in frontend (show internally using try catch)
// export default function Login() {
//     return (
//         <DefaultLayout>
//             <h1>Flow App</h1>
//             <h2>Tu casa de cambio al mejor precio</h2>
//             <GoogleAuth></GoogleAuth>
//         </DefaultLayout>
//     )
// }