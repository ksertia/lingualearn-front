export type LessonSectionType =
  | 'introduction'
  | 'main'
  | 'transcript'
  | 'example'
  | 'example_audio'
  | 'key_points'

export type LessonContentType = 'text' | 'video' | 'audio' | 'pdf' | 'image'

export interface LessonBlock {
  id?: string
  order: number
  sectionType: LessonSectionType
  contentType: LessonContentType
  content: string
  createdAt?: string
  updatedAt?: string
}

export interface LessonContentPayload {
  title: string
  description?: string
  blocks: LessonBlock[]
  isActive?: boolean
}

export interface course {
    success: boolean;
     data: {
         id: string;
         title: string;
         content: string;
         videoUrl: string;
         stepId : string;
         stepTitle: string;
         stepIndex: number;
         status: 'locked' | 'unlocked'| 'started' | 'completed';
         progressValue: number;
         completedAt: string | null;
     };
}


export interface courseCreate {
    stepId: string;
    title: string;
    description?: string;
    contentType: 'audio' | 'video' | 'text' | 'pdf' | 'image';
    content: string;
    attachments: any[];
    isActive: boolean;
}

export interface courseUpdate extends Partial<courseCreate> {
     title: string;
     description?: string;
     contentType: 'audio' | 'video' | 'text' | 'pdf' | 'image';
     content: string;
     duration: number;
     order: number;
     isPublished: boolean;
     isActive: boolean;
}

export interface courseResponse {
    success: boolean;
    data: course;
}
