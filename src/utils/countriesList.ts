import type { Countries } from 'src/types';

const countriesList = async () => {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,idd,flags');
    const data: Countries[] = await response.json();

    //sort by country cca2 code and filter to ensure countries have needed properties
    const countriesData = data
      .sort((a, b) => a.cca2.localeCompare(b.cca2))
      .filter(
        (country) => country.idd.root && country.name.common && country.flags.png && country.cca2
      );

    return countriesData as Countries[];
  } catch (error) {
    console.log(error);
    // return US as our default option if there is an error
    return [
      {
        name: {
          common: 'United States',
          official: 'United States of America',
        },
        idd: {
          root: '+1',
          suffixes: ['201'],
        },
        flags: {
          png: 'https://flagcdn.com/w320/us.png',
        },
        cca2: 'US',
      },
    ] as Countries[];
  }
};
export default countriesList;
