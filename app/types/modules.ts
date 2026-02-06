export interface module {
    id: string;
    title: string;
    description: string;
    levelId:string;
    iconUrl:string;
    index: 0;
    isActive:boolean;
}

export interface moduleResponse {
    success: boolean;
    data: module;
    message: string;
}

export interface moduleError {
    success: boolean;
    message: string;
}

export interface moduleRequest {
    levelId:string;
    title: string;
    description: string;
    iconUrl:string;
    index: 0;
    isActive:boolean;
    }