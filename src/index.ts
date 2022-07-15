import { greetUser } from '$utils/greet';

import { fetchCountries } from './countries';

interface GeoFindMeProps {
  country: string;
}

window.Webflow ||= [];
window.Webflow.push(() => {
  const name = 'Robert Kibet';
  greetUser(name);

  fetch(`https://ipinfo.io/json?token=4e257037e1ae51`)
    .then((res) => res.json())
    .then((data: GeoFindMeProps) => {
      const countryCode = data.country || 'US';
      fetchCountries(countryCode);
    })
    .catch((err) => {
      // just in case :P
      console.log(err);
      fetchCountries('US');
    });
});
