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

export const translateErrors = (data: TranslatableObject[]) => {
  if (data.length >= 1) {
    const returnData: TranslatableObject = {
      messageWithPlaceholders: formOnTranslateString(data[0].messageWithPlaceholders),
      messageCompiled: format(formOnTranslateString(data[0].messageWithPlaceholders), data[0].params),
      params: data[0].params,
    };
    return [returnData];
  } 
    return data;
  
};
