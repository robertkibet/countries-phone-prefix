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

  //form onsubmit
  countriesContainerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const phoneNumber = document.getElementById('phone-number') as HTMLInputElement;
    const country = selectedByDefault.getAttribute('data-id');

    const countryCode = country?.split('-')[1];
    const phoneNumberValue = phoneNumber.value;

    if (!validatePhone(phoneNumberValue)) {
      alert('Invalid phone number!');
      return false;
    }
    const phoneNumberWithCode = `+${countryCode}${phoneNumberValue}`;

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
        .sort((a, b) => a.name.common.localeCompare(b.name.common))
        .filter(
          (country) => country.idd.root && country.name.common && country.flags.png && country.cca2
        )
        .map((country) => {
          const cleanCountryCode = `${country.idd.root.replace('+', '')}${country.idd.suffixes[0]}`;
          const defaultElementId = `${country.cca2}-${cleanCountryCode}`;
          const option = document.createElement('div') as HTMLDivElement;
          option.setAttribute('id', defaultElementId);
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
        elementToScrollTo.classList.toggle('active');
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

      document.getElementById(toScrollTo)?.focus();

      let i = 0; // iterate over children elements inside dropdown
      const childs = listContainer.children; // get all dropdown elements
      // attach keyboard events
      window.addEventListener('keydown', (event) => {
        console.log(event.key);
        switch (event.key) {
          case 'ArrowDown':
            for (const c of childs) c.classList.remove('active');
            childs[Math.abs(i) % childs.length].classList.add('active');
            i++;
            break;
          case 'ArrowUp':
            for (const c of childs) c.classList.remove('active');
            childs[Math.abs(i) % childs.length].classList.add('active');
            i--;
            break;
        }

        if (event.isComposing || event.key === 'Enter') {
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
            optionsContainer.classList.remove('active');
          }
        });
        document.addEventListener('keypress', (e) => {
          const keyPressed = e.key;

          const getAllIds = document.querySelectorAll('div[class~="option"]');
          const getAllIdsArray = Array.from(getAllIds).find((item) =>
            item.id.startsWith(keyPressed.toLocaleUpperCase())
          )!;
          const toScrollTo = getAllIdsArray.id;
          // scroll to element that matches id
          const elementToScrollTo = document.getElementById(toScrollTo) as HTMLElement;
          elementToScrollTo?.scrollIntoView({ block: 'start', behavior: 'smooth' });
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
  countriesContainerForm.appendChild(button);

  countriesSection.appendChild(countriesContainerForm);
  // update the DOM with the new elements
  document.body.appendChild(countriesSection);

  //   e.preventDefault();
  //   switch (e.key) {
  //     case 'ArrowDown':
  //       setNext(listArray.indexOf(<HTMLElement>( <HTMLElement>e.target ).parentNode));
  //       break;
  //     case 'ArrowUp':
  //       setPrev(listArray.indexOf(<HTMLElement>( <HTMLElement>e.target ).parentNode));
  //       break;
  //   }
  // });
};
