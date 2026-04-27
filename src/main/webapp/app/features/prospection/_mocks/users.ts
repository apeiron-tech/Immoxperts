import { User } from '../types';

export const users: User[] = [
  { user_id: 'user_paul', prenom: 'Paul', nom: 'Martin', color: '#7C3AED' },
  { user_id: 'user_clara', prenom: 'Clara', nom: 'Dubois', color: '#EC4899' },
  { user_id: 'user_mehdi', prenom: 'Mehdi', nom: 'Amar', color: '#F59E0B' },
  { user_id: 'user_alice', prenom: 'Alice', nom: 'Girard', color: '#10B981' },
  { user_id: 'user_sophie', prenom: 'Sophie', nom: 'Leroy', color: '#3B82F6' },
  { user_id: 'user_thomas', prenom: 'Thomas', nom: 'Bernard', color: '#EF4444' },
  { user_id: 'user_emilie', prenom: 'Émilie', nom: 'Rossi', color: '#8B5CF6' },
];

export const currentUser: User = users[0];

export const getUserById = (id?: string): User | undefined => {
  if (!id) return undefined;
  return users.find(u => u.user_id === id);
};
