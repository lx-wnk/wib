import * as fs from 'fs';
import {homedir} from 'os';
const mainPath = homedir + '/.wib/';

export default class DataHelper {
  readAllData(key?: string, date?: string): Record<string, any> {
    const filePath = this.getFilePath(date);

    if (!fs.existsSync(filePath)) {
      this.createFile(filePath);
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (key === undefined || data[key] === undefined) {
      return data;
    }

    return data[key];
  }

  writeData(data: Record<string, any>, key: string, date?: string): void {
    const filePath = this.getFilePath(date);
    const allData = this.readAllData(date);

    if (key === undefined) {
      fs.writeFileSync(this.getFilePath(), JSON.stringify(data));

      return;
    }

    allData[key] = data;

    fs.writeFileSync(filePath, JSON.stringify(allData));
  }

  createFile(filePath = this.getFilePath(null)): void {
    if (!fs.existsSync(mainPath)) {
      fs.mkdirSync(mainPath);
    }

    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '{}');
    }
  }

  getFilePath(date: string = this.getCurDate()): string {
    return mainPath + date + '.json';
  }

  getCurDate(): string {
    const today = new Date();
    return today.getFullYear() + '_' + String(today.getMonth() + 1).padStart(2, '0') +
            '_' + String(today.getDate()).padStart(2, '0');
  }
}
