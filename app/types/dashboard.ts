export interface DashboardStats {
  totalUsers: number;
  newUsers: number;
  inactiveUsers: number;
}

export interface LanguageData {
  label: string;
  data: number;
  backgroundColor: string;
}

export interface UserLevelData {
  label: string;
  data: number[];
  backgroundColor: string;
}

export interface DashboardResponse {
  stats: DashboardStats;
  languages: LanguageData[];
  userLevels: UserLevelData[];
}
