import { useSelector } from 'react-redux';
import { selectAuthRoleFlags } from '../Store/selectors/authRole';

/** Redux-backed seller/admin flags (kept in sync when userdata is saved). */
export function useAuthRole() {
  return useSelector(selectAuthRoleFlags);
}
