// function subsequence(arr1, arr2) {
//   const indexArray = arr2.map((num) => arr1.indexOf(num));

//   let isSorted = true;
//   for (let i = 0; i < indexArray.length; i++) {
//     if (indexArray[i] >= indexArray[i + 1]) {
//       isSorted = false;
//     }
//   }
//   return isSorted;
//, }
function subsequence(array, sequence) {
  // Write your code here.
  let currentIndex = 0;
  // array.forEach((currentNum) => {
  //   if (currentNum === sequence[currentIndex]) {
  //     currentIndex++;
  //   }
  // });
  for (const currentNum of array) {
    if (currentNum === sequence[currentIndex]) {
      currentIndex++;
    }
  }
  return currentIndex === sequence.length;
}
// const result = subsequence([1, 2, 3, 4], [2, 4]);
const result = subsequence([1, 2, 3, 4], [3, 1]);
// const result = subsequence([0, 2, 3, 4], [1, 2, 4]);
// const result = subsequence([1, 5, -1, 10, 8], [-1, 8]);
// const result = subsequence([1, 5, -1, 10, 8], [10, -1]);
console.log('🚀 ~ result:', result);
/**
 * 2 - 1
 * 4 - 3
 */
// [1, 2, 3, 4]
// [2, 4]
