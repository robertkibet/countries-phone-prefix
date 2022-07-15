import cssImport from '../styles';

interface Countries {
  name: {
    common: string;
    official: string;
  };
  idd: {
    root: string;
    suffixes: string[];
  };
  flags: {
    png: string;
  };
  cca2: string;
}

// css imports
const dropdownStyle = `
<style>
    ${cssImport}
</style>
`;

const validatePhone = (value: string) => {
  return value.match(/^[0-9]*$/);
};
export const fetchCountries = (defaultCountryCode: string) => {
  document.head.insertAdjacentHTML('beforeend', dropdownStyle);

  const countriesSection = document.createElement('div') as HTMLDivElement;
  countriesSection.classList.add('countries');

  //create form
  const countriesContainerForm = document.createElement('form') as HTMLFormElement;
  countriesContainerForm.classList.add('countries-container');
  countriesContainerForm.setAttribute('method', 'post');
  countriesContainerForm.setAttribute('action', '#');

  //create default option
  const selectedByDefault = document.createElement('div') as HTMLDivElement;
  selectedByDefault.classList.add('selected');

  // create hidden input field
  const hiddenInput = document.createElement('input') as HTMLInputElement;
  hiddenInput.setAttribute('type', 'hidden');
  hiddenInput.setAttribute('name', 'countryCode');
  hiddenInput.setAttribute('id', 'countryCode');

  //form onsubmit
  countriesContainerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const phoneNumber = document.getElementById('phone-number') as HTMLInputElement;
    const countryCode = document.getElementById('countryCode') as HTMLInputElement;

    const phoneNumberValue = phoneNumber.value;
    const countryCodeValue = countryCode.value;

    if (!validatePhone(phoneNumberValue)) {
      alert('Invalid phone number!');
      return false;
    }
    const phoneNumberWithCode = `${countryCodeValue}${phoneNumberValue}`;

    //change button text
    const button = countriesContainerForm.querySelector('button') as HTMLButtonElement;
    //replace button text node
    button.textContent = `Sending...`;

    //timeout submission
    setTimeout(() => {
      //handle dummy submission
      //show submission message
      const dummy = document.createElement('div') as HTMLDivElement;
      dummy.classList.add('submitted-successfully');
      //create paragraph
      const p = document.createElement('p') as HTMLParagraphElement;
      p.appendChild(
        document.createTextNode(`Thank you for your submission! ${phoneNumberWithCode}`)
      );
      dummy.appendChild(p);

      countriesContainerForm.style.display = 'none';
      countriesSection.appendChild(dummy);
      (e.target as HTMLFormElement).reset();
    }, 3000);
  });

  const countriesSelect = document.createElement('div') as HTMLElement;
  countriesSelect.classList.add('countries-select');

  const countriesDiv = document.createElement('div') as HTMLDivElement;
  countriesDiv.classList.add('country-section');

  fetch('https://restcountries.com/v3.1/all?fields=name,cca2,idd,flags')
    .then((res) => res.json())
    .then((data) => {
      const countries: Countries[] = data;
      countries
        .sort((a, b) => a.cca2.localeCompare(b.cca2))
        .filter(
          (country) => country.idd.root && country.name.common && country.flags.png && country.cca2
        )
        .map((country) => {
          const cleanCountryCode = `${country.idd.root.replace('+', '')}${country.idd.suffixes[0]}`;
          const defaultElementId = `${country.cca2}-${cleanCountryCode}`;
          const option = document.createElement('div') as HTMLDivElement;
          option.setAttribute('id', defaultElementId);
          option.setAttribute('tabindex', '1');

          //create input radio
          const input = document.createElement('input') as HTMLInputElement;
          input.type = 'radio';
          // input.id = `country-${cleanCountryCode}`;
          input.name = 'country';
          input.value = `${defaultElementId}`;
          input.classList.add('radio');
          //create label
          const label = document.createElement('label') as HTMLLabelElement;
          label.htmlFor = `${cleanCountryCode}`;
          // create image
          const img = document.createElement('img') as HTMLImageElement;
          img.src = country.flags.png;
          // create span
          const span = document.createElement('span') as HTMLSpanElement;
          span.appendChild(document.createTextNode(country.cca2));

          // append children
          label.appendChild(img);
          label.appendChild(span);
          option.appendChild(input);
          option.appendChild(label);
          option.classList.add('option');
          countriesDiv.appendChild(option);

          //check if default matches input locale from ipinfo and set default else use pre-set static

          if (defaultCountryCode === country.cca2) {
            const imagedefault = document.createElement('img') as HTMLImageElement;
            selectedByDefault.appendChild(imagedefault);
            const span = document.createElement('span') as HTMLSpanElement;
            span.setAttribute('data-id', defaultElementId);
            imagedefault.src = country.flags.png;
            span.appendChild(document.createTextNode(`+${cleanCountryCode}`));
            selectedByDefault.appendChild(span);

            (
              document.querySelector('input[name="countryCode"]') as HTMLInputElement
            ).value = `+${cleanCountryCode}`;
          }
        });

      // handle select change
      const selected = document.querySelector('.selected') as HTMLElement;
      const optionsContainer = document.querySelector('.country-section') as HTMLElement;
      const optionsList = document.querySelectorAll('.option') as NodeListOf<HTMLElement>;

      selected.addEventListener('click', () => {
        optionsContainer.classList.toggle('active');
        // get current selected option
        const selectedOptionCode = selected.querySelector('span') as HTMLSpanElement;

        const selectedOptionCodeValue =
          selected.getAttribute('data-id') || selectedOptionCode?.getAttribute('data-id');
        const toScrollTo = `${selectedOptionCodeValue?.replace('+', '')}`;

        // scroll to element that matches id
        const elementToScrollTo = document.getElementById(toScrollTo) as HTMLElement;
        elementToScrollTo.classList.add('active');
        elementToScrollTo?.scrollIntoView({ block: 'start', behavior: 'smooth' });
      });

      // use arrow keys to scroll option

      const listContainer = document.querySelector('.country-section') as HTMLElement;
      const listItems = document.querySelectorAll('.option') as NodeListOf<HTMLElement>;
      const listArray = Array.prototype.slice.call(listItems);

      // get item that is to be focused first.
      const selectedOptionCode = selected.querySelector('span') as HTMLSpanElement;

      const selectedOptionCodeValue =
        selected.getAttribute('data-id') || selectedOptionCode?.getAttribute('data-id');
      const toScrollTo = `${selectedOptionCodeValue?.replace('+', '')}`;

      // get index of item matching id that is actively selected for toScrollTo
      const indexToStartFrom = listArray.findIndex((item) => item.id === toScrollTo);

      document.getElementById(toScrollTo)?.focus();

      let i = indexToStartFrom; // iterate over children elements inside dropdown
      const childs = listContainer.children; // get all dropdown elements
      // attach keyboard events
      window.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowDown') {
          i++;
          for (const c of childs) c.classList.remove('active');
          childs[Math.abs(i) % childs.length].classList.add('active');
          //focus to div
          document.getElementById(childs[Math.abs(i) % childs.length].id)?.focus();
          return;
        }

        if (event.key === 'ArrowUp') {
          i--;
          for (const c of childs) c.classList.remove('active');
          childs[Math.abs(i) % childs.length].classList.add('active');
          document.getElementById(childs[Math.abs(i) % childs.length].id)?.focus();
          return;
        }
        if (event.key === 'Tab') {
          //close dropdown
          // cleanup remove active classess for selected item and close dropdown
          for (const c of childs) c.classList.remove('active');
          optionsContainer.classList.remove('active');
          return;
        }

        // check if key is alpabets, scroll to element that matches
        if (event.key === 'Enter') {
          //get focused element
          const elementToSelect = document.activeElement as HTMLElement;

          // set selected on enter key
          const input = elementToSelect.querySelector('.radio') as HTMLInputElement;
          const imgLogo = elementToSelect.querySelector('img') as HTMLImageElement;
          const { value } = input;
          const span = document.createElement('span') as HTMLSpanElement;
          span.setAttribute('data-id', value);
          span.appendChild(document.createTextNode(`+${value.split('-')[1]}`));

          (document.querySelector('input[name="countryCode"]') as HTMLInputElement).value = `+${
            value.split('-')[1]
          }`;

          selected.innerHTML = imgLogo.outerHTML + span.outerHTML;
          selected.setAttribute('data-id', value);
          optionsContainer.classList.remove('active');
          return;
        }
        if (/[A-Za-z]/.test(event.key)) {
          // get first letter of key pressed
          const keyPressed = event.key;

          const getAllIds = document.querySelectorAll('div[class~="option"]');
          const getAllIdsArray = Array.from(getAllIds).find((item) =>
            item.id.startsWith(keyPressed.toLocaleUpperCase())
          )!;
          const toScrollTo = getAllIdsArray.id;
          // scroll to element that matches id
          const elementToScrollTo = document.getElementById(toScrollTo) as HTMLElement;
          for (const c of childs) c.classList.remove('active');
          elementToScrollTo.classList.add('active');
          elementToScrollTo?.scrollIntoView({ block: 'start', behavior: 'smooth' });
          elementToScrollTo?.focus();
          return;
        }

        if (event.isComposing) {
          return;
        }
      });

      optionsList?.forEach((option) => {
        option.addEventListener('click', () => {
          const targetedInput = option.querySelector('label')?.innerHTML || '';
          if (targetedInput) {
            //get input element within label
            const input = option.querySelector('.radio') as HTMLInputElement;
            //get image
            const imgLogo = option.querySelector('img') as HTMLImageElement;
            //get value
            const { value } = input;
            const span = document.createElement('span') as HTMLSpanElement;
            span.setAttribute('data-id', value);
            span.appendChild(document.createTextNode(`+${value.split('-')[1]}`));

            // append image and value to selected
            selected.innerHTML = imgLogo.outerHTML + span.outerHTML;
            selected.setAttribute('data-id', value);
            (document.querySelector('input[name="countryCode"]') as HTMLInputElement).value = `+${
              value.split('-')[1]
            }`;

            // cleanup remove active classess for selected item and close dropdown
            const listContainer = document.querySelector('.country-section') as HTMLElement;
            const childs = listContainer.children;
            for (const c of childs) c.classList.remove('active');
            optionsContainer.classList.remove('active');
          }
        });
      });
    });

  countriesSelect.appendChild(selectedByDefault);
  countriesSelect.appendChild(countriesDiv);

  // create input field
  const input = document.createElement('input') as HTMLInputElement;
  input.type = 'text';
  input.id = 'phone-number';
  input.name = 'phone-number';
  input.placeholder = 'Your phone';
  input.classList.add('phone-number');
  input.setAttribute('required', 'required');
  input.addEventListener('keyup', (e: KeyboardEvent) => {
    const phoneNumber = (e.target as HTMLInputElement).value;
    const phoneNumberLength = phoneNumber.length;

    if (phoneNumberLength === 0) {
      //handle vaidation
      console.log('empty phone number');
    } else {
      console.log('phone', phoneNumber);
    }
  });

  //create button
  const button = document.createElement('button') as HTMLButtonElement;
  button.type = 'submit';
  button.id = 'button';
  button.classList.add('button');
  button.appendChild(document.createTextNode('Submit'));

  countriesContainerForm.appendChild(countriesSelect);
  countriesContainerForm.appendChild(input);
  countriesContainerForm.appendChild(hiddenInput);
  countriesContainerForm.appendChild(button);

  countriesSection.appendChild(countriesContainerForm);
  // update the DOM with the new elements
  document.body.appendChild(countriesSection);
};
