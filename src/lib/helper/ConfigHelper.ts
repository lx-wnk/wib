import * as fs from 'fs';
import {homedir} from 'os';

const mainPath = homedir + '/.wib/',
  configPath = mainPath + 'config.json';

export default class ConfigHelper {
  public getSpecifiedFormat(formatName: string, type = 'value'): string {
    if (fs.existsSync(configPath)) {
      const configContent = JSON.parse(fs.readFileSync(configPath).toString());

      if (configContent['format'] !== undefined &&
          configContent['format'][formatName] !== undefined &&
          configContent['format'][formatName][type] !== undefined) {
        return configContent['format'][formatName][type];
      }
    }

    return this.getDefaults()['format'][formatName][type];
  }

  public getSpecifiedMinuteRounding(): number {
    if (fs.existsSync(configPath)) {
      const configContent = JSON.parse(fs.readFileSync(configPath).toString());
      if (configContent['minuteRounding'] !== undefined) {
        return configContent['minuteRounding'];
      }
    }

    return this.getDefaults()['minuteRounding'];
  }

  public getSpecifiedWorkDuration(): number {
    if (fs.existsSync(configPath)) {
      const configContent = JSON.parse(fs.readFileSync(configPath).toString());
      if (configContent['workDuration'] !== undefined) {
        return configContent['workDuration'];
      }
    }

    return this.getDefaults()['workDuration'];
  }

  public getDefaults(): object {
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
        'stop-unset': {
          'key': 'Estimated clock out',
          'value': '{{time}}'
        },
        'rest': {
          'key': 'Break({{id}})   [{{time}}]',
          'value': '{{duration}} Break duration'
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
      'minuteRounding': 5,
      'workDuration': 8
    };
  }
}
