import * as fs from 'fs';
import {homedir} from 'os';

const mainPath = homedir + '/.wib/',
  configPath = mainPath + 'config.json';

export default class ConfigHelper {
  getSpecifiedFormat(formatName: string, type = 'value'): string {
    let configContent = {};

    if (!fs.existsSync(configPath)) {
      return this.getDefaults()['format'][formatName][type];
    }

    configContent = fs.readFileSync(configPath);

    if (configContent['format'] !== undefined && configContent['format'][formatName] !== undefined) {
      return configContent['format'][formatName][type];
    }
  }

  getSpecifiedMinuteRounding(): number {
    const configPath = homedir + '/.wib/config.json';
    let configContent = {};

    if (!fs.existsSync(configPath)) {
      return this.getDefaults()['minuteRounding'];
    }

    configContent = fs.readFileSync(configPath);

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
        'note': {
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
