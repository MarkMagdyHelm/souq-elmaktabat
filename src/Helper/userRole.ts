/** API role value for end customers (buyers). All other roles are treated as sellers. */
export const CUSTOMER_ROLE = 'Customer' as const;

export type UserRoleName = typeof CUSTOMER_ROLE | string;

export interface UserRoleSource {
  role?: UserRoleName | null;
  admin?: boolean | null;
}

export interface UserRoleFlags {
  isSeller: boolean;
  isAdmin: boolean;
}

/**
 * Derives role flags from API user fields.
 * - isSeller: false only when role is "Customer"; true for any other role.
 * - isAdmin: true only when admin is explicitly true.
 */
export function deriveUserRoleFlags(
  user: UserRoleSource | null | undefined,
): UserRoleFlags {
  const role = user?.role;
  console.log('deriveUserRoleFlags user = ', user);

  const isSeller = Boolean(role && role !== CUSTOMER_ROLE);
  const isAdmin = user?.admin === true;

  return { isSeller, isAdmin };
}
