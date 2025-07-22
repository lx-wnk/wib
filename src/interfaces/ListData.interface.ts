import { ListItem } from './ListItem.interface';

/**
 * Interface for structured list data in the application
 */
export interface ListData {
    day: ListItem | null;
    start: ListItem | null;
    finish: ListItem | null;
    notes: ListItem[];
    worklogs: ListItem[];
}
