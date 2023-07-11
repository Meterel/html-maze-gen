# [html-maze-gen](https://meterel.github.io/html-maze-gen/)

### A fast multithreaded maze generator

Pros:

* The algorithm and rendering is multithreaded using `Worker`s, dividing the maze in chunks and assigning them evenly to each thread

* The maze is rendered with one `OffscreenCanvas` per chunk making the rendering multithreaded

* The algorithm stores occupied cells in a `Set` making the search time very little

* To use arrays in a `Set`, instead of converting them to a `String` with `JSON.stringify` and back with `JSON.parse`, I encode and decode them to a `Number` which is around 10 times faster, for example [86,64] -> 8600064

* Preallocation is used on `Array`s such as the ones where the maze's walls are stored

#

Cons:

* Because the maze gets divided in chunks when multithreaded, the quality of the maze will drop if the gridsize is small

* The maze might appear blurry on Chrome because it doesn't follow spec, making `image-rendering` only apply on `img` elements instead of [all elements](https://drafts.csswg.org/css-images/#propdef-image-rendering)

* When multithreaded the borders between chunks aren't 100% seamless
