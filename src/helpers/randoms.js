export function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function randomItemFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function randomDifferentIntsFromInterval(quantity, min, max) {
  const arr = [];
  const lim = max - min + 1;
  if (quantity <= lim) {
    while (arr.length < quantity) {
      var randInt = randomIntFromInterval(min, max);
      if (arr.indexOf(randInt) === -1) arr.push(randInt);
    }
  }
  return arr;
}
