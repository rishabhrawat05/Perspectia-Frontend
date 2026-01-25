import api from './api';

const PERSPECTIVE_BASE = '/api/perspectia/perspective';
const TOPIC_BASE = '/api/perspectia/topic';

export interface Topic {
  id: string;
  content: string;
}

export interface PerspectiveRequest {
  topicId: string;
  userId: string;
  content: string;
}

export interface PerspectiveResponse {
  id: string;
  topicId: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface AISummaryResponse {
  id: string;
  topic: string;
  summaryText: string;
  modelUsed: string;
  generatedAt: string;
}

export const perspectiveApi = {
  // Create a new perspective
  createPerspective: async (perspectiveData: PerspectiveRequest): Promise<PerspectiveResponse> => {
    const response = await api.post<PerspectiveResponse>(`${PERSPECTIVE_BASE}/create`, perspectiveData);
    return response.data;
  },

  // Get all perspectives with pagination
  getAllPerspectives: async (page: number = 0, size: number = 10, topicId?: string): Promise<PageResponse<PerspectiveResponse>> => {
    const response = await api.get<PageResponse<PerspectiveResponse>>(
      `${PERSPECTIVE_BASE}/get-all`,
      { params: { page, size, topicId } }
    );
    return response.data;
  },

  // Get latest topic
  getLatestTopic: async (): Promise<Topic> => {
    const response = await api.get<Topic>(`${TOPIC_BASE}/latest`);
    return response.data;
  },

  // Get latest AI summary
  getLatestAISummary: async (): Promise<AISummaryResponse> => {
    const response = await api.get<AISummaryResponse>('/api/perspectia/summary/latest');
    return response.data;
  },
};

export default perspectiveApi;
