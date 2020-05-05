export const UpdateFormData = (data: any) => ({ type: 'FORM_STEP_SUCCESS', payload: data });
export const FormGoNextStep = (data: number) => ({ type: 'FORM_GO_NEXT_STEP_SUCCESS', payload: data });
