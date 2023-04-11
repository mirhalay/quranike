export default class VersesStr {
  constructor(splitterSymbol) {
    this.splitterSymbol = splitterSymbol;
  }

  destructSelectedVersesString = (selectedVersesString) =>
    selectedVersesString
      ?.split(this.splitterSymbol)
      .filter(
        (value, index, arr) =>
          arr.indexOf(value) === index && !isNaN(parseInt(value))
      )
      .map((i) => parseInt(i))
      .sort((item1, item2) => (item1 > item2 ? 1 : -1)) ?? [];

  constructSelectedVersesString = (pickedVerses) =>
    pickedVerses?.join(this.splitterSymbol);
}
