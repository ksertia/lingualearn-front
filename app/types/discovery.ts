/* ===================== DISCOVERY LANGUAGES ===================== */

export interface DiscoveryLevel {
  id: string;
  languageId: string;
  code: string;
  name: string;
  description: string;
  index: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DiscoveryLanguage {
  id: string;
  code: string;
  name: string;
  description: string;
  iconUrl: string | null;
  isActive: boolean;
  index: number;
  createdAt: string;
  updatedAt: string;
  flagUrl: string | null;
  levels: DiscoveryLevel[];
}

export interface DiscoveryLanguagesResponse {
  success: boolean;
  data: DiscoveryLanguage[];
  message: string;
}

/* ===================== DISCOVERY SESSION ===================== */

export interface DiscoverySessionCreateResponse {
  success: boolean;
  data: {
    sessionId: string;
    message: string;
  };
}

/* ===================== DISCOVERY EXERCISE ===================== */

export interface ExerciseAnswer {
  questionId?: string;
  answerId?: string;
  answer?: string | number | boolean;
  [key: string]: any;
}

export interface SubmitExercisePayload {
  sessionId?: string;
  answers: Record<string, any>;
}

export interface SubmitExerciseResponse {
  success: boolean;
  data: {
    score?: number;
    isCorrect?: boolean;
    feedback?: string;
    [key: string]: any;
  };
}

/* ===================== DISCOVERY LESSON (ADMIN) ===================== */

export interface DiscoveryLessonAdmin {
  id: string;
  title: string;
  description?: string;
  languageCode: string;
  isPublished: boolean;
  thumbnail?: string | null;
  sections: DiscoverySection[];
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

export interface DiscoverySection {
  id: string;
  lessonId: string;
  title: string;
  description?: string;
  index: number;
  exercises: DiscoveryExerciseAdmin[];
  [key: string]: any;
}

export interface DiscoveryExerciseAdmin {
  id: string;
  sectionId: string;
  type: 'multiple_choice' | 'fill_blank' | 'matching' | 'text' | string;
  question: string;
  instructions?: string;
  index: number;
  content?: any;
  mediaFiles?: string[];
  [key: string]: any;
}

export interface CreateLessonPayload {
  lessonData: string | {
    title: string;
    description?: string;
    languageCode: string;
    sections?: DiscoverySection[];
  };
  thumbnail?: File;
  audioFiles?: File[];
  videoFiles?: File[];
  imageFiles?: File[];
}

export interface UpdateLessonPayload {
  lessonData?: string | any;
  thumbnail?: File;
}

export interface PublishLessonPayload {
  isPublished: boolean;
}

export interface UploadMediaResponse {
  success: boolean;
  data: {
    url: string;
    type: string;
    [key: string]: any;
  };
}

/* ===================== DISCOVERY SESSION ===================== */

/* ===================== DISCOVERY EXERCISE (GET) ===================== */

export interface DiscoveryExercise {
  id: string;
  type: 'multiple_choice' | 'text' | 'matching' | 'fill_blank' | string;
  title: string;
  description?: string;
  question?: string;
  options?: {
    id: string;
    label: string;
    isCorrect?: boolean;
  }[];
  sessionId?: string;
  [key: string]: any;
}

export interface DiscoveryExercisesResponse {
  success: boolean;
  data: DiscoveryExercise[];
  message?: string;
}

/* ===================== DISCOVERY SCORE ===================== */

export interface DiscoverySessionScore {
  success: boolean;
  data: {
    sessionId: string;
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    [key: string]: any;
  };
}
