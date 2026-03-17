import { PayForRentResponse } from "smartbox-types";

  export const prepareAndSentPaymentForm = (data: PayForRentResponse) => {
    const { url, paymentData } = data;
    console.log('GOT PAYMENT DATA', JSON.stringify(data));
    if (!url || !paymentData) return;

    const { hash, ...restData } = paymentData;
    const form = document.createElement('form');
    form.method = 'post';
    form.action = url;

    const hashInput = document.createElement('input');
    hashInput.value = hash;
    hashInput.name = 'hashExtended';
    hashInput.type = 'hidden';
    form.appendChild(hashInput);

    Object.keys(restData).forEach((key) => {
      console.log('HANDLING KEY', key, restData[key])
      const input = document.createElement('input');
      input.type = 'hidden';
      input.value = restData[key];
      input.name = key;
      form.appendChild(input);
    });

    console.log(JSON.stringify(form));

    document.body.appendChild(form);
    form.submit();
    form.remove();
 
  };
