export interface User {
    iduser : number;
    username : string;
    password? : string;
    idrole? : number;
    role_name? : string;
}

export interface Role {
    idrole : number;
    nama_role : string;
}

export interface ApiResponse<T>{
    status: number;
    data?: T;
    error?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
}