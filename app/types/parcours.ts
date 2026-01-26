export interface parcours {
    title: string;
    level: string;
    description: string;
    file: File;
}

export interface parcoursResponse {
    success: boolean;
    data: parcours;
    message: string;
}

export interface parcoursError {
    success: boolean;
    message: string;
}

export interface parcoursRequest {
    title: string;
    level: string;
    description: string;
    file: File;
}
