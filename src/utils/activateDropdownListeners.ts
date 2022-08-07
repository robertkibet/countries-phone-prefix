import { closeDropdown } from '@finsweet/ts-utils';
import type { Countries } from 'src/types';

import {
  cleanupAttributes,
  getAllDropdownItems,
  scrollToElementThatMatches,
  setNextItemOnScroll,
  setSelectedItem,
} from './dropdownUtil';

export const toggleCloseDropdown = () => {
  const dropdownComponent = document.querySelector('[data-element="dropdown"]') as HTMLDivElement;

  closeDropdown(dropdownComponent, true);
};

export const activateDropdownListeners = (countriesArr: Countries[]) => {
  const container = document.querySelector('[data-element="dropdown"]');
  const nav = document.getElementById('w-dropdown-list-0') as HTMLDivElement;

  // get all countries data-element=value
  const countries = document.querySelectorAll(
    '[data-element="value"]'
  ) as NodeListOf<HTMLAnchorElement>;

  const toggleDropdownClicks = () => {
    container?.addEventListener('click', (e) => {
      //selected country
      const selectedCountry = document.getElementById('w-dropdown-toggle-0') as HTMLDivElement;
      //selected country name
      const selectedCountryName = (
        selectedCountry.querySelector('[data-element="flag"]') as HTMLImageElement
      ).alt;

      //check if nav is in the right state
      if (!nav.classList.contains('w--open')) {
        nav?.classList.add('w--open');
      }
      //focus on matching data value using for loop
      for (let i = 0; i < countries.length; i++) {
        // get title attribute
        const elementOfInterest = countries[i].parentNode as HTMLAnchorElement;

        const countryOfInterestFromList = (
          elementOfInterest?.querySelector('[data-element="flag"]') as HTMLImageElement
        )?.alt;

        if (
          countryOfInterestFromList.trim().toLowerCase() ===
          selectedCountryName.trim().toLowerCase()
        ) {
          //set aria-selected to true
          elementOfInterest?.setAttribute('aria-selected', 'true');

          // ensure element is scrolled into view onclick
          const elementToScrollTo = document.querySelector(
            `[title="${countryOfInterestFromList}"]`
          ) as HTMLAnchorElement;
          scrollToElementThatMatches(elementToScrollTo);

          break;
        }
      }
    });
  };

  const keyDownDropdown = () => {
    nav.addEventListener('keydown', (event) => {
      // use arrow keys to scroll option
      const selected = document.getElementsByClassName('w--current')[0] as HTMLAnchorElement;
      const toScrollTo = (selected.querySelector('[data-element="flag"]') as HTMLImageElement).alt;

      const childs = getAllDropdownItems(); // get all dropdown elements

      const listItems = document.querySelectorAll(
        '[data-element="item"]'
      ) as NodeListOf<HTMLElement>;
      const listArray = Array.prototype.slice.call(listItems);

      // get index of item matching id that is actively selected for toScrollTo
      const indexToStartFrom = listArray.findIndex(
        (item) => item.getAttribute('aria-label') === toScrollTo
      );

      document.getElementById(toScrollTo)?.focus();

      let i = indexToStartFrom; // iterate over children elements inside dropdown

      if (event.key === 'ArrowDown') {
        i++;
        cleanupAttributes(childs);
        setNextItemOnScroll(i, childs);
        return;
      }

      if (event.key === 'ArrowUp') {
        i--;
        cleanupAttributes(childs);
        setNextItemOnScroll(i, childs);
        return;
      }
      if (event.key === 'Tab') {
        // cleanup remove active classess for selected item and close dropdown
        cleanupAttributes(childs);
        // close dropdown
        toggleCloseDropdown();
        return;
      }

      if (event.key === 'Enter') {
        //get focused element
        const elementToSelect = document.activeElement as HTMLElement;

        const countryOfInterestData = countriesArr.find(
          (item) => item.name.common === elementToSelect.getAttribute('aria-label')
        )!;

        //update selected option
        setSelectedItem(countryOfInterestData);

        // close dropdown
        toggleCloseDropdown();
        return;
      }

      // check if key is alpabets, scroll to element that matches
      if (/[A-Za-z]/.test(event.key)) {
        // get first letter of key pressed
        const keyPressed = event.key;

        const getAllIdsArray = Array.from(listItems).find((item) => {
          const countryToFocus = (item.querySelector('[data-element="value"]') as HTMLDivElement)
            .textContent;
          return countryToFocus?.startsWith(keyPressed.toLocaleUpperCase());
        })!;
        const toScrollTo = getAllIdsArray.getAttribute('aria-label')!;
        // scroll to element that matches id
        const elementToScrollTo = document.querySelector(
          `[aria-label="${toScrollTo}"]`
        ) as HTMLAnchorElement;
        cleanupAttributes(childs);
        scrollToElementThatMatches(elementToScrollTo);
        return;
      }

      if (event.isComposing) {
        return;
      }
    });
  };
  toggleDropdownClicks();
  keyDownDropdown();
};
