var array_length;
function heapRootRate(input, i) {
  var left = 2 * i + 1;
  var right = 2 * i + 2;
  var max = i;

  if ((left < array_length) && (input[left].rate < input[max].rate)) {
    max = left;
  }

  if ((right < array_length) && (input[right].rate < input[max].rate)) {
    max = right;
  }

  if (max != i) {
    swapRate(input, i, max);
    heapRootRate(input, max);
  }
}

function swapRate(input, index_A, index_B) {
  var temp = input[index_A];

  input[index_A] = input[index_B];
  input[index_B] = temp;
}

function heapSortRate(input) {

  array_length = input.length;

  for (var i = Math.floor(array_length / 2); i >= 0; i -= 1) {
    heapRootRate(input, i);
  }

  for (i = input.length - 1; i > 0; i--) {
    swapRate(input, 0, i);
    array_length--;
    heapRootRate(input, 0);
  }
}
