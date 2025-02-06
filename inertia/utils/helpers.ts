import { JOB_CATEGORY, JobCategory } from "@/enums/job_category";
import { JOB_CATEGORY_COLOR } from "@/enums/job_category_color";

export function formatStringDate(stringDate: string) {
    const date = new Date(stringDate);

    const formatter = new Intl.DateTimeFormat(undefined, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    const [
        { value: day },
        ,
        { value: month },
        ,
        { value: year },
        { value: hour },
        { value: minute },
    ] = formatter.formatToParts(date);

    return { day, month, year, hour, minute };
}

export function formatPrice(price: number) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        currencyDisplay: "symbol",
        maximumFractionDigits: 0,
    }).format(price);
}

export function getJobCategoryColor(category: JobCategory) {
    switch (category) {
        case JOB_CATEGORY.ARCHDIOCESAN:
            return JOB_CATEGORY_COLOR.ARCHDIOCESAN;
        case JOB_CATEGORY.PARISH:
            return JOB_CATEGORY_COLOR.PARISH;
        case JOB_CATEGORY.CEMETERIES:
            return JOB_CATEGORY_COLOR.CEMETERIES;
        case JOB_CATEGORY.SCHOOL:
            return JOB_CATEGORY_COLOR.SCHOOL;
        default:
            return "inherit";
    }
}
