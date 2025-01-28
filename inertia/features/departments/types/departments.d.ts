import type { StaffListProps } from "@/features/departments/types/staff_list";

export interface IDepartmentList {
    name: string;
    link?: string;
    isExternalLink?: boolean;
    page?: StaffListProps;
}
