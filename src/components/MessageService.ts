import * as fs from 'fs';
import * as path from 'path';
import {injectable, optional, inject, postConstruct} from 'inversify';
import {ConfigService} from '../components';
import {ServiceIdentifiers} from '../identifiers';

interface TranslationData {
  [key: string]: string | TranslationData;
}

@injectable()
export class MessageService {
  private defaultLanguage = 'en';
  private fallbackData: TranslationData = {};
  private configService?: ConfigService;
  constructor(@optional() @inject(ServiceIdentifiers.ConfigService) configService?: ConfigService) {
    this.configService = configService;
    this.loadFallbackData();
  }


  public applyTranslationToString(translatable: string): string {
    if (!translatable) {
      return translatable || '';
    }

    let translatedString = translatable;

    // Process all $tc() translation keys
    while (translatedString.indexOf('$tc(') !== -1) {
      const transStart = translatedString.indexOf('$tc(');
      const transEnd = translatedString.indexOf(')', transStart);

      if (transEnd === -1) break; // Prevent infinite loop if closing bracket is missing

      const transKey = translatedString.substring(transStart + 4, transEnd);
      const translation = this.translation(transKey);

      translatedString = translatedString.split('$tc('+transKey+')').join(translation);
    }

    return translatedString;
  }


  public translation(translationKey: string, parameters?: Record<string, any>): string {
    const translationData = this.getTranslationData();
    const resolvedTranslation = this.resolveKey(translationKey, translationData);

    return this.resolveParameters(resolvedTranslation, parameters);
  }


  private resolveParameters(translation: string, parameters?: Record<string, any>): string {
    if (!parameters || !translation) {
      return translation || '';
    }

    let result = translation;
    Object.keys(parameters).forEach((paramKey) => {
      const placeholder = '{{' + paramKey + '}}';
      result = result.replace(new RegExp(placeholder, 'g'), parameters[paramKey].toString());
    });

    return result;
  }


  private resolveKey(
      translationKey: string,
      transData: TranslationData,
      isFallback = false
  ): string {
    const transPath = translationKey.split('.');
    let current: TranslationData | string = transData;

    for (const pathSegment of transPath) {
      if (typeof current !== 'object' || current === null || !(pathSegment in current)) {
        if (!isFallback) {
          return this.resolveKey(translationKey, this.fallbackData, true);
        }
        return translationKey;
      }
      current = current[pathSegment];
    }

    return typeof current === 'string' ? current : translationKey;
  }


  private getTranslationData(): TranslationData {
    try {
      if (this.configService && this.configService.getLanguage() !== this.defaultLanguage) {
        // First try to load the specific language
        const language = this.configService.getLanguage();
        const languageFile = path.resolve(__dirname, '..', 'messages', `${language}.json`);
        if (fs.existsSync(languageFile)) {
          return JSON.parse(fs.readFileSync(languageFile, 'utf8')) as TranslationData;
        } else {

          console.warn(`Translation file for ${language} not found, using fallback.`);
        }
      }
    } catch (error) {
      console.error('Error loading translation file:', error);
    }

    return this.fallbackData;
  }


  private loadFallbackData(): void {
    try {

      const filePath = path.resolve(__dirname, '..', 'messages', `${this.defaultLanguage}.json`);

      if (fs.existsSync(filePath)) {
        this.fallbackData = JSON.parse(fs.readFileSync(filePath, 'utf8')) as TranslationData;
      } else {
        const srcPath = path.resolve(process.cwd(), 'src', 'messages', `${this.defaultLanguage}.json`);
        if (fs.existsSync(srcPath)) {
          this.fallbackData = JSON.parse(fs.readFileSync(srcPath, 'utf8')) as TranslationData;
        } else {
          console.error(`Fallback translation file not found. Checked: ${filePath} and ${srcPath}`);
        }
      }
    } catch (error) {
      console.error('Error loading fallback translation file:', error);
    }
  }
}
