export function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function randomItemFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
