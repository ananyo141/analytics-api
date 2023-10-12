import { atomWithStorage } from 'jotai/utils';

export const userAtom = atomWithStorage('user', {
  accessToken: null,
  isAuthenticated: false,
});
