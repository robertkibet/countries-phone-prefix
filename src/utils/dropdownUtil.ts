import type { Countries } from 'src/types';

export const getAllDropdownItems = () => {
  const listContainer = document.querySelector('[data-element="list"]') as HTMLElement;
  const childs = listContainer.children; // get all dropdown elements
  return childs as HTMLCollectionOf<HTMLAnchorElement>;
};

export const cleanupAttributes = (childs: HTMLCollectionOf<HTMLAnchorElement>) => {
  for (const c of childs) {
    c.classList.remove('w--current');
    c.setAttribute('aria-selected', 'false');
  }
};

export const setNextItemOnScroll = (item: number, childs: HTMLCollectionOf<HTMLAnchorElement>) => {
  const nextItemOnList = childs[Math.abs(item) % childs.length];
  nextItemOnList.classList.add('w--current');
  nextItemOnList.setAttribute('aria-selected', 'true');
  //focus to div
  const countryToFocusNext = nextItemOnList.getAttribute('aria-label');
  (document.querySelector(`[aria-label="${countryToFocusNext}"]`) as HTMLAnchorElement)?.focus();
};

export const setSelectedItem = (country: Countries) => {
  const selected = document.getElementById('w-dropdown-toggle-0') as HTMLDivElement;
  (selected.querySelector('[data-element="flag"]') as HTMLImageElement).src = country.flags.png;
  (selected.querySelector('[data-element="flag"]') as HTMLImageElement).alt = country.name.common;
  const countryPhoneCode = `${country.idd.root}${country.idd.suffixes[0]}`;
  (selected.querySelector('[data-element="value"]') as HTMLDivElement).textContent =
    countryPhoneCode;

  // update hidden input value
  (document.querySelector("[name='countryCode']") as HTMLInputElement).value = countryPhoneCode;
};

export const scrollToElementThatMatches = (elementToScrollTo: HTMLAnchorElement) => {
  elementToScrollTo.classList.add('w--current');
  elementToScrollTo.setAttribute('aria-selected', 'true');
  elementToScrollTo?.focus();
};
