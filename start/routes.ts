/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from "@adonisjs/core/services/router";
import { middleware } from "#start/kernel";

const WelcomeController = () => import("#controllers/welcome_controller");
const DepartmentController = () => import("#controllers/department_controller");
const ContactController = () => import("#controllers/contact_controller");
const JobController = () => import("#controllers/job_controller");
const EventController = () => import("#controllers/event_controller");
const ProfileController = () => import("#controllers/profile_controller");
const AuthController = () => import("#controllers/auth_controller");
const ApplicationController = () => import("#controllers/application_controller");
const DonateController = () => import("#controllers/donate_controller");
const PaymentController = () => import("#controllers/payment_controller");

router.get("/", [WelcomeController, "show"]);

router.on("/about-us").renderInertia("About");

router.on("/archbishop").renderInertia("Archbishop");

router
    .group(() => {
        router.on("/").renderInertia("Departments");

        router.get(":department", [DepartmentController, "show"]);
    })
    .prefix("/departments");

router.on("/handbook").renderInertia("Handbook");

router.on("/privacy").renderInertia("PrivacyPolicy");

router.get("/contact", [ContactController, "show"]);

router.post("/contact", [ContactController, "submit"]);

router.on("/prayers").renderInertia("Prayers");

router.on("/volunteer").renderInertia("Volunteer");

router.get("/donate", [DonateController, "show"]);
router.post("/donate", [DonateController, "submit"]);

router.get("/jobs", [JobController, "showAll"]);

router
    .group(() => {
        router
            .get("/:job/:slug", [JobController, "show"])
            .where("job", router.matchers.number())
            .where("slug", router.matchers.slug());
        router
            .get("/apply/:job", [JobController, "showApplication"])
            .where("job", router.matchers.number());
        router
            .post("/apply/:job", [JobController, "submitApplication"])
            .where("job", router.matchers.number());
    })
    .prefix("job");

router
    .group(() => {
        router.on("/parishes").renderInertia("Find/Parishes");
        router.get("/events", [EventController, "showAll"]);
    })
    .prefix("find");

router.on("/daily-readings").renderInertia("DailyReadings");

router.on("/media").renderInertia("Media");

router
    .get("/event/:year/:month/:event/:slug", [EventController, "show"])
    .where("year", router.matchers.number())
    .where("month", router.matchers.number())
    .where("event", router.matchers.number())
    .where("slug", router.matchers.slug());

router
    .group(() => {
        router.get("/profile", [ProfileController, "show"]);
        router.patch("/profile", [ProfileController, "update"]);
        router.delete("/profile", [ProfileController, "destroy"]);

        router.get("/applications", [ApplicationController, "showAll"]);
        router
            .get("/applications/:id", [ApplicationController, "show"])
            .where("id", router.matchers.number());
    })
    .use(middleware.auth());

router
    .group(() => {
        router.get("/:provider/redirect", [AuthController, "redirect"]);
        router.get("/:provider/callback", [AuthController, "callback"]);

        router
            .delete("/:provider/unlink", [AuthController, "unlink"])
            .where("provider", "^[a-zA-Z]+$")
            .use(middleware.auth());

        router
            .patch("/:provider/set-main", [AuthController, "setAsMain"])
            .where("provider", "^[a-zA-Z]+$")
            .use(middleware.auth());

        router.post("/logout", [AuthController, "logout"]).use(middleware.auth());
    })
    .prefix("/api/auth");

router
    .group(() => {
        router.post("/cancel", [PaymentController, "cancel"]);
    })
    .prefix("/api/payment");

router
    .group(() => {
        router
            .get("/callback/:token", [PaymentController, "callback"])
            .where("token", /^[a-zA-Z0-9-_]{30,}$/);
    })
    .prefix("/fleeca");
