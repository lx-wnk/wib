import { inject, injectable } from 'inversify';
import { ServiceIdentifiers } from '../identifiers';
import { ConfigService } from './ConfigService';
import { MessageService } from './MessageService';

interface TableColumn {
    key: number;
    value: number;
}

interface TableData {
    [key: string]: any;
}

/**
 * Service for formatting data in various ways
 */
@injectable()
export class Formatter {
    private showFullOutput = false;
    private configService: ConfigService;
    private messageService: MessageService;

    /**
     * Constructor for Formatter
     * @param configService - Injected ConfigService
     * @param messageService - Injected MessageService
     */
    constructor(
        @inject(ServiceIdentifiers.ConfigService) configService: ConfigService,
        @inject(ServiceIdentifiers.MessageService) messageService: MessageService
    ) {
        this.configService = configService;
        this.messageService = messageService;
    }

    /**
     * Apply format to data object
     * @param dataObject - The data object to format
     * @param formatName - The name of the format to apply
     * @param type - The type of format (defaults to 'value')
     * @return Formatted string
     */
    public applyFormat(dataObject: any, formatName: string, type = 'value'): string {
        const specifiedFormat = this.messageService.translation(formatName + '.' + type);

        if (specifiedFormat === undefined || dataObject === undefined) {
            console.error(this.messageService.translation('format.invalid') + formatName);

            return '';
        }

        return this.applyVariables(specifiedFormat, dataObject, formatName);
    }

    /**
     * Format data as table
     * @param data - The data to format
     * @param showFullOutput - Whether to show full output
     * @param colLength - Column length information
     * @param isSub - Whether this is a sub-table
     * @param output - Current output
     * @return Formatted table string
     */
    public toTable(
        data: TableData,
        showFullOutput = false,
        colLength: TableColumn = this.getLongestElements(data),
        isSub = false,
        output = ''
    ): string {
        this.showFullOutput = showFullOutput;
        let loopAmount = Object.keys(data).length + 1;

        if (isSub) {
            loopAmount--;
        }

        for (let a = 0; a < loopAmount; a++) {
            const curObject = Object.values(data)[a];

            // Add separator line if needed
            if (!isSub && output.charAt(output.length - 2) !== '-') {
                output += this.generateSeparatorLine(colLength.key + colLength.value + 5);
            }

            if (curObject) {
                if (Array.isArray(curObject) && curObject.length > 0) {
                    // Process array of objects
                    output = this.toTable(curObject, showFullOutput, colLength, true, output);
                } else if (curObject['key'] && curObject['value']) {
                    // Process key-value pair
                    output = this.formatTableRow(output, curObject['key'], curObject['value'], colLength);
                } else if (typeof curObject === 'object' && Object.entries(curObject).length > 0) {
                    // Process nested object
                    output = this.toTable(curObject, showFullOutput, colLength, true, output);
                }
            }

            // Add newline if needed
            if (a + 1 !== loopAmount && !isSub && output.charAt(output.length - 1) !== '\n' && output.length > 0) {
                output += '\n';
            }
        }

        return output;
    }

    /**
     * Format a table row
     * @param output - Current output
     * @param key - Row key
     * @param value - Row value
     * @param colLength - Column length information
     * @return Updated output string with row added
     */
    private formatTableRow(output: string, key: string, value: string, colLength: TableColumn): string {
        // Add newline if needed
        if (output.length > 0 && output.charAt(output.length - 1) !== '\n') {
            output += '\n';
        }

        // Format key column
        let keyOutput = '| ' + key;
        keyOutput += ' '.repeat(colLength.key - key.toString().length);

        // Format value column
        let valOutput;
        if (colLength.value - value.toString().length > 0) {
            valOutput = '| ' + value;
            valOutput += ' '.repeat(colLength.value - value.toString().length) + '|';
        } else {
            const truncatedValue = value.toString().slice(0, colLength.value - 5);
            valOutput = '| ' + truncatedValue + ' ... |';
        }

        return output + keyOutput + valOutput;
    }

    /**
     * Generate a separator line
     * @param length - Length of the separator
     * @return Separator string
     */
    private generateSeparatorLine(length: number): string {
        let line = '';
        for (let i = 0; i < length; i++) {
            line += '-';
        }
        return line;
    }

    /**
     * Format a value using a specified format
     * @param dataObject - The data object to format
     * @param format - The format to apply
     * @param formatName - Optional format name
     * @return Formatted string
     */
    public formatValue(dataObject: any, format: string, formatName = ''): string {
        return this.applyVariables(format, dataObject, formatName);
    }

    /**
     * Format time in various formats
     * @param time - The time to format
     * @param formatType - The format type ('datetime', 'date', 'duration')
     * @param round - Whether to round minutes
     * @return Formatted time string
     */
    public formatTime(time: string | Date, formatType?: string, round = true): string {
        const dateObject = new Date(time);

        // Format as datetime
        if (formatType === 'datetime') {
            return this.formatDateTime(dateObject);
        }

        // Format as date
        if (formatType === 'date') {
            return this.formatDate(dateObject);
        }

        // Format as duration
        if (formatType === 'duration') {
            return this.formatDuration(dateObject, round);
        }

        // Default format (time only)
        return this.formatTimeOnly(dateObject);
    }

