import type { JobCategory } from "@/enums/job_category";

export interface Job {
    id: number;
    createdAt: string;
    updatedAt: string;
    isOpen: boolean;
    expiration: string;
    title: string;
    description: string;
    requirements: string;
    category: JobCategory;
    organization: string;
    location: string;
    wage: string;
}
