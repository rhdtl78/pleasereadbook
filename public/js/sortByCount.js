var array_length;
function heapRootCount(input, i) {
  var left = 2 * i + 1;
  var right = 2 * i + 2;
  var max = i;

  if ((left < array_length) && (input[left].count < input[max].count)) {
    max = left;
  }

  if ((right < array_length) && (input[right].count < input[max].count)) {
    max = right;
  }

  if (max != i) {
    swapCount(input, i, max);
    heapRootCount(input, max);
  }
}

function swapCount(input, index_A, index_B) {
  var temp = input[index_A];

  input[index_A] = input[index_B];
  input[index_B] = temp;
}

function heapSortCount(input) {

  array_length = input.length;

  for (var i = Math.floor(array_length / 2); i >= 0; i -= 1) {
    heapRootCount(input, i);
  }

  for (i = input.length - 1; i > 0; i--) {
    swapRate(input, 0, i);
    array_length--;
    heapRootCount(input, 0);
  }
}
