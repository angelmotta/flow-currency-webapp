import DefaultLayout from "../layout/DefaultLayout"
import { useState, useEffect } from "react";
import { CURRENCY_API_URL } from "../auth/constants";
import { CurrencyRateResponse } from "../types/types";

export default function Dashboard() {
    const [data, setData] = useState("");


    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch(`${CURRENCY_API_URL}/usd/pen`);
            if (response.ok) {
                const jsonData = await response.json() as CurrencyRateResponse;
                console.log(jsonData);
                console.log(jsonData.rate)
                setData(jsonData.rate);
            } else {
                const errorResponse = await response.json();
                console.log(errorResponse);
            }
          } catch (error) {
            console.error('Error:', error);
          }
        };
        fetchData();
      }, []);

    async function handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
        e.preventDefault();
        console.log("Iniciar operacion");
    }

    
    return (
        <DefaultLayout>
            <h1>Flow App</h1>
            <h2>Tipo de cambio hoy</h2>
            <form onSubmit={handleSubmit} className="form">
                <label>Venta:</label>
                <div>
                    {data ? (
                        <div>
                        <pre>{data}</pre>
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
                <button>Iniciar operacion</button>
            </form>
        </DefaultLayout>
    )
}