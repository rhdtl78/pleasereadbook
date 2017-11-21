var array_length;
function Sort(rule, input) {
  array_length = input.length;

  for (var i = Math.floor(array_length / 2); i >= 0; i -= 1) {
    heapRoot(input, i);
  }

  for (i = input.length - 1; i > 0; i--) {
    swap(input, 0, i);
    array_length--;
    heapRoot(input, 0, rule);
  }

}
function heapRoot(input, i, rule) {
  var left = 2 * i + 1;
  var right = 2 * i + 2;
  var max = i;

  if ((left < array_length) && (input[left][rule] < input[max][rule])) {
    max = left;
  }

  if ((right < array_length) && (input[right][rule] < input[max][rule])) {
    max = right;
  }

  if (max != i) {
    swap(input, i, max);
    heapRoot(input, max);
  }
}

function swap(input, index_A, index_B) {
  var temp = input[index_A];

  input[index_A] = input[index_B];
  input[index_B] = temp;
}
