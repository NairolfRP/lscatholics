import { HeaderNavItem } from "@/features/navigation/types/navigation";

export const menuItems: HeaderNavItem[] = [
    {
        name: "home",
        link: "/",
    },
    {
        name: "about_our_community",
        items: [
            { name: "who_we_are", link: "/about-us" },
            {
                name: "archbishop_lopez",
                link: "/archbishop",
                items: [
                    {
                        name: "archbishop_office",
                        link: "/departments/archbishop-office"
                    },
                ],
            },
            {
                name: "departments",
                link: "/departments",
            },
            {
                name: "administrative_handbook",
                link: "/handbook",
            },
            {
                name: "privacy_policy",
                link: "/privacy",
            },
            {
                name: "contact_us",
                link: "/contact",
            },
        ],
    },
    {
        name: "get_involved",
        items: [
            {
                name: "prayers",
                link: "/prayers",
            },
            {
                name: "serve_your_community",
                link: "/volunteer",
            },
            {
                name: "donate",
                link: "/donate",
            },
            {
                name: "work_for_archdiocese",
                link: "/jobs",
            },
        ],
    },
    {
        name: "find",
        items: [
            {
                name: "find_parish",
                link: "/find/parishes",
            },
            {
                name: "find_event",
                link: "/find/events",
            },
            {
                name: "find_job",
                link: "/jobs",
            },
            {
                name: "find_daily_readings",
                link: "/daily-readings",
            },
        ],
    },
    {
        name: "news",
        items: [
            {
                name: "media_relations",
                link: "/media",
            },
        ],
    },
];
