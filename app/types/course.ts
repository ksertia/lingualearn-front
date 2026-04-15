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
    description: string;
    contentType: 'audio' | 'video' | 'text' | 'pdf';
    contentUrl: string;
    duration: number;
    order: number;
    isPublished: boolean;
    isActive: boolean;
}

export interface courseUpdate extends Partial<courseCreate> {
     title: string;
     description: string;
     contentType: 'audio' | 'video' | 'text' | 'pdf';
     contentUrl: string;
     duration: number;
     order: number;
     isPublished: boolean;
     isActive: boolean;
}

export interface courseResponse {
    success: boolean;
    data: course;
}
