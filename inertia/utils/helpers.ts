import { JobCategory } from "@/enums/job_category";
import { JobCategoryColor } from "@/enums/job_category_color";

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
        case JobCategory.ARCHDIOCESAN:
            return JobCategoryColor.ARCHDIOCESAN;
        case JobCategory.PARISH:
            return JobCategoryColor.PARISH;
        case JobCategory.CEMETERIES:
            return JobCategoryColor.CEMETERIES;
        case JobCategory.SCHOOL:
            return JobCategoryColor.SCHOOL;
        default:
            return "inherit";
    }
}
