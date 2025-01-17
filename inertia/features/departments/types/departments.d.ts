import type { StaffListProps } from "@/features/departments/types/staffList";

export interface IDepartmentList {
    name: string;
    link?: string;
    isExternalLink?: boolean;
    page?: StaffListProps;
}
