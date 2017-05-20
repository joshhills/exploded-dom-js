# exploded-dom-js
 A light-weight JavaScript glibrary that adds simple, interactive 3D layering effects to HTML elements based on the cursor position.

[![NPM](https://nodei.co/npm/exploded-dom-js.png)](https://npmjs.org/package/exploded-dom-js)

## How to include?

`npm install exploded-dom-js`

## [Demo](https://joshhills.github.io/exploded-dom-js)

![Example Gif](https://joshhills.github.io/exploded-dom-js/img/edjs-example.gif "Demo")

## How to use?

`ExplodedDOMJS.initialise(options, parent)`

You can have multiple exploded views on the same page. The benefit of this library over a traditional canvas-based one is that the display elements are not obfuscated into a rendering pipeline, but instead leverage CSS 3D transformations ([see support](https://www.w3schools.com/css/css3_3dtransforms.asp)) on regular HTML elements.

### Structure
#### Parents
To the element containing the item(s) you wish to add the effect to, add the class `ed-parent`.

#### Children
To the element(s) that you wish to animate, add the class `ed-child-z`, with `z` denoting their depth as an index.

#### Triggers
By default, animation will occur on the parent element, however you can define a bounding rect to the parent by enclosing it with an element classed as `el-trigger`

#### Example

```
trigger
    parent
        child
        child
        child
        ...
```

### Style

For 3D effects, **Parents** should have a `transform-origin` and `perspective`, both **parents** and **children** should have `transform-style: preserve-3d`. These will default in CSS.

*Absolute positioning of these elements will help prevent unexpected behaviour.*

### Options

Initialise takes an optional **object** containing options that affect how the DOM elements should appear and animate. There are accessor methods for all of the fields of these classes (let your IDE do its magic!).

There are also some templates for options at `ExplodedDOMJS.SETTINGS.`:
* DEFAULT
* PARALLAX_X
* PARALLAX_Y

Field|Type|Default|Description
---|---|---|---
`triggerClass`|string|`'ed-trigger'`|The class name identifying triggers for mouse events to nested parents.
`parentsClass`|string|`'ed-parent'`|The class name identifying parent containers.
`childClass`|string|`'ed-child'`|The class name identifying children of parents.
`maxRotateY`|number|`10`|The maximum amount of vertical rotation in degrees to pitch a parent view.
`maxRoateX`|number|`-20`|The maximum amount of horizontal rotation in degrees to yaw a parent view.
`maxSlideY`|number|`0`|The maximum amount of vertical translation in pixels to move children within a parent view.
`maxSlideX`|number|`0`|The maximum amount of vertical translation in pixels to move children within a parent view.
`layerDepth`|number|`20`|The pixel value denoting the gap between layers (higher produces more extreme effect).
`is3d`|boolean|true|Allow translation of child elements along the z axix.
`animate`|boolean|true|Allow animation of element.

### Other Useful Methods

Method|Description
---|---
`getParents`|Returns all parent views.
`getChildren`|Returns all child view.

---

Distributed under MIT license (see LICENSE), 2017, Josh Hills
