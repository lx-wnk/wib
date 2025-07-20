import * as fs from 'fs';
import * as baseConfig from '../config.dist.json';
import {homedir} from 'os';
import {injectable} from 'inversify';

interface Config {
  format: {
    [formatName: string]: {
      [type: string]: string;
    }
  };
  minuteRounding: number;
  workDuration: number;
  maxWorklogDuration: number;
  language: string;
}

@injectable()
export class ConfigService {
  public getSpecifiedFormat(formatName: string, type = 'value'): string {
    const configContent = this.getConfigContent();

    if (configContent?.format?.[formatName]?.[type]) {
      return configContent.format[formatName][type];
    }

    return this.getDefaults().format[formatName][type];
  }

  public getSpecifiedMinuteRounding(): number {
    const configContent = this.getConfigContent();

    if (configContent?.minuteRounding !== undefined) {
      return configContent.minuteRounding;
    }

    return this.getDefaults().minuteRounding;
  }

  public getSpecifiedWorkDuration(): number {
    const configContent = this.getConfigContent();

    if (configContent?.workDuration !== undefined) {
      return configContent.workDuration;
    }

    return this.getDefaults().workDuration;
  }

  public getMaxWorklogDuration(): number {
    const configContent = this.getConfigContent();

    if (configContent?.maxWorklogDuration !== undefined) {
      return configContent.maxWorklogDuration;
    }

    return this.getDefaults().maxWorklogDuration;
  }

  public getLanguage(): string {
    const configContent = this.getConfigContent();

    if (configContent?.language !== undefined) {
      return configContent.language;
    }

    return this.getDefaults().language;
  }

  public getDefaults(): Config {
    return baseConfig as Config;
  }

  private getConfigContent(): Config | null {
    if (fs.existsSync(this.getConfigPath())) {
      try {
        return JSON.parse(fs.readFileSync(this.getConfigPath(), 'utf8')) as Config;
      } catch (error) {
        console.error('Error reading config file:', error);
      }
    }
    return null;
  }

  private getConfigPath(): string {
    return this.getHomeDir() + 'config.json';
  }

  private getHomeDir(): string {
    return homedir() + '/.wib/';
  }
}
