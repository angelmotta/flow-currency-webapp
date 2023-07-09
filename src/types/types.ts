export interface AuthResponse {
    body: {
        email: string;
        role: string;
        token: string;
    }
}

export interface AuthResponseError {
    error: string;
}