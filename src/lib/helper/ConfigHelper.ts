import * as fs from 'fs';
import {homedir} from 'os';

const mainPath = homedir + '/.wib/',
  configPath = mainPath + 'config.json';

export default class ConfigHelper {
  getSpecifiedFormat(formatName: string, type = 'value'): string {
    let configContent,
      specifiedFormat = this.getDefaults()['format'][formatName][type];

    if (fs.existsSync(configPath)) {
      configContent = JSON.parse(fs.readFileSync(configPath).toString());

      if (configContent['format'] !== undefined && configContent['format'][formatName] !== undefined) {
        specifiedFormat = configContent['format'][formatName][type];
      }
    }

    return specifiedFormat;
  }

  getSpecifiedMinuteRounding(): number {
    const configPath = homedir + '/.wib/config.json';
    let configContent = {};

    if (!fs.existsSync(configPath)) {
      return this.getDefaults()['minuteRounding'];
    }

    configContent = JSON.parse(fs.readFileSync(configPath).toString());

    if (configContent['minuteRounding'] === undefined) {
      return this.getDefaults()['minuteRounding'];
    }

    return configContent['minuteRounding'];
  }

  getDefaults(): object {
    return {
      'format': {
        'day': {
          'key': 'Report for date',
          'value': '{{date}}'
        },
        'start': {
          'key': 'Clocked in',
          'value': '{{time}}'
        },
        'stop': {
          'key': 'Clocked out',
          'value': '{{time}}'
        },
        'rest': {
          'key': 'Break({{id}}) [{{time}}]',
          'value': '{{duration}}'
        },
        'workDuration': {
          'key': 'Worked time',
          'value': '{{duration}}'
        },
        'notes': {
          'key': 'Note({{id}}) [{{time}}]',
          'value': '{{value}}'
        },
        'worklogs': {
          'key': 'Worklog({{id}}) [{{time}}]',
          'value': '{{duration}} {{key}} {{value}}'
        }
      },
      'minuteRounding': 5
    };
  }
}
