// copy pasted from @nestjs/common/utils/is-uuid.js, as it's not exported from Nest
export const uuidV4Pattern = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

export const isUUIDv4 = (input: string): boolean => uuidV4Pattern.test(input);
