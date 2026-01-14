
export interface Guest {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  status: 'pending' | 'confirmed' | 'declined';
  plusOne: boolean;
  message?: string;
  invitedAt: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface WeddingInfo {
  groom: string;
  bride: string;
  date: string;
  location: string;
  story: string;
}

export interface InvitationMessage {
  content: string;
  type: 'classic' | 'modern' | 'poetic';
}
