function minChange(coins) {
  coins.sort((a, b) => a - b);

  let currentChange = 0;
  for (const coin of coins) {
    if (coin > currentChange + 1) return currentChange + 1;
    currentChange += coin;
  }
  return currentChange + 1;
}

// const result = minChange([5, 3, 1, 8, 6]);
const result = minChange([6, 1, 9, 8, 2, 4]);
console.log('🚀 ~ result:', result);
