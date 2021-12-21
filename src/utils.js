export const isArray = (value) => value?.constructor?.name === 'Array';
export const isObject = (value) => value?.constructor?.name === 'Object';
export const isString = (value) => value?.constructor?.name === 'String';
export const isNumber = (value) =>
  value?.constructor?.name === 'Number' && !Number.isNaN(value) && Number.isFinite(value);
export const isDate = (value) => value?.constructor?.name === 'Date';

export const isEmpty = (value) => {
  if ([undefined, null].includes(value)) return true;

  if (isArray(value)) return Boolean(value?.length);
  if (isObject(value)) return Boolean(Object.keys(value)?.length);
  if (isString(value)) return Boolean(value?.trim());
  if (isNumber(value)) return true;

  return false;
};

export const isNotEmpty = (value) => !isEmpty(value);
