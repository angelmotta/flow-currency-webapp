import { useEffect } from "react"

const loadScript = (src: string) => {
    return new Promise<void>((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) return resolve()
        const script = document.createElement('script')
        script.src = src
        script.onload = () => resolve()
        script.onerror = (err) => reject(err)
        document.body.appendChild(script)
    })
}
  

export default function GoogleAuth() {
  useEffect(() => {
    const urlScript = 'https://accounts.google.com/gsi/client'

    loadScript(urlScript)
      .then(() => {
        /* global google */
        google.accounts.id.initialize({
          client_id: "535433429806-oc8egpmgdvuot4bic0pc900q3pl3i7rv.apps.googleusercontent.com",
          callback: handleCredentialResponse,
        })
        google.accounts.id.renderButton(
            document.getElementById("signInDiv"),
            { theme: "outline", size: "large", text: "continue_with", shape: "rectangular" }
        )
      })
      .catch(console.error)

    // return () => {
    //   const scriptTag = document.querySelector(`script[src="${urlScript}"]`)
    //   if (scriptTag) document.body.removeChild(scriptTag)
    // }
  }, [])

  
  function handleCredentialResponse(response: any) {
    console.log('Encoded JWT ID token: ' + response.credential)
  }

  return <div id="signInDiv"></div>
}
