export interface StaffListLeaderProps {
    name: string;
    position: string;
    image?: string;
}

export interface StaffListCardProps extends StaffListLeaderProps {
    phone?: string;
    email?: string;
}

export interface StaffListSectionProps {
    title: string;
    cards: StaffListCardProps[];
}

export interface StaffListProps {
    children?: React.ReactNode;
    director: StaffListLeaderProps;
    sections: StaffListSectionProps[];
}
