export const isArray = (value) => value?.constructor?.name === 'Array';
export const isObject = (value) => value?.constructor?.name === 'Object';
export const isString = (value) => value?.constructor?.name === 'String';
export const isNumber = (value) =>
  value?.constructor?.name === 'Number' && !Number.isNaN(value) && Number.isFinite(value);
export const isDate = (value) => value?.constructor?.name === 'Date';

export const isEmpty = (input, except = []) => {
  if (except?.includes?.(input)) return false;
  const type = input?.constructor?.name;
  if ([undefined, null].includes(input)) return true;
  if (type === 'Array') return !input.length;
  if (type === 'Number') return Number.isNaN(input);
  if (type === 'Object') return !Object.keys(input).length;
  if (type === 'String') return !input.trim().length;
  return false;
};

export const isNotEmpty = (...args) => !isEmpty(...args);
