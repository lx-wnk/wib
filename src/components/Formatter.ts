import {inject, injectable} from 'inversify';
import {IDENTIFIERS} from '../identifiers';
import {ConfigService} from './ConfigService';
import {MessageService} from './MessageService';

@injectable()
export class Formatter {
  private showFullOutput = false;
  private configService: ConfigService;
  private messageService: MessageService;

  constructor(
    @inject(IDENTIFIERS.Config) configService: ConfigService,
    @inject(IDENTIFIERS.Message) messageService: MessageService
  ) {
    this.configService = configService;
    this.messageService = messageService;
  }

  public applyFormat(dataObject: object, formatName: string, type = 'value'): string {
    const specifiedFormat = this.messageService.translation(formatName + '.' + type);

    if (specifiedFormat === undefined || dataObject === undefined) {
      console.error(this.messageService.translation('format.invalid') + formatName);

      return '';
    }

    return this.applyVariables(specifiedFormat, dataObject, formatName);
  }

  public toTable(data, showFullOutput = false, colLength = this.getLongestElements(data), isSub = false, output = ''): string {
    this.showFullOutput = showFullOutput;
    const me = this;
    let loopAmount = Object.keys(data).length + 1, keyOutput, valOutput;

    if (isSub) {
      loopAmount--;
    }

    for (let a = 0; a < loopAmount; a++) {
      const curObject = Object.values(data)[a];
      if (!isSub && output.charAt(output.length-2) !== '-') {
        for (let b = 0; b < colLength['key'] + colLength['value'] + 5; b++) {
          output += '-';
        }
      }

      if (curObject) {
        if (Array.isArray(curObject) && curObject.length > 0) {
          output = me.toTable(curObject, showFullOutput, colLength, true, output);
        } else if (curObject['key'] && curObject['value']) {
          const curKey = curObject['key'];
          const curVal = curObject['value'];

          if (curKey && curVal) {
            if (output.length > 0 && output.charAt(output.length-1) !== '\n') {
              output += '\n';
            }
            keyOutput = '| ' + curKey;
            keyOutput += ' '.repeat(colLength['key'] - curKey.toString().length);

            if (colLength['value'] - curVal.toString().length > 0) {
              valOutput = '| ' + curVal;
              valOutput += ' '.repeat(colLength['value'] - curVal.toString().length) + '|';
            } else {
              valOutput = '| ' + curVal.toString()
                  .slice(0, curVal.toString().length - (curVal.toString().length - colLength['value']) - 5);
              valOutput += ' ... |';
            }

            output += keyOutput + valOutput;
          }
        } else if (typeof curObject === 'object' && Object.entries(curObject).length > 0) {
          output = me.toTable(curObject, showFullOutput, colLength, true, output);
        }
      }

      if (a + 1 !== loopAmount && !isSub && output.charAt(output.length-1) !== '\n' && output.length > 0) {
        output += '\n';
      }
    }

    return output;
  }

  public formatValue(dataObject: object, format: string, formatName = ''): string {
    return this.applyVariables(format, dataObject, formatName);
  }

  public formatTime(time: string, formatType?: string, round = true): string {
    const dateObject = new Date(time);

    if (formatType === 'datetime') {
      return dateObject.getFullYear() + '-' + ('0' + dateObject.getMonth() + 1).slice(-2) + '-' + ('0' + dateObject.getDate()).slice(-2) +
        ' ' + ('0' + dateObject.getHours()).slice(-2) + ':' + ('0' + dateObject.getMinutes()).slice(-2);
    }

    if (formatType === 'date') {
      return dateObject.getFullYear() + '-' + ('0' + dateObject.getMonth() + 1).slice(-2) + '-' + ('0' + dateObject.getDate()).slice(-2);
    }

    if (formatType === 'duration') {
      let formattedDuration = '';

      dateObject.setSeconds(0);

      if (dateObject.getUTCHours() > 0) {
        formattedDuration += dateObject.getUTCHours() + this.messageService.translation('format.time.hour');
      }
      if (dateObject.getUTCHours() > 0 && dateObject.getUTCMinutes() > 0) {
        formattedDuration += ' ';
      }
      if (dateObject.getUTCMinutes() > 0) {
        if (round) {
          formattedDuration += Math.ceil(
              dateObject.getUTCMinutes() / this.configService.getSpecifiedMinuteRounding()
          ) * this.configService.getSpecifiedMinuteRounding();
        } else {
          formattedDuration += dateObject.getUTCMinutes();
        }
        formattedDuration += this.messageService.translation('format.time.minute');
      }
      if (dateObject.getUTCHours() === 0 && dateObject.getUTCMinutes() === 0) {
        formattedDuration += Math.ceil(
            1 / this.configService.getSpecifiedMinuteRounding()
        ) * this.configService.getSpecifiedMinuteRounding();
        formattedDuration += this.messageService.translation('format.time.minute');
      }

      return formattedDuration;
    }

    return ('0' + dateObject.getHours()).slice(-2) + ':' + ('0' + dateObject.getMinutes()).slice(-2);
  }

  private applyVariables(specifiedFormat: string, dataObject: object, formatName: string): string {
    if (specifiedFormat.indexOf('{{') === -1) {
      return specifiedFormat;
    }

    while (specifiedFormat.indexOf('{{') !== -1) {
      const plainFormat = specifiedFormat.substring(
          specifiedFormat.lastIndexOf('{{') + 2,
          specifiedFormat.lastIndexOf('}}')
      );
      const splittedPlainFormat = plainFormat.split(':');
      const formatTarget = splittedPlainFormat.shift();
      let formatType = formatTarget;
      if (splittedPlainFormat.length > 0) {
        formatType = splittedPlainFormat.pop();
      }

      let replaceVal = dataObject[formatTarget];

      if (!dataObject[formatTarget]) {
        return;
      }


      if (replaceVal !== undefined) {
        if (['time', 'date', 'duration', 'datetime'].includes(formatType)) {
          if (formatName === 'rest' || formatName === 'workDuration') {
            replaceVal = this.formatTime(replaceVal, formatType, false);
          } else {
            replaceVal = this.formatTime(replaceVal, formatType);
          }
        }
      }

      specifiedFormat = specifiedFormat.split('{{' + plainFormat + '}}').join(replaceVal);
    }

    return specifiedFormat;
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

      if (Array.isArray(row) && row.length > 0) {
        const tmp = me.getLongestElements(row);
        curKeyLength = tmp['key'];
        curValLength = tmp['value'];
      } else if (!(!row || !row.key || !row.value)) {
        curKeyLength = row.key.toString().length;
        curValLength = row.value.toString().length;
      } else if (typeof row === 'object' && Object.entries(row).length > 0) {
        const tmp = me.getLongestElements(row);
        curKeyLength = tmp['key'];
        curValLength = tmp['value'];
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

    if (!this.showFullOutput && longestKey + longestValue + 5 > process.stdout.columns) {
      longestValue -= (longestKey + longestValue + 5) - process.stdout.columns;
    }

    return {
      key: longestKey,
      value: longestValue
    };
  }
}