    /**
     * Format a date as datetime (YYYY-MM-DD HH:MM)
     * Converts UTC date to local timezone for display
     * @param date - The date in UTC to format
     * @return Formatted datetime string in local timezone
     */
    private formatDateTime(date: Date): string {
        // For display, convert UTC to local time
        return (
            date.getFullYear() +
            '-' +
            ('0' + (date.getMonth() + 1)).slice(-2) +
            '-' +
            ('0' + date.getDate()).slice(-2) +
            ' ' +
            ('0' + date.getHours()).slice(-2) +
            ':' +
            ('0' + date.getMinutes()).slice(-2)
        );
    }

    /**
     * Format a date as date only (YYYY-MM-DD)
     * Converts UTC date to local timezone for display
     * @param date - The date in UTC to format
     * @return Formatted date string in local timezone
     */
    private formatDate(date: Date): string {
        return (
            String(date.getFullYear()).padStart(4, '0') +
            '-' +
            String(date.getMonth() + 1).padStart(2, '0') +
            '-' +
            String(date.getDate()).padStart(2, '0')
        );
    }

    /**
     * Format a date as time only (HH:MM)
     * Converts UTC date to local timezone for display
     * @param date - The date in UTC to format
     * @return Formatted time string in local timezone
     */
    private formatTimeOnly(date: Date): string {
        return String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0');
    }

    /**
     * Format a date as duration
     * @param date - The date to format
     * @param round - Whether to round minutes
     * @return Formatted duration string
     */
    private formatDuration(date: Date, round = true): string {
        let formattedDuration = '';
        const minuteRounding = this.configService.getSpecifiedMinuteRounding();

        // Set seconds to 0 for duration
        date.setSeconds(0);

        // Handle hours
        if (date.getUTCHours() > 0) {
            formattedDuration += date.getUTCHours() + this.messageService.translation('format.time.hour');
        }

        // Add space between hours and minutes if both exist
        if (date.getUTCHours() > 0 && date.getUTCMinutes() > 0) {
            formattedDuration += ' ';
        }

        // Handle minutes
        if (date.getUTCMinutes() > 0) {
            const minutes = round
                ? Math.ceil(date.getUTCMinutes() / minuteRounding) * minuteRounding
                : date.getUTCMinutes();

            formattedDuration += minutes + this.messageService.translation('format.time.minute');
        }

        // Handle zero duration
        if (date.getUTCHours() === 0 && date.getUTCMinutes() === 0) {
            const minDuration = Math.ceil(1 / minuteRounding) * minuteRounding;
            formattedDuration += minDuration + this.messageService.translation('format.time.minute');
        }

        return formattedDuration;
    }

    /**
     * Apply variables to a format string
     * @param specifiedFormat - The format string
     * @param dataObject - The data object
     * @param formatName - The format name
     * @return String with variables replaced
     */
    private applyVariables(specifiedFormat: string, dataObject: any, formatName: string): string {
        if (!specifiedFormat || specifiedFormat.indexOf('{{') === -1) {
            return specifiedFormat || '';
        }

        let result = specifiedFormat;

        // Process all variable placeholders
        while (result.indexOf('{{') !== -1) {
            const plainFormat = result.substring(result.lastIndexOf('{{') + 2, result.lastIndexOf('}}'));

            // Parse the format specification
            const splittedPlainFormat = plainFormat.split(':');
            const formatTarget = splittedPlainFormat.shift() || '';
            let formatType = formatTarget;

            if (splittedPlainFormat.length > 0) {
                formatType = splittedPlainFormat.pop() || formatTarget;
            }

            // Get the replacement value
            let replaceVal = dataObject[formatTarget];

            if (replaceVal === undefined) {
                return '';
            }

            // Format special types
            if (['time', 'date', 'duration', 'datetime'].includes(formatType)) {
                const useRounding = !(formatName === 'rest' || formatName === 'workDuration');

                replaceVal = this.formatTime(replaceVal, formatType, useRounding);
            }

            // Replace the placeholder
            result = result.split('{{' + plainFormat + '}}').join(replaceVal);
        }

        return result;
    }

    /**
     * Get the longest elements in the data for table formatting
     * @param data - The data to analyze
     * @return Object with key and value lengths
     */
    private getLongestElements(data: TableData): TableColumn {
        let longestKey = 0;
        let longestValue = 0;

        // Process all values in the data object
        Object.values(data).forEach((row) => {
            let curKeyLength = 0;
            let curValLength = 0;

            if (Array.isArray(row) && row.length > 0) {
                // Process array of objects
                const tmp = this.getLongestElements(row);
                curKeyLength = tmp.key;
                curValLength = tmp.value;
            } else if (row && row.key && row.value) {
                // Process key-value pair
                curKeyLength = row.key.toString().length;
                curValLength = row.value.toString().length;
            } else if (typeof row === 'object' && row && Object.entries(row).length > 0) {
                // Process nested object
                const tmp = this.getLongestElements(row);
                curKeyLength = tmp.key;
                curValLength = tmp.value;
            }

            // Update longest lengths
            if (curKeyLength > longestKey) {
                longestKey = curKeyLength;
            }

            if (curValLength > longestValue) {
                longestValue = curValLength;
            }
        });

        // Add some padding
        longestKey++;
        longestValue++;

        // Adjust for terminal width if not showing full output
        if (!this.showFullOutput && process.stdout && longestKey + longestValue + 5 > process.stdout.columns) {
            longestValue -= longestKey + longestValue + 5 - process.stdout.columns;
        }

        return {
            key: longestKey,
            value: longestValue
        };
    }
}
