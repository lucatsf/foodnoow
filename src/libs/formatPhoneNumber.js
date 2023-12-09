import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber';

const phoneUtil = PhoneNumberUtil.getInstance();

export const formatPhoneNumber = (value) => {
  try {
    const number = phoneUtil.parseAndKeepRawInput(value, 'BR');
    return phoneUtil.format(number, PhoneNumberFormat.NATIONAL);
  } catch (e) {
    return value;
  }
}

export const isValidPhoneNumber = (value) => {
  try {
    const number = phoneUtil.parseAndKeepRawInput(value, 'BR');
    return phoneUtil.isValidNumber(number);
  } catch (e) {
    return false;
  }
}