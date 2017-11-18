var array_length;
function heapRootTime(input, i) {
  var left = 2 * i + 1;
  var right = 2 * i + 2;
  var max = i;

  if ((left < array_length) && (input[left].time > input[max].time)) {
    max = left;
  }

  if ((right < array_length) && (input[right].time > input[max].time)) {
    max = right;
  }

  if (max != i) {
    swapTime(input, i, max);
    heapRootTime(input, max);
  }
}

function swapTime(input, index_A, index_B) {
  var temp = input[index_A];

  input[index_A] = input[index_B];
  input[index_B] = temp;
}

function heapSortTime(input) {

  array_length = input.length;

  for (var i = Math.floor(array_length / 2); i >= 0; i -= 1) {
    heapRootTime(input, i);
  }

  for (i = input.length - 1; i > 0; i--) {
    swapTime(input, 0, i);
    array_length--;
    heapRootTime(input, 0);
  }
}
