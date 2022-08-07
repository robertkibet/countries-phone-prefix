import type { Countries } from 'src/types';

import { activateDropdownListeners, toggleCloseDropdown } from './activateDropdownListeners';
import countriesList from './countriesList';
import { cleanupAttributes, getAllDropdownItems, setSelectedItem } from './dropdownUtil';

// get default element for reference and cloning
const dropdownListItem = document.querySelector('[data-element="item"]');

export const updateSelectedCountry = (country: Countries) => {
  //update selected option
  setSelectedItem(country);
  //check if nav is in the right state
  const nav = document.getElementById('w-dropdown-list-0') as HTMLDivElement;
  if (nav.classList.contains('w--open')) {
    nav?.classList.remove('w--open');
  }
  (document.querySelector('[data-element="dropdown"]') as HTMLDivElement).focus();
};
// prefix-dropdown_toggle w-dropdown-toggle

const applyCountriesToDropdown = (countries: Countries[], countryCode: string) => {
  countries.forEach((country) => {
    // use selected default element, clone it and apply the country nav list
    const countryDiv = dropdownListItem?.cloneNode(true) as HTMLAnchorElement;

    // add necessary attributes to respective elements
    (countryDiv.querySelector('[data-element="value"]') as HTMLDivElement).textContent =
      country.cca2;
    (countryDiv.querySelector('[data-element="flag"]') as HTMLImageElement).src = country.flags.png;
    (countryDiv.querySelector('[data-element="flag"]') as HTMLImageElement).alt =
      country.name.common;

    //change aria-label to match the country name
    countryDiv.setAttribute('aria-label', country.name.common);
    // change title to match the country name
    countryDiv.title = country.name.common;

    countryDiv.addEventListener('click', () => {
      updateSelectedCountry(country);

      // cleanup current class before closing dropdown
      const childs = getAllDropdownItems();
      cleanupAttributes(childs);
      toggleCloseDropdown();
    });

    document.querySelector('[data-element="list"]')?.appendChild(countryDiv);
  });

  // set selected country based on detected IP information
  const defaultCountry = countries.find((item) => item.cca2 === countryCode)!;
  updateSelectedCountry(defaultCountry);

  //cleanup to remove default element; from template it is the country US, let's remove it and use the data from the countries API request
  // maybe this is not needed, but from template the country exists as default so we need to remove it
  dropdownListItem?.parentNode?.removeChild(dropdownListItem);
};

export const initDropdown = async (countryCode = 'US') => {
  //array of countries
  const countries: Countries[] = await countriesList();

  // check countries length and apply to dropdown if it is greater than 0
  if (countries?.length > 0) {
    activateDropdownListeners(countries);
    applyCountriesToDropdown(countries, countryCode);
  } else {
    // we may never hit this since the countriesList function will throw an error (console logged that is) if there is an error and the countries array will have a default value of US
    alert('Oops! There was an error fetching the countries list');
  }
};
