export default class VersesStr {
  constructor(splitterSymbol) {
    this.splitterSymbol = splitterSymbol;
  }

  destructSelectedVersesString = (selectedVersesString) =>
    selectedVersesString
      ?.split(this.splitterSymbol)
      .filter((i) => !isNaN(parseInt(i)))
      .map((i) => parseInt(i))
      .sort((item1, item2) => (item1 > item2 ? 1 : -1)) ?? [];

  constructSelectedVersesString = (pickedVerses) =>
    pickedVerses?.join(this.splitterSymbol);
}
