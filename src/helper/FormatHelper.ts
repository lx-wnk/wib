import ConfigHelper from './ConfigHelper';
import OutputHelper from './OutputHelper';
import Messages from '../messages';

export default class FormatHelper {
  public applyFormat(dataObject: object, formatName: string, type = 'value'): string {
    let specifiedFormat = (new ConfigHelper).getSpecifiedFormat(formatName, type);

    if (specifiedFormat === undefined || dataObject === undefined) {
      OutputHelper.error(Messages.translation('format.invalid') + formatName);
      return '';
    }

    specifiedFormat = this.applyVariables(specifiedFormat, dataObject, formatName);

    return Messages.applyTranslationToString(specifiedFormat);
  }

  public toTable(data, colLength = this.getLongestElements(data), isSub = false, output = ''): string {
    const me = this;
    let loopAmount = Object.keys(data).length + 1;

    if (isSub) {
      loopAmount--;
    }

    for (let a = 0; a < loopAmount; a++) {
      const curObject = Object.values(data)[a];

      if (!isSub && '-' !== output.charAt(output.length-2)) {
        for (let b = 0; b < colLength['key'] + colLength['value'] + 5; b++) {
          output += '-';
        }
      }

      if (curObject !== undefined) {
        if (Array.isArray(curObject) && 0 < curObject.length) {
          output = me.toTable(curObject, colLength, true, output);
        } else {
          const curKey = curObject['key'];
          const curVal = curObject['value'];

          if (curKey !== undefined && curVal !== undefined) {
            if (0 < output.length && '\n' !== output.charAt(output.length-1)) {
              output += '\n';
            }
            output += '| ' + curKey;
            output += ' '.repeat(colLength['key'] - curKey.toString().length);
            output += '| ' + curVal;
            output += ' '.repeat(colLength['value'] - curVal.toString().length) + '|';
          }
        }
      }

      if (a + 1 !== loopAmount && !isSub && '\n' !== output.charAt(output.length-1) && 0 < output.length) {
        output += '\n';
      }
    }

    return output;
  }

  private applyVariables(specifiedFormat: string, dataObject: object, formatName: string): string {
    const me = this;

    for (const key in dataObject) {
      let replaceVal = dataObject[key];

      if (replaceVal !== undefined) {
        if (['time', 'date', 'duration'].includes(key)) {
          if ('rest' === formatName || 'workDuration' === formatName) {
            replaceVal = me.formatTime(replaceVal, key, false);
          } else {
            replaceVal = me.formatTime(replaceVal, key);
          }
        }

        specifiedFormat = specifiedFormat.split('{{' + key + '}}').join(replaceVal);
      }
    }

    return specifiedFormat;
  }

  private formatTime(time: string, formatType?: string, round = true): string {
    const dateObject = new Date(time);

    if ('date' === formatType) {
      return dateObject.getFullYear() + '-' + dateObject.getMonth() + '-' + dateObject.getDate();
    }

    if ('duration' === formatType) {
      let formattedDuration = '';

      dateObject.setSeconds(0);

      if (0 < dateObject.getUTCHours()) {
        formattedDuration += dateObject.getUTCHours() + Messages.translation('format.time.hour');
      }
      if (0 < dateObject.getUTCHours() && 0 < dateObject.getUTCMinutes()) {
        formattedDuration += ' ';
      }
      if (0 < dateObject.getUTCMinutes()) {
        if (round) {
          formattedDuration += Math.ceil(
              dateObject.getUTCMinutes() / (new ConfigHelper).getSpecifiedMinuteRounding()
          ) * (new ConfigHelper).getSpecifiedMinuteRounding();
        } else {
          formattedDuration += dateObject.getUTCMinutes();
        }
        formattedDuration += Messages.translation('format.time.minute');
      }
      if (0 === dateObject.getUTCHours() && 0 === dateObject.getUTCMinutes()) {
        formattedDuration += Math.ceil(
            1 / (new ConfigHelper).getSpecifiedMinuteRounding()
        ) * (new ConfigHelper).getSpecifiedMinuteRounding();
        formattedDuration += Messages.translation('format.time.minute');
      }

      return formattedDuration;
    }

    return ('0' + dateObject.getHours()).slice(-2) + ':' + ('0' + dateObject.getMinutes()).slice(-2);
  }

  /**
   * @param {{key: string, value: string}} data
   * @return {{key: number, value: number}}
   */
  private getLongestElements(data: object): object {
    const me = this;
    let longestKey = 0, longestValue = 0;

    Object.values(data).forEach((row) => {
      let curKeyLength = 0, curValLength = 0;

      if (Array.isArray(row) && 0 < row.length) {
        const tmp = me.getLongestElements(row);
        curKeyLength = tmp['key'];
        curValLength = tmp['value'];
      } else if (row !== undefined &&
          row['key'] !== undefined && row['value'] !== undefined) {
        curKeyLength = row['key'].toString().length;
        curValLength = row['value'].toString().length;
      }

      if (curKeyLength > longestKey) {
        longestKey = curKeyLength;
      }

      if (curValLength > longestValue) {
        longestValue = curValLength;
      }
    });

    longestKey++;
    longestValue++;

    return {
      key: longestKey,
      value: longestValue
    };
  }
}