import * as fs from 'fs';
import {homedir} from 'os';

export default class DataHelper {
  public readAllData(key?: string, date?: number): Record<string, any> {
    const filePath = this.getFilePath(date);

    if (!fs.existsSync(filePath)) {
      this.createFile(filePath);
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (null === data || undefined === data) {
      return {};
    }

    if (null === key || undefined === key) {
      return data;
    }

    if (null === data[key] || undefined === data[key]) {
      return {};
    }

    return data[key];
  }

  public writeData(data: Record<string, any>, key?: string, date?: number): void {
    const filePath = this.getFilePath(date),
      keyData = this.readAllData(null, date);

    if (null === key || undefined === key ) {
      fs.writeFileSync(filePath, JSON.stringify(data));

      return;
    }

    keyData[key] = data;
    fs.writeFileSync(filePath, JSON.stringify(keyData));
  }

  private createFile(filePath = this.getFilePath(null)): void {
    if (!fs.existsSync(DataHelper.getHomeDir())) {
      fs.mkdirSync(DataHelper.getHomeDir(), {recursive: true});
    }

    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '{}');
    }
  }

  private getFilePath(date?: number): string {
    const selectedDate = date === undefined ? new Date(Date.now()) : new Date(date);
    const foramttedDate = this.formatDate(selectedDate);
    return DataHelper.getHomeDir() + foramttedDate + '.json';
  }

  private formatDate(date: Date): string {
    return date.getFullYear() + '_' + String(date.getMonth() + 1).padStart(2, '0') +
        '_' + String(date.getDate()).padStart(2, '0');
  }

  public static getHomeDir(): string {
    return homedir + '/.wib/';
  }
}
