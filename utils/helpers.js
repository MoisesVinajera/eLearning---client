// data {currency: '', amount: ''}
export const currencyFormatter = ({ lenguageCode, currency, amount }) => {
  // Create our number formatter.
  let formatter = new Intl.NumberFormat(lenguageCode, {
    style: 'currency',
    currency: currency,
  });

  const numberformat = formatter.format((amount * 100) / 100);

  return numberformat;
};
export const stripeCurrencyFormatter = ({ lenguageCode, currency, amount }) => {
  // Create our number formatter.
  let formatter = new Intl.NumberFormat(lenguageCode, {
    style: 'currency',
    currency: currency,
  });

  let total = amount / 100;

  const numberformat = formatter.format(total);

  return numberformat;
};
