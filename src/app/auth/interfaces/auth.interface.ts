export interface Auth {
    rut: string,
    name: string,
    surname: string,
    email: string,
    address: string,
    phone: string,
    city: string,
    role: number
}

export interface Role {
    id: number;
    role: string;
}

export interface User {
    id: string;
    name: string;
    surname: string;
    // probably more information
}