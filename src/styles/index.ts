const styles = `
@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');

* {
  margin: 0;
  box-sizing: border-box;
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

label, input {
  cursor: pointer;
}


img {
  height: auto;
  width: 40px;
}

.countries-select {
  display: flex;
  width: 100%;
  flex-direction: column;
  position: relative;
}

.countries-select .country-section {
  max-height: 0;
  width: 100%;
  opacity: 0;
  transition: all 0.4s;
  overflow: hidden;
  border-radius: 5px;
  border: solid 1px #dcdfe5;
  background-color: #ffffff;
  order: 1;
  position: absolute;
  top: 48px;
}

.selected {
  background: #2f3640;
  position: relative;
  border-radius: 5px;
  border: solid 1px #dcdfe5;
  background-color: #ffffff;
  order: 0;
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
