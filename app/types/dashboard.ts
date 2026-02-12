export interface DashboardData {
    users: {
        total: number;
        active: number;
        verified: number;
        admin: number;
        subAccounts: number;
        withSubscription: number;
    };
    learningPaths: number;
    levels: number;
    steps: number;
    lessons: number;
    exercises: number;
    stepQuizzes: number;
}

export interface DashboardResponse {
    success: boolean;
    data: DashboardData;
}
