/**
 * Interface for worklog format data in the application
 */
export interface WorklogFormatData {
  duration: number | null;
  iterator: number;
  time: Date;
  key: string;
  value: string;
}
