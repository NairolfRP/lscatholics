export namespace Str {
    export function limit(string: string, limit: number = 100, end: string = '...'): string {
        return string.length <= limit ? string : string.substring(0, limit) + end;
    }

    export function slug(title: string, separator: string = "-"){
        return title
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, separator);
    }
}
