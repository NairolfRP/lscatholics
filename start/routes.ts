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

//router.get("/donate", [DonateController, "show"]);
//router.post("/donate", [DonateController, "submit"]);
//router.get("/donate/success", [DonateController, "success"]);

router
    .group(() => {
        router.get("/", [JobController, "showAll"]);
        router.get("/:job-:slug", [JobController, "show"]);
        router.get("/apply/:job", [JobController, "showApplication"]);
        router.post("/apply/:job", [JobController, "submitApplication"]);
    })
    .prefix("jobs");

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
    })
    .use(middleware.auth());

router
    .group(() => {
        /*router
            .group(() => {
                router.get("/redirect", async ({ ally }) => {
                    return ally.use("facebrower").stateless().redirect();
                });
                router.get("/callback", async ({ auth, session, request, ally }) => {
                    try {
                        const fb = ally.use("facebrower").stateless();

                        if (!request.input("auth_key")) {
                            throw Error("Auth key not found");
                        }

                        if (fb.accessDenied()) {
                            throw Error("You have cancelled the login process");
                        }

                        if (fb.hasError()) {
                            return fb.getError();
                        }

                        const fbUser = await fb.user();

                        if (!fbUser)
                            throw Error("Facebrowser OAuth: Failure to get user information");

                        const user = await User.firstOrCreate(
                            { facebrowser_id: fbUser.id },
                            {
                                name: fbUser.nickName,
                                facebrowser_id: fbUser.id,
                            },
                        );

                        if (!user) throw Error("Failed to find or create account");

                        await auth.use("web").login(user);

                        session.flash("notification", {
                            variant: "success",
                            message: "Successful login!",
                        });

                        return "<script>window.close()</script>";
                    } catch (e) {
                        console.error(e);
                        return "<script>window.close()</script>";
                    }
                });
            })
            .prefix("/api/auth/facebrowser");

        router
            .group(() => {
                router.get("/redirect", async ({ ally }) => ally.use("discord").redirect());
                router.get("/callback", async () => {});
            })
            .prefix("/api/auth/discord");*/

        router.get("/:provider/redirect", [AuthController, "redirect"]);
        router.get("/:provider/callback", [AuthController, "callback"]);

        router.post("/logout", [AuthController, "logout"]).use(middleware.auth());
    })
    .prefix("/api/auth");
