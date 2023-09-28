# [html-maze-gen](https://meterel.github.io/html-maze-gen/)

### A fast multithreaded maze generator

Pros:

* The generation is multithreaded using `Worker`s, dividing the maze in chunks and assigning them evenly to each thread

* The rendering is done with the WebGL context making it around 10 times faster than the old renderer that was using the 2D context

* When rendering a continuous series of walls, it'll be rendered as only one long wall, instead of rendering each wall individually in the series thus using 2 times less geometry

* The algorithm keeps track of occupied cells in their matrix for fast access and in an `Array` used as a stack for fast iteration

* Preallocation is used on `Array`s such as the ones where the cells are stored

#

Cons:

* The maze might appear blurry on Chrome because it doesn't follow spec, making `image-rendering` only apply on `img` elements instead of [all elements](https://drafts.csswg.org/css-images/#propdef-image-rendering)

* When multithreaded the maze gets divided in chunks making the quality of the maze drop if the gridsize is small

* When multithreaded the borders between chunks aren't 100% seamless

* Due to using WebGL for the new renderer and using only one `canvas` instead of multiple, there come limitations on the size of the maze