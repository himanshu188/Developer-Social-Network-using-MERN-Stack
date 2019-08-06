import { TEST_DISPATCH } from './types';

// register
export const registerUser = (userData) => {
  return {
    type: TEST_DISPATCH,
    payload: userData
  }
}
