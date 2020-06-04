import * as fs from 'fs';
import * as path from 'path';
import ConfigHelper from '../helper/ConfigHelper';

export default class Messages {
    private static defaultLanguage = 'en';
    private static fallbackData: object;

    public static applyTranslationToString(translatable: string): string {
      let isTranslatable = true,
        translatedString = translatable;

      if (-1 !== translatable.indexOf('$tc(')) {
        do {
          const transStart = translatable.indexOf('$tc('),
            transEnd = translatable.indexOf(')', transStart),
            transKey = translatable.substring(transStart + 4, transEnd);

          translatedString = translatable.split('$tc('+transKey+')').join(this.translation(transKey));
          if (-1 === translatedString.indexOf('$tc(')) {
            isTranslatable = false;
          }
        } while (isTranslatable);
      }

      return translatedString;
    }

    public static translation(transalationKey: string): string {
      const configHelper = new ConfigHelper(),
        languageFile = configHelper.getLanguage() + '.json',
        defaultLanguageFile = this.defaultLanguage + '.json';
      let translationData: object;
      this.fallbackData = JSON.parse(fs.readFileSync(path.resolve(__dirname, defaultLanguageFile)).toString());

      if (defaultLanguageFile !== languageFile && fs.existsSync(path.resolve(__dirname, defaultLanguageFile))) {
        translationData = JSON.parse(fs.readFileSync(path.resolve(__dirname, defaultLanguageFile)).toString());
      }

      if (null === translationData || undefined === translationData) {
        translationData = this.fallbackData;
      }

      return this.resolveKey(transalationKey, translationData);
    }

    private static resolveKey(translationKey: string, transData: object, isFallback = false): string {
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
