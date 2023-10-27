import { formOnTranslateString } from './trans-form';

export interface TranslatableObject {
  messageWithPlaceholders: string;
  messageCompiled: string;
  params: string[];
}

export const format = (s: string, params: any[]) => {
  return s.replace(/{(\d+)}/g, (match, number) => {
    return typeof params[number] != 'undefined' ? params[number] : match;
  });
};

export const translateErrors = (data: TranslatableObject[]) => {
  if (data.length >= 1) {
    const returnData: TranslatableObject = {
      messageWithPlaceholders: formOnTranslateString(data[0].messageWithPlaceholders),
      messageCompiled: format(formOnTranslateString(data[0].messageWithPlaceholders), data[0].params),
      params: data[0].params,
    };
    console.log('translated', returnData);
    return [returnData];
  } else {
    return data;
  }
};
