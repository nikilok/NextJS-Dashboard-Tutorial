function threeNumberSum(array, targetSum) {
  array.sort((a, b) => a - b);
  const triplet = [];
  for (let cn = 0; cn < array.length - 2; cn++) {
    let left = cn + 1;
    let right = array.length - 1;
    while (left < right) {
      const currentSum = array[cn] + array[left] + array[right];
      if (currentSum === targetSum) {
        triplet.push([array[cn], array[left], array[right]]);
        left++;
        right--;
      }
      if (currentSum < targetSum) {
        left++;
      }
      if (currentSum > targetSum) {
        right--;
      }
    }
  }
  return triplet;
}
let result = threeNumberSum([12, 3, 1, 2, -6, 5, -8, 6], 0);
console.log('🚀 ~ result:', result);
