export function getIdListByRange(id) {
  const xarr = id
    .toString()
    .split("-")
    .map((i) => parseInt(i));

  const [startID, endID] = [xarr[0], xarr[1] ?? xarr[0]];

  return [...Array(endID - startID + 1).keys()].map(
    (_, index) => startID + index
  );
}

export function getStartAndEndItemsFromArray(arr) {
  return [arr[0], arr[arr.length - 1]];
}

export function isIdRangeIncluded(idsArr, pickedVerses) {
  return idsArr
    .map((i) => parseInt(i))
    .every((id) => pickedVerses.includes(id));
}
