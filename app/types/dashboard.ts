export interface DashboardData {
    users: {
        total: number;
        active: number;
        verified: number;
        admin: number;
        subAccounts: number;
        user: number;
        withSubscription: number;
    };
    learningPaths: number;
    levels: number;
    steps: number;
    lessons: number;
    exercises: number;
    stepQuizzes: number;
}

export interface StatTotalData {
    total: number;
}

export interface StatTotalResponse {
    success: boolean;
    data: StatTotalData | number;
}

export interface UsersTotalParams {
    startDate?: string;
    endDate?: string;
    userType?: string;
    isActive?: boolean;
    isVerified?: boolean;
    withSubscription?: boolean;
}
