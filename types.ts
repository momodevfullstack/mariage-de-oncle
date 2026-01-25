
export type GuestRelation = 
  | 'Collaborateur'
  | 'Ami'
  | 'Connaissance'
  | 'Famille'
  | 'Patron'
  | 'Collègue'
  | 'Pasteur'
  | 'Frere/soeur eglise';

export interface Guest {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  status: 'pending' | 'confirmed' | 'declined';
  plusOne: boolean;
  relation?: GuestRelation;
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
