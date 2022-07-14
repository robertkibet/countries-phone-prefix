import { greetUser } from '$utils/greet';

import { fetchCountries } from './countries';

window.Webflow ||= [];
window.Webflow.push(() => {
  const name = 'Robert Kibet';
  greetUser(name);
  fetchCountries();
  console.log('herer', document.querySelectorAll('.select-box'));
});
