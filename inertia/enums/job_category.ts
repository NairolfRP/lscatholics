export const JOB_CATEGORY = {
    ARCHDIOCESAN: 0,
    PARISH: 1,
    CEMETERIES: 2,
    SCHOOL: 3,
} as const;
export type JobCategory = (typeof JOB_CATEGORY)[keyof typeof JOB_CATEGORY];
