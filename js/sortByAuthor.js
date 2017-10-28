var test_sort = function(prop, asc) {
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
}
