import getUserIp from '$utils/getUserIp';
import { greetUser } from '$utils/greet';
import { initDropdown } from '$utils/initDropdown';

window.Webflow ||= [];
window.Webflow.push(async () => {
  const name = 'Robert Kibet';
  const country = await getUserIp();
  if (country) {
    initDropdown(country);
  } else {
    initDropdown('US');
  }

  greetUser(name);
});
