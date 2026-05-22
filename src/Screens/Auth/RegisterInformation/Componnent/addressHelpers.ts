export const MAX_ADDRESSES = 5;

export const canAddAddress = (addresses?: any[]) =>
  (addresses?.length ?? 0) < MAX_ADDRESSES;

export const capAddresses = <T,>(addresses: T[]): T[] =>
  addresses.slice(0, MAX_ADDRESSES);
