export class DateHelper {
    public static getDateForDay(dayOption?: string, useYesterday = false): Date {
        const date = new Date();

        if (useYesterday) {
            // Subtract 24 hours to handle month/year boundaries correctly
            date.setTime(date.getTime() - 24 * 60 * 60 * 1000);
        } else if (dayOption) {
            const dayNumber = parseInt(dayOption, 10);
            if (!isNaN(dayNumber)) {
                date.setDate(dayNumber);
            }
        }

        return date;
    }

    public static parseTimeString(timeString: string, baseDate: Date = new Date()): Date {
        const result = new Date(baseDate);

        if (timeString) {
            const [hours, minutes] = timeString.split(':').map((part) => parseInt(part, 10));

            if (!isNaN(hours) && !isNaN(minutes)) {
                result.setHours(hours, minutes, 0, 0);
            }
        }

        if (result.toString() === 'Invalid Date') {
            throw new Error('command.worklog.execution.invalidTime');
        }

        return result;
    }

    public static setTimeToStartOfDay(date: Date): Date {
        const startOfDay = new Date(date);
        /** eslint-disable-next-line no-magic-numbers */
        startOfDay.setHours(0, 0, 0, 0);

        return startOfDay;
    }

    public static setTimeToEndOfDay(date: Date): Date {
        const endOfDay = new Date(date);
        /** eslint-disable-next-line no-magic-numbers */
        endOfDay.setHours(23, 59, 59, 999);

        return endOfDay;
    }
}
