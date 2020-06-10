import * as fs from 'fs';
import * as baseConfig from '../config.dist.json';
import DataHelper from './DataHelper';

export default class ConfigHelper {
  public getSpecifiedFormat(formatName: string, type = 'value'): string {
    if (fs.existsSync(this.getConfigPath())) {
      const configContent = JSON.parse(fs.readFileSync(this.getConfigPath()).toString());

      if (configContent['format'] !== undefined &&
          configContent['format'][formatName] !== undefined &&
          configContent['format'][formatName][type] !== undefined) {
        return configContent['format'][formatName][type];
      }
    }

    return this.getDefaults()['format'][formatName][type];
  }

  public getSpecifiedMinuteRounding(): number {
    if (fs.existsSync(this.getConfigPath())) {
      const configContent = JSON.parse(fs.readFileSync(this.getConfigPath()).toString());
      if (configContent['minuteRounding'] !== undefined) {
        return configContent['minuteRounding'];
      }
    }

    return this.getDefaults()['minuteRounding'];
  }

  public getSpecifiedWorkDuration(): number {
    if (fs.existsSync(this.getConfigPath())) {
      const configContent = JSON.parse(fs.readFileSync(this.getConfigPath()).toString());
      if (configContent['workDuration'] !== undefined) {
        return configContent['workDuration'];
      }
    }

    return this.getDefaults()['workDuration'];
  }

  public getMaxWorklogDuration(): number {
    if (fs.existsSync(this.getConfigPath())) {
      const configContent = JSON.parse(fs.readFileSync(this.getConfigPath()).toString());
      if (configContent['maxWorklogDuration'] !== undefined) {
        return configContent['maxWorklogDuration'];
      }
    }

    return this.getDefaults()['maxWorklogDuration'];
  }

  public getLanguage(): string {
    if (fs.existsSync(this.getConfigPath())) {
      const configContent = JSON.parse(fs.readFileSync(this.getConfigPath()).toString());
      if (configContent['language'] !== undefined) {
        return configContent['language'];
      }
    }

    return this.getDefaults()['language'];
  }

  public getDefaults(): object {
    return baseConfig;
  }

  private getConfigPath(): string {
    return DataHelper.getHomeDir() + 'config.json';
  }
}
