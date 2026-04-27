import { UserLite } from '../types';

export const USERS: UserLite[] = [
  { id: 'user_001', name: 'Claire Dubois', initials: 'CD', color: '#7C3AED' },
  { id: 'user_002', name: 'Marc Lambert', initials: 'ML', color: '#F59E0B' },
  { id: 'user_003', name: 'Sophie Martin', initials: 'SM', color: '#10B981' },
  { id: 'user_004', name: 'Julien Bernard', initials: 'JB', color: '#EF4444' },
  { id: 'user_005', name: 'Léa Petit', initials: 'LP', color: '#3B82F6' },
];

export const ME_ID = 'user_001';

export const findUser = (id?: string): UserLite | undefined => (id ? USERS.find(u => u.id === id) : undefined);
