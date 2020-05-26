import DataHelper from '../lib/helper/DataHelper';
import FormatHelper from '../lib/helper/FormatHelper';

export default abstract class AbstractStruct {
    abstract dataKey: string;

    public abstract getWriteData(): object;

    public fromSavedData(date?: number, key?: number|string): this {
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

    public getPrintData(dataObject = this.getWriteData()): object {
      return {
        'key': (new FormatHelper()).applyFormat(dataObject, this.dataKey, 'key'),
        'value': (new FormatHelper()).applyFormat(dataObject, this.dataKey)
      };
    }

    private setProperty(key, value): void {
      if (value === undefined) {
        return;
      }
      if ('time' === key) {
        value = new Date(value);
      }

      this[key] = value;
    }

    public fromObject(objData: object): this {
      for (const structKey in objData) {
        this[structKey] = objData[structKey];
      }

      return this;
    }
}
