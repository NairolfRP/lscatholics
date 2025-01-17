export interface IStaffListLeader {
    name: string;
    position: string;
    image?: string;
}

export interface IStaffListCard extends IStaffListLeader {
    phone?: string;
    email?: string;
}

export interface IStaffListSection {
    title: string;
    cards: IStaffListCard[];
}

export interface StaffListProps {
    children?: React.ReactNode;
    director: IStaffListLeader;
    sections: IStaffListSection[];
}
