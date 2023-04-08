# html-maze-gen

## A maze generator made in HTML

The algorithm is a recoursive backtracer (even tough i use hunt and kill algorithm terminology in the code) but with different backtracing order

The maze is made with `div` elements without using `canvas`

#

Main performance points:

* The algorithm stores occupied cells in a `Set` making the search time very little

* The walls are added to the maze with the `appendChild` method and not by adding HTML code directly to `innerHTML` because every time that value is changed there is some reparsing happening making the "rendering" process very slow

* Preallocation is used on arrays such as the ones where the maze's walls are stored

#

Possible performance improvements:

* Sadly in Javascript arrays are not comparable so to use them in a `Set` (such as the one where the position of occupied cells are stored) i have to convert them to string using `JSON.stringify` and so to get it back from the set i have to use `JSON.parse` hence degrading performance

* Using a `canvas` to display the maze would be provably faster