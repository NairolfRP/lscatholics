export const JOB_CATEGORY_COLOR = {
    ARCHDIOCESAN: "#db9b24",
    PARISH: "#e3550a",
    CEMETERIES: "#328fcc",
    SCHOOL: "inherit",
} as const;
export type JobCategoryColor = (typeof JOB_CATEGORY_COLOR)[keyof typeof JOB_CATEGORY_COLOR];
