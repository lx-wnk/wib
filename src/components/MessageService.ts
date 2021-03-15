import * as fs from 'fs';
import * as path from 'path';
import {inject, injectable} from 'inversify';
import {ConfigService} from '../components';
import {IDENTIFIERS} from '../identifiers';

@injectable()
export class MessageService {
  private defaultLanguage = 'en';
  private fallbackData: object;
  private configService: ConfigService;

  constructor(@inject(IDENTIFIERS.Config) configService: ConfigService) {
    this.configService = configService;
  }

  public applyTranslationToString(translatable: string): string {
    let isTranslatable = true,
      translatedString = translatable;

    if (translatable.indexOf('$tc(') !== -1) {
      do {
        const transStart = translatable.indexOf('$tc('),
          transEnd = translatable.indexOf(')', transStart),
          transKey = translatable.substring(transStart + 4, transEnd);

        translatedString = translatable.split('$tc('+transKey+')').join(this.translation(transKey));
        if (translatedString.indexOf('$tc(') === -1) {
          isTranslatable = false;
        }
      } while (isTranslatable);
    }

    return translatedString;
  }

  public translation(transalationKey: string, parameters?: object): string {
    const languageFile = this.configService.getLanguage() + '.json',
      defaultLanguageFile = '../messages/' + this.defaultLanguage + '.json';
    let translationData: object;
    this.fallbackData = JSON.parse(fs.readFileSync(path.resolve(__dirname, defaultLanguageFile)).toString());

    if (defaultLanguageFile !== languageFile && fs.existsSync(path.resolve(__dirname, defaultLanguageFile))) {
      translationData = JSON.parse(fs.readFileSync(path.resolve(__dirname, defaultLanguageFile)).toString());
    }

    if (translationData === null || undefined === translationData) {
      translationData = this.fallbackData;
    }

    return this.resolveParameters(this.resolveKey(transalationKey, translationData), parameters);
  }

  private resolveParameters(translation: string, parameters: object): string {
    if (!parameters) {
      return translation;
    }

    Object.keys(parameters).forEach((paramKey) => {
      const mockedParamKey = '{' + paramKey + '}';

      if (translation.indexOf(mockedParamKey) !== -1) {
        translation = translation.replace(mockedParamKey, parameters[paramKey]);
      }
    });

    return translation;
  }

  private resolveKey(translationKey: string, transData: object, isFallback = false): string {
    const transPath = translationKey.split('.');
    let result;

    for (const key in transPath) {
      if (undefined !== transData[transPath[key]]) {
        result = transData[transPath[key]];
        transData = transData[transPath[key]];
      } else if (!isFallback) {
        return this.resolveKey(translationKey, this.fallbackData, true);
      } else {
        return;
      }
    }

    return result ?? translationKey;
  }
}
