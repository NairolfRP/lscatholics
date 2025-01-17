export interface Job {
    id: number;
    created_at: string;
    updated_at: string;
    is_open: boolean;
    expiration: string;
    title: string;
    description: string;
    requirements: string;
    category: number;
    organization: string;
    location: string;
    wage: string;
}
