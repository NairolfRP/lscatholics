import ArchbishopPortrait from "@/assets/images/francisco_lopez_official_portrait.png";
import { DepartmentList } from "@/features/departments/types/departments";

export const departments: DepartmentList[] = [
    {
        name: "archbishop_office",
        link: "archbishop-office",
        page: {
            director: {
                name: "Mgr. Francisco J. Lopez",
                position: "archbishop_of_ls",
                image: ArchbishopPortrait,
            },
            sections: [
                {
                    title: "office_of_archbishop_team",
                    cards: [
                        {
                            name: "Alesia Ubaldi",
                            position: "executive_assistant_f",
                            phone: "700",
                        },
                    ],
                },
            ],
        },
    },
    {
        name: "catholic_charities",
        link: "catholic-charities",
        page: {
            director: {
                name: "N/A",
                position: "executive_director",
            },
            sections: [],
        },
    },
    {
        name: "chancellor",
        link: "chancellor",
        page: {
            director: {
                name: "N/A",
                position: "chancellor",
            },
            sections: [],
        },
    },
    {
        name: "clergy",
    },
    {
        name: "communications",
        link: "communications",
        page: {
            director: {
                name: "N/A",
                position: "vice_chancellor_communications",
            },
            sections: [],
        },
    },
    {
        name: "ethnic_ministry",
        link: "ethnic-ministry",
        page: {
            director: {
                name: "N/A",
                position: "vicar_of_ethnic_ministry",
            },
            sections: [],
        },
    },
    {
        name: "financial_services",
        link: "financial-services",
        page: {
            director: {
                name: "N/A",
                position: "chief_financial_officer",
            },
            sections: [],
        },
    },
    {
        name: "human_resources",
        link: "human-resources",
        page: {
            director: {
                name: "N/A",
                position: "senior_director_of_human_resources",
            },
            sections: [],
        },
    },
    {
        name: "legal_counsel",
        link: "legal-counsel",
        page: {
            director: {
                name: "N/A",
                position: "general_counsel",
            },
            sections: [],
        },
    },
    {
        name: "ecclesiastical_court",
        link: "ecclesiastical-court",
        page: {
            director: {
                name: "N/A",
                position: "judicial_vicar",
            },
            sections: [],
        },
    },
    {
        name: "moderator_of_the_curia",
        link: "moderator-of-the-curia",
        page: {
            director: {
                name: "N/A",
                position: "moderator_of_the_curia",
            },
            sections: [],
        },
    },
    {
        name: "sanctus_news",
        link: "sanctus-news",
        page: {
            director: {
                name: "Pablo Kay (( PNJ ))",
                position: "editor_in_chief",
            },
            sections: [],
        },
    },
];
