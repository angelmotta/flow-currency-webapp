export interface AuthResponse {
    body: {
        token: string;
        email: string;
        role: string;
    }
}

export interface AuthResponseError {
    error: string;
}

export interface CurrencyRateResponse {
    srcCurrency: string;
    dstCurrency: string;
    rate: string;
}