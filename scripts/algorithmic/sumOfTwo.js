function sumOfTwo(array, target) {
  const hash = {};
  for (const num of array) {
    const diff = target - num;
    if (hash[diff]) {
      return [num, diff];
    }

    hash[num] = true;
  }
  return [];
}

const result = sumOfTwo([3, 5, -4, 8, 11, 1, -1, 6], 10);
console.log({ result });
// {
//     3: true,
// }
// // 8 - 5 = 3
// [3, 5]
