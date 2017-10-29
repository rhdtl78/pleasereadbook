/*var test_sort = function(prop, asc) {
  ary.sort(function(a, b) {
    var comparable1 = a[prop];
    var comparable2 = b[prop];
    if (prop == "name") {
      comparable1 = comparable1.replace(/[0-9.]/gi, '');
      comparable2 = comparable2.replace(/[0-9.]/gi, '');
    }
    if (asc)
      return (comparable1 > comparable2) ? 1 : ((comparable1 < comparable2) ? -1 : 0);
    else return (comparable2 > comparable1) ? 1 : ((comparable2 < comparable1) ? -1 : 0);
  });
  return ary;
}*/


/*var array_length;
function heapRootAuthor(input, i) {
  var left = 2 * i + 1;
  var right = 2 * i + 2;
  var max = i;

  if ((left < array_length) && (input[left].author > input[max].author)) {
    max = left;
  }

  if ((right < array_length) && (input[right].author > input[max].author)) {
    max = right;
  }

  if (max != i) {
    swapAuthor(input, i, max);
    heapRootAuthor(input, max);
  }
}

function swapAuthor(input, index_A, index_B) {
  var temp = input[index_A];

  input[index_A] = input[index_B];
  input[index_B] = temp;
}

function heapSortAuthor(input) {

  array_length = input.length;

  for (var i = Math.floor(array_length / 2); i >= 0; i -= 1) {
    heapRootAuthor(input, i);
  }

  for (i = input.length - 1; i > 0; i--) {
    swapAuthor(input, 0, i);
    array_length--;
    heapRootAuthor(input, 0);
  }
}*/
function sortComparer(a,b){
    return a.author.localeCompare(b.author);
};
