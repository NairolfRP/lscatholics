import type { HttpContext } from "@adonisjs/core/http";

import Job from "#models/job";
import { Str } from "../../shared/helpers/str.js";
import { bind } from "@adonisjs/route-model-binding";
import { dd } from "@adonisjs/core/services/dumper";
import { z } from "zod";

export default class JobController {
    private isExpiredJob(expiration: Date): boolean {
        return expiration < new Date(Date.now());
    }

    private async closeJobIfIsExpired(job: Job): Promise<boolean> {
        if (job.is_open && this.isExpiredJob(job.expiration.toJSDate())) {
            try {
                job.is_open = false;
                await job.save();
                return true;
            } catch (e) {
                throw Error(`Error when trying to close an expired job: ${e}`);
            }
        }
        return false;
    }

    @bind()
    public async show({ response, inertia }: HttpContext, job: Job, slug: string) {
        const validSlug = Str.slug(job.title);

        if (validSlug !== slug) {
            return response.redirect().toPath(`/job/${job.id}/${validSlug}`);
        }

        await this.closeJobIfIsExpired(job);

        return inertia.render("SingleJob", { job });
    }

    public async showAll({ inertia }: HttpContext) {
        const jobs = await Job.query()
            .where("is_open", true)
            .where("expiration", ">=", Date.now())
            .orderBy("created_at")
            .select(["id", "title", "category", "organization", "location", "created_at"]);

        return inertia.render("Jobs", { jobs });
    }

    @bind()
    public async showApplication({ session, response, inertia }: HttpContext, job: Job) {
        if (await this.closeJobIfIsExpired(job)) {
            session.flash("notification", {
                variant: "error",
                message: "Sorry, this job opportunity is closed.",
            });
            return response.redirect().back();
        }

        return inertia.render("ApplyJob/ApplyJob", { job });
    }

    @bind()
    public async submitApplication({ request }: HttpContext, _job: Job) {
        const validationSchema = z.object({
            firstname: z
                .string()
                .min(1, { message: "Firstname is required" })
                .max(50, { message: "Firstname must not exceed 50 characters." }),
            lastname: z
                .string()
                .min(1, { message: "Lastname is required" })
                .max(50, { message: "Lastname must not exceed 50 characters." }),
            phone: z
                .string()
                .min(1, { message: "Phone is required" })
                .regex(/^\d+$/, { message: "Phone must only contain digits" })
                .min(3, { message: "Phone must contain at least 3 digits" })
                .max(20, { message: "Phone must not exceed 20 digits" }),
            address: z.string().min(1, { message: "Address is required" }),
        });

        const validation = await request.validate(validationSchema);

        dd(validation);
    }
}
