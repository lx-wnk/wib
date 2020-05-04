import DataHelper from '../lib/helper/DataHelper';
import FormatHelper from '../lib/helper/FormatHelper';

export default abstract class AbstractStruct {
    abstract dataKey: string;

    abstract getWriteData(): object;

    fromSavedData(date?: string, key?: number|string): this {
      let objData = (new DataHelper()).readAllData(this.dataKey, date);

      if (objData === undefined) {
        return this;
      }

      if (objData[key] !== undefined) {
        objData = objData[key];
      }

      for (const structKey in objData) {
        this.setProperty(structKey, objData[structKey]);
      }

      return this;
    }

    setProperty(key, value): void {
      if ('time' === key) {
        value = new Date(value);
      }

      this[key] = value;
    }

    fromObject(objData: object): this {
      for (const structKey in objData) {
        this[structKey] = objData[structKey];
      }

      return this;
    }

    getPrintData(): object {
      return {
        'key': (new FormatHelper()).applyFormat(this.getWriteData(), this.dataKey, 'key'),
        'value': (new FormatHelper()).applyFormat(this.getWriteData(), this.dataKey)
      };
    }
}
