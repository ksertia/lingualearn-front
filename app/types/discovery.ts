// ─── Enums ────────────────────────────────────────────────────────────────────

export type ContentMediaType = 'text' | 'audio' | 'image' | 'video' | 'file';
export type SectionType = 'lesson' | 'exercise';

// ─── Content ──────────────────────────────────────────────────────────────────

export interface DiscoverContentOption {
    value: string;
    isCorrect: boolean;
    order?: number;
}

export interface DiscoverContent {
    id?: string;
    order?: number;
    questionType: ContentMediaType;
    questionValue: string;
    answerType?: ContentMediaType;
    answerValue?: string;
    options?: DiscoverContentOption[];
}

// ─── Section ──────────────────────────────────────────────────────────────────

export interface DiscoverSection {
    id?: string;
    title: string;
    type: SectionType;       // 'lesson' | 'exercise'
    language: string;        // ex: "Wolof"
    contents: DiscoverContent[];
}

// ─── Requests ─────────────────────────────────────────────────────────────────

export interface CreateDiscoverSectionRequest {
    title: string;
    type: SectionType;
    language: string;
}

export interface UpdateDiscoverSectionRequest extends Partial<CreateDiscoverSectionRequest> {}

export interface CreateDiscoverContentRequest {
    order?: number;
    questionType: ContentMediaType;
    questionValue: string;
    answerType?: ContentMediaType;
    answerValue?: string;
    options?: DiscoverContentOption[];
}

export interface UpdateDiscoverContentRequest extends Partial<CreateDiscoverContentRequest> {}

// ─── Legacy ───────────────────────────────────────────────────────────────────

export interface DiscoveryLanguage {
    id: string;
    code: string;
    name: string;
}

export interface SubmitExercisePayload {
    answers: Record<string, any>;
}

/** @deprecated */
export interface DiscoverExercise {
    title: string;
    type?: 'audio' | 'video' | 'qcm' | 'dragdrop';
    mediaUrl?: string;
    text?: string;
    translation?: string;
    duration?: number;
    hint?: string;
    description?: string;
    question?: string;
    choices?: string[];
    correctAnswer?: string;
    dragItems?: string[];
    dropZones?: string[];
    imageUrl?: string;
}

/** @deprecated */
export interface CreateDiscoverLessonRequest {
    title: string;
    description: string;
    languageCode: string;
    level: string;
    sections: DiscoverSection[];
}

/** @deprecated */
export interface UpdateDiscoverLessonRequest extends Partial<CreateDiscoverLessonRequest> {}

/** @deprecated */
export interface DiscoverLesson {
    id: string;
    title: string;
    description: string;
    languageCode: string;
    level: string;
    sections: DiscoverSection[];
    published: boolean;
    thumbnail?: string;
    createdAt: string;
    updatedAt: string;
}