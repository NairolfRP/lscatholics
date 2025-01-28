export namespace Str {
    export function limit(string: string, maxLength: number = 100, end: string = "..."): string {
        return string.length <= maxLength ? string : string.substring(0, maxLength) + end;
    }

    export function slug(title: string, separator: string = "-") {
        return title
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, separator);
    }
}
