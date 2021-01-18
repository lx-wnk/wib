import DataHelper from '../../helper/DataHelper';
import FormatHelper from '../../helper/FormatHelper';
import AbstractStruct from '../AbstractStruct';

export default abstract class AbstractDataStruct extends AbstractStruct {
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
      const result = {
        'key': (new FormatHelper()).applyFormat(dataObject, this.dataKey, 'key'),
        'value': (new FormatHelper()).applyFormat(dataObject, this.dataKey)
      };

      if (dataObject['duration']) {
        result['duration'] = (new FormatHelper()).formatTime(dataObject['duration'], 'duration', true);
      }

      return result;
    }
}
