import type { HttpContext } from "@adonisjs/core/http";

export default class DepartmentController {
    private availableDepartments: string[] = [
        "archbishop-office",
        "catholic-charities",
        "chancellor",
        "communications",
        "ethnic-ministry",
        "financial-services",
        "human-resources",
        "legal-counsel",
        "ecclesiastical-court",
        "moderator-of-the-curia",
        "sanctus-news",
    ] as const;

    public show({ params, response, inertia }: HttpContext) {
        const { department } = params as { department: string };

        if (!this.availableDepartments.includes(department))
            return response.abort("This department does not exist or has not been found", 404);

        return inertia.render("SingleDepartment", { department });
    }
}
