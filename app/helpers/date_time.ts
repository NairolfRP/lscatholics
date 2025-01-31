import { DateTime } from "luxon";

export function formatTimestamp(timestamp: DateTime | number): string {
    if (!(timestamp instanceof DateTime)) {
        return new Date(timestamp).toISOString();
    }

    return timestamp.toISO() as string;
}
