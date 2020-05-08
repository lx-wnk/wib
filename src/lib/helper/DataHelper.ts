import * as fs from 'fs';
import {homedir} from 'os';
const mainPath = homedir + '/.wib/';

export default class DataHelper {
  readAllData(key?: string, date?: number): Record<string, any> {
    const filePath = this.getFilePath(date);

    if (!fs.existsSync(filePath)) {
      this.createFile(filePath);
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (data === undefined) {
      return {};
    }

    if (key === undefined) {
      return data;
    }

    return data[key];
  }

  writeData(data: Record<string, any>, key?: string, date?: number): void {
    const filePath = this.getFilePath(date);
    const keyData = this.readAllData(undefined, date);

    if (key === undefined) {
      fs.writeFileSync(this.getFilePath(), JSON.stringify(data));

      return;
    }

    keyData[key] = data;

    fs.writeFileSync(filePath, JSON.stringify(keyData));
  }

  createFile(filePath = this.getFilePath(null)): void {
    if (!fs.existsSync(mainPath)) {
      fs.mkdirSync(mainPath);
    }

    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '{}');
    }
  }

  getFilePath(date?: number): string {
    const selectedDate = date === undefined ? new Date() : new Date(date);
    const foramttedDate = this.formatDate(selectedDate);
    return mainPath + foramttedDate + '.json';
  }

  formatDate(date: Date): string {
    return date.getFullYear() + '_' + String(date.getMonth() + 1).padStart(2, '0') +
        '_' + String(date.getDate()).padStart(2, '0');
  }
}
