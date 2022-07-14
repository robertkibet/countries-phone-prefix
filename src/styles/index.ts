const styles = `
@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');

* {
  margin: 0;
  box-sizing: border-box;
}

p{
  margin: 0;
}

body {
  font-family: 'Roboto', sans-serif;
  font-size: 15px;
  line-height: 1.5;
  font-weight: 400;
  background: #f0f3f6;
  color: #3a3a3a;
  display: block;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

label {
  cursor: pointer;
  font-size: 1rem;
}
.submitted-successfully{
  display: flex;
  justify-content: center;
  align-items: center;
  background: gray;
  color: black;
  font-size: 1.5rem;
  height: 51px;
}

button{
  height: 100%;
  width: 100%;
  padding: 0.75rem 1.25rem;
  justify-content: center;
  align-items: center;
  background-color: #386eec;
  color: #fff;
  font-weight: 600;
  text-align: center;
}
.phone-number{
  width: 100%;
  height: 100%;
  margin-bottom: 0rem;
  padding: 0.5rem;
  border-style: none;
  background-color: #fff;
  font-size: 1rem;
}
.phone-number:focus{
  border-color: none;
  outline: 0;
}

img {
  height: auto;
  width: 40px;
}

.countries-container{
  display: grid;
  grid-template-columns: 150px 1fr max-content;
  align-items: center;
  width: 90%;
}

.countries-select {
  display: flex;
  width: 100%;
  flex-direction: column;
  position: relative;
  height: 50px;
}

.countries-select .country-section {
  max-height: 0;
  width: 100%;
  opacity: 0;
  transition: all 0.4s;
  overflow: hidden;
  background-color: #ffffff;
  order: 1;
  position: absolute;
  top: 48px;
}

.selected {
  background: #2f3640;
  position: relative;
  background-color: #ffffff;
  order: 0;
  height: 100%;
}

label, .selected {
  display: grid;
  grid-template-columns: 40px 1fr;
  align-items: center;
  gap: 20px;
}

.selected::after {
  width: 0;
  height: 0;
  border: 0.313em solid transparent;
  border-bottom: none;
  border-top-color: #0d141f;
  content: '';
  vertical-align: middle;
  display: inline-block;
  position: absolute;
  right: 0.313em;
}

.countries-select .country-section.active {
  max-height: 240px;
  opacity: 1;
  overflow-y: scroll;
}

.countries-select .country-section.active + .selected::after {
  transform: translateY(-50%) rotateX(180deg);
}

.countries-select .country-section::-webkit-scrollbar {
  width: 8px;
  background: #0d141f;
  background: #81878f;
  background: #f1f2f3;
  border-radius: 0 5px 5px 0;
}

.countries-select .country-section::-webkit-scrollbar-thumb {
  background: #525861;
  background: #81878f;
  border-radius: 0 5px 5px 0;
}

.countries-select .option,
.selected {
  padding: 12px 24px;
  cursor: pointer;
}


.option.active {
  background: #81878f;
  font-weight: 600;
}

.countries-select .option:hover {
  background: #dcdfe5;
}

.countries-select label {
  cursor: pointer;
}

.countries-select .option .radio {
  display: none;
}
`;
export default styles;
