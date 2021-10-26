export const getValue = (value: string): string => {

  let firstIndexNumber = -1;

  do {
    firstIndexNumber += 1;
  } while (value[firstIndexNumber] === "0");

  const cents = value.slice(value.length - 2, value.length);
  const integerValue = value.slice(firstIndexNumber, value.length - 2);
  const responseValue = `${integerValue}.${cents}`;

  return responseValue;

}