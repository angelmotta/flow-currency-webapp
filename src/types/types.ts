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