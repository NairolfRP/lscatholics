export const APPLICATION_TYPE = {} as const;
export type ApplicationType = (typeof APPLICATION_TYPE)[keyof typeof APPLICATION_TYPE];
