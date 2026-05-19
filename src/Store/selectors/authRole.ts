import { RootState } from '../store';

export const selectIsSeller = (state: RootState) => state.auth.isSeller;
export const selectIsAdmin = (state: RootState) => state.auth.isAdmin;

export const selectAuthRoleFlags = (state: RootState) => ({
  isSeller: state.auth.isSeller,
  isAdmin: state.auth.isAdmin,
});
