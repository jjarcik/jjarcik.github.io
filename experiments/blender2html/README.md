# BLENDER TO HTML

This script allows you to load exported 3D models in OBJ format and display them as HTML. Part of the script is a 3D engine, which is able to map the 3D space to 2D html elements using CSS (LEFT, TOP POSITION ABSOLUTE) or to canvas. You can choice. There is no need CSS3 transformations. Mapped points can be arbitrary HTML elements which can continue to apply other events such as hover, onclick, working with jQuery, CSS properties and more.

<img src=',/public/screenshot1.jpg' alt='' width=200 />
<img src=',/public/screenshot2.jpg' alt='' width=200 />
<img src=',/public/screenshot3.jpg' alt='' width=200 />

## .OBJ files
Blender and others 3D softwares can export 3D models in OBJ file format. It is thus possible to create a 3D model, export it and put through this code on your website. For more information visit:
<a href='https://en.wikipedia.org/wiki/Wavefront_.obj_file'>https://en.wikipedia.org/wiki/Wavefront_.obj_file</a>
You can found some 3d models in obj format in folder obj.

## 3D engine
The kernel of 3D engine is based on applications of linear algebra. For more information and more examples in czech, visit: <a href='http://www2.cs.cas.cz/~horcik/Teaching/applications/node1.html'>http://www2.cs.cas.cz/~horcik/Teaching/applications/node1.html</a>