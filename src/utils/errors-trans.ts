import { formOnTranslateString } from './trans-form';

export interface TranslatableObject {
  messageWithPlaceholders: string;
  messageCompiled: string;
  params: string[];
}

export const format = (s: string, params: string[]) => {
  return s.replace(/{(\d+)}/g, (match: string, number: string) => {
    const value = params[Number(number)];
    return typeof value !== 'undefined' ? value : match;
  });
};

const translateError = (error: TranslatableObject): TranslatableObject => {
  const messageWithPlaceholders = formOnTranslateString(
    error.messageWithPlaceholders,
  );

  return {
    messageWithPlaceholders,
    messageCompiled: format(messageWithPlaceholders, error.params),
    params: error.params,
  };
};

export const translateErrors = (data: TranslatableObject[]) =>
  data.map(translateError);
