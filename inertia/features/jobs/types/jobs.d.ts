export interface Job {
    id: number;
    createdAt: string;
    updatedAt: string;
    isOpen: boolean;
    expiration: string;
    title: string;
    description: string;
    requirements: string;
    category: number;
    organization: string;
    location: string;
    wage: string;
}
