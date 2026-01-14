// Service API pour communiquer avec le backend

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Guest {
  id?: string;
  name: string;
  email: string;
  status: 'pending' | 'confirmed' | 'declined';
  plusOne: boolean;
  message?: string;
  invitedAt?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  email: string;
  token: string;
  role: string;
}

// Fonction helper pour les appels API
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('admin_token');

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erreur serveur' }));
    throw new Error(error.message || `Erreur ${response.status}`);
  }

  return response.json();
}

// API Guests
export const guestAPI = {
  // Créer un nouvel invité (RSVP)
  create: async (guestData: Omit<Guest, 'id' | 'invitedAt'>): Promise<{ success: boolean; data: Guest }> => {
    return fetchAPI('/guests', {
      method: 'POST',
      body: JSON.stringify(guestData),
    });
  },

  // Récupérer tous les invités (Admin)
  getAll: async (): Promise<{ success: boolean; count: number; data: Guest[] }> => {
    return fetchAPI('/guests');
  },

  // Récupérer les statistiques (Admin)
  getStats: async (): Promise<{ success: boolean; data: { total: number; confirmed: number; declined: number; pending: number; withPlusOne: number } }> => {
    return fetchAPI('/guests/stats');
  },

  // Récupérer un invité par ID (Admin)
  getById: async (id: string): Promise<{ success: boolean; data: Guest }> => {
    return fetchAPI(`/guests/${id}`);
  },

  // Mettre à jour un invité (Admin)
  update: async (id: string, guestData: Partial<Guest>): Promise<{ success: boolean; data: Guest }> => {
    return fetchAPI(`/guests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(guestData),
    });
  },

  // Supprimer un invité (Admin)
  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    return fetchAPI(`/guests/${id}`, {
      method: 'DELETE',
    });
  },
};

// API Auth
export const authAPI = {
  // Connexion admin
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await authAPI.rawLogin(credentials);
    if (response.token) {
      localStorage.setItem('admin_token', response.token);
      localStorage.setItem('admin_email', response.email);
    }
    return response;
  },

  // Connexion sans stocker le token (pour le raw login)
  rawLogin: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Déconnexion
  logout: (): void => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_email');
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('admin_token');
  },

  // Récupérer le token
  getToken: (): string | null => {
    return localStorage.getItem('admin_token');
  },

  // Récupérer l'utilisateur connecté
  getMe: async (): Promise<{ success: boolean; data: { email: string; role: string } }> => {
    return fetchAPI('/auth/me');
  },
};

export type { Guest, LoginCredentials, AuthResponse };

