# exploded-dom-js
 A light-weight JavaScript glibrary that adds simple, interactive 3D layering effects to HTML elements based on the cursor position.

[![NPM](https://nodei.co/npm/exploded-dom-js.png)](https://npmjs.org/package/exploded-dom-js)

## How to include?

`npm install exploded-dom-js`

## [Demo](https://joshhills.github.io/exploded-dom-js)

![Example Gif](https://joshhills.github.io/exploded-dom-js/img/ed-example.gif "Demo")

## How to use?

`ExplodedDOMJS.initialise(options)`

You can have multiple exploded views on the same page. The benefit of this library over a traditional canvas-based one is that the display elements are not obfuscated into a rendering pipeline, but instead leverages CSS 3D transformations ([see support](https://www.w3schools.com/css/css3_3dtransforms.asp)) on regular HTML elements, meaning you can allow any content to animate.

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

**Parents** should have a `transform-origin` and `perspective`, both **parents** and **children** should have `transform-style: preserve-3d`. These will default in CSS.

*Absolute positioning of these elements may prevent unexpected behaviour.*

### Initialisation
`ExplodedDOMJS.initialise(optionalOptions)`

### Options

Initialise takes an **object** containing options that affect how the DOM elements should appear and animate. They have sensible defaults, and there are also accessor methods.

Field|Type|Default|Description
---|---|---|---
`parentsClass`|string|`'ed-parent'`|The class name identifying parent containers.
`triggerClass`|string|`'ed-trigger'`|The class name identifying triggers for mouse events to nested parents.
`childClass`|string|`'ed-child'`|The class name identifying children of parents.
`maxPitch`|number|`10`|The maximum amount of vertical rotation in degrees to pitch a parent view.
`maxYaw`|number|`40`|The maximum amount of horizontal rotation in degrees to pitch a parent view.
`layerDepth`|number|`20`|The pixel value denoting the gap between layers (higher produces more extreme effect).

### Other Useful Methods

Method|Description
---|---
`getParents`|Returns all parent views.
`getChildren`|Returns all child view.

---

Distributed under MIT license (see LICENSE), 2017, Josh Hills
