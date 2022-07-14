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

export const fetchCountries = () => {
  document.head.insertAdjacentHTML('beforeend', dropdownStyle);

  const countriesSelect = document.createElement('div') as HTMLElement;
  countriesSelect.classList.add('countries-select');

  const countriesDiv = document.createElement('div') as HTMLDivElement;
  countriesDiv.classList.add('country-section');

  //create default option
  const selectedByDefault = document.createElement('div') as HTMLDivElement;
  selectedByDefault.classList.add('selected');
  const imagedefault = document.createElement('img') as HTMLImageElement;
  imagedefault.src = 'https://flagcdn.com/ke.svg';
  selectedByDefault.appendChild(imagedefault);
  const span = document.createElement('span') as HTMLSpanElement;
  span.appendChild(document.createTextNode('+254'));
  selectedByDefault.appendChild(span);

  fetch('https://restcountries.com/v3.1/all?fields=name,cca2,idd,flags')
    .then((res) => res.json())
    .then((data) => {
      const countries: Countries[] = data;
      countries
        .sort((a, b) => a.name.common.localeCompare(b.name.common))
        .map((country) => {
          const option = document.createElement('div') as HTMLDivElement;
          //create input radio
          const input = document.createElement('input') as HTMLInputElement;
          input.type = 'radio';
          input.id = country.idd.root;
          input.name = 'country';
          input.value = country.idd.root;
          input.classList.add('radio');
          //create label
          const label = document.createElement('label') as HTMLLabelElement;
          label.htmlFor = country.idd.root;
          // create image
          const img = document.createElement('img') as HTMLImageElement;
          img.src = country.flags.png;
          // create span
          const span = document.createElement('span') as HTMLSpanElement;
          span.appendChild(document.createTextNode(country.idd.root));

          // append children
          label.appendChild(img);
          label.appendChild(span);
          option.appendChild(input);
          option.appendChild(label);
          option.classList.add('option');
          countriesDiv.appendChild(option);
        });

      // handle select change
      const selected = document.querySelector('.selected') as HTMLElement;
      const optionsContainer = document.querySelector('.country-section') as HTMLElement;
      const optionsList = document.querySelectorAll('.option') as NodeListOf<HTMLElement>;

      selected.addEventListener('click', () => {
        optionsContainer.classList.toggle('active');
      });

      optionsList?.forEach((option) => {
        option.addEventListener('click', () => {
          selected.innerHTML = option.querySelector('label')?.innerHTML || '';

          optionsContainer.classList.remove('active');
        });
      });
    });

  countriesSelect.appendChild(selectedByDefault);
  countriesSelect.appendChild(countriesDiv);
  document.body.appendChild(countriesSelect);
};
