export const errors = {
  field_required: 'validation.field_required',
  incorrect_email: 'validation.incorrect_email',
  incorrect_phone: 'validation.incorrect_phone',
  incorrect_activation_code: 'validation.incorrect_activation_code',
  incorrect_postcode: 'validation.incorrect_postcode',
  passwords_must_match: 'validation.passwords_must_match',
  check_required: 'validation.check_required',
  incorrect_nip: 'validation.incorrect_nip',
  incorrect_country: 'validation.incorrect_country',
  incorrect_characters: 'validation.incorrect_characters',
  min_chars: (chars: number) => `validation.min_chars:${chars}`,
};
