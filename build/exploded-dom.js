const ExplodedDOMJS = (function() {
    const OPTIONS = {
        DEFAULT: {
            triggerClass: 'ed-trigger',
            parentClass:  'ed-parent',
            childClass:   'ed-child-',
            maxRotateX:   -20,
            maxRotateY:   10,
            maxSlideX:    0,
            maxSlideY:    0,
            layerScale:   20,
            animate:      true,
            is3d:         true
        },
        PARALLAX_Y: {
            triggerClass: 'ed-trigger',
            parentClass:  'ed-parent',
            childClass:   'ed-child-',
            maxRotateX:   0,
            maxRotateY:   0,
            maxSlideX:    0,
            maxSlideY:    100,
            layerScale:   0,
            animate:      true,
            is3d:         false
        },
        PARALLAX_X: {
            triggerClass: 'ed-trigger',
            parentClass:  'ed-parent',
            childClass:   'ed-child-',
            maxRotateX:   0,
            maxRotateY:   0,
            maxSlideX:    100,
            maxSlideY:    0,
            layerScale:   0,
            animate:      true,
            is3d:         false
        }
    }
    var _globalOptions = OPTIONS.DEFAULT;
    
    var _parents      = [],
        _children     = [];

    if (!String.prototype.format) {
        String.prototype.format = function() {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function(match, number) { 
                return typeof args[number] != 'undefined'
                    ? args[number] : match;
            });
        };
    }

    function EDParent(options, element, children, trigger) {
        this.options = options;
        this.element = element;
        this.trigger = trigger;
        this.children = children;
        this.start = function() {
            var _this = this;
            (this.trigger ? this.trigger : this.element)
                .addEventListener('mousemove', function(e) {
                    if(_this.options.animate) {
                        _this.update(e);
                    }
                });
        }
        this.stop = function() {
           (this.trigger ? this.trigger : this.element).removeEventListener('mousemove');
        }
        this.update = function(e) {
            var _rect = (this.trigger ? this.trigger : this.element).getBoundingClientRect();
            
            var _localX, _localY;
            if(e) {
                _localX = e.clientX - _rect.left;
                _localY = e.clientY - _rect.top;
            } else {
                _localX = _rect.width / 2;
                _localY = _rect.height / 2;
            }
            if(_localX < 0) {
                _localX = 0;
            }
            if(_localY < 0) {
                _localY = 0;
            }

            // TODO: Make this a function.
            var _minRotateX = -this.options.maxRotateX;
            var _amountRotateX = _minRotateX + ((_localX / _rect.width) * (this.options.maxRotateX - _minRotateX));
            
            var _minSlideX = -this.options.maxSlideX;
            var _amountSlideX = _minSlideX + ((_localX / _rect.width) * (this.options.maxSlideX - _minSlideX));
            
            var _minSlideY = -this.options.maxSlideY;
            var _amountSlideY = _minSlideY + ((_localY / _rect.height) * (this.options.maxSlideY - _minSlideY));
            
            var _minRotateY = -this.options.maxRotateY;
            var _amountRotateY = _minRotateY + ((_localY / _rect.height) * (this.options.maxRotateY - _minRotateY));
            
            var _newTransformRotateXY = 'rotateY({0}deg) rotateX({1}deg)'.format(
                _amountRotateX,
                _amountRotateY
            );
            
            this.element.style.transform = _newTransformRotateXY;
            
            Array.prototype.forEach.call(children, function(c) {
                c.update(_amountSlideX, _amountSlideY);
            });
        }
        this.update();
        
        this.getOptions = function() {
            return this.options;
        }
        this.getChildren = function() {
            return this.children;
        }
        this.getElement = function() {
            return this.element;
        }
    }
    
    function EDChild(element, options) {
        this.element = element;
        this.layer = (function() {
            var _tempClasses = element.classList;
            for(var i = 0; i < _tempClasses.length; i++) {
                if(_tempClasses[i].indexOf(options.childClass) != -1) {
                    var _layer = _tempClasses[i].match(/\d+/)[0];
                    if(_layer == null || isNaN(_layer)) {
                        throw Error('Malformed class for EDChild.');
                    }
                    return _layer;
                }
            }
        })();
        this.update = function(slideX, slideY) {
            this.element.style.transform = 'translate3d({0}px,{1}px,{2}px)'.format(
                slideX * this.layer,
                slideY * this.layer,
                (options.is3d ? this.layer * options.layerScale : 0)
            );
        }
        this.update(0, 0);
        
        this.getElement = function() {
            return this.element;
        }
    }
    
    function initialise(options, parent) {
        var _options;
        
        function _setFromOptions() {
            if(options.parentClass != null) {
                setParentClass(options.parentClass, _options);
            }
            if(options.triggerClass != null) {
                setTriggerClass(options.triggerClass, _options);
            }
            if(options.childClass != null) {
                setChildClass(options.childClass, _options);
            }
            if(options.maxRotateY != null) {
                setMaxRotateY(options.maxRotateY, _options);
            }
            if(options.maxRotateX != null) {
                setMaxRotateX(options.maxRotateX, _options);
            }
            if(options.layerScale != null) {
                setLayerScale(options.layerScale, _options);
            }
            if(options.maxSlideX != null) {
                setMaxSlideX(options.maxSlideX, _options);
            }
            if(options.maxSlideY != null) {
                setMaxSlideY(options.maxSlideY, _options);
            }
            if(options.animate != null) {
                setAnimate(options.animate, _options);
            }
            if(options.is3d != null) {
                set3d(options.is3d, _options);
            }
        }
        function _retrieveDOMElements() {
            function _initialiseChildren(p) {
                var _tempChildren = [];
                var _tempElements = document.querySelectorAll('[class*=' + _options.childClass + ']');
                Array.prototype.forEach.call(_tempElements, function(c) {
                    if(c.className.indexOf(_options.childClass) != -1) {
                        _tempChildren.push(new EDChild(c, _options));
                    }
                });
                var _tempTrigger = 
                    (p.parentElement.className.indexOf(_options.triggerClass) != -1) ? p.parentElement : null
                _parents.push(new EDParent(_options, p, _tempChildren, _tempTrigger));
                _children.push(_tempChildren);
            }
            
            if(parent != null) {
                _initialiseChildren(parent);
            } else {
                var _tempParents = document.getElementsByClassName(_options.parentClass);
                Array.prototype.forEach.call(_tempParents, _initialiseChildren);
            }
                                         
        }
        function _addEventListeners() {
            if(_options.animate) {
                Array.prototype.forEach.call(_parents, function(p) {
                    p.start();
                });
            }
        }
        
        if(options != null) {
            _options = JSON.parse(JSON.stringify(_globalOptions));
            _setFromOptions();
        } else {
            _options = _globalOptions;
        }
        
        _retrieveDOMElements();
        _addEventListeners();
    }
    
    function _updateAll() {
        Array.prototype.forEach.call(_parents, function(p) {
           p.update(); 
        });
    }
    
    function getParentClass() {
        return _parentClass;
    }
    function setParentClass(parentClass, options) {
        if(options) {
            options.parentsClass = parentClass;    
        } else {
            _globalOptions.parentsClass = parentClass;
        }
        _updateAll();
    }
    function getTriggerClass() {
        return _triggerClass;
    }
    function setTriggerClass(triggerClass, options) {
        if(options) {
            options.triggerClass = triggerClass;
        } else {
            _globalOptions.triggerClass = triggerClass;
        }
        _updateAll();
    }
    function getChildClass() {
        return _childClass;
    }
    function setChildClass(childClass, options) {
        if(options) {
            options.childClass = childClass;
        } else { 
            _globalOptions.childClass = childClass;
        }
        _updateAll();
    }
    function getParents() {
        return _parents;
    }
    function getChildren() {
        return _children;
    }
    function getLayerScale() {
        return _layerScale;
    }
    function setLayerScale(layerScale, options) {
        if(isNaN(layerScale)) {
            throw Error('Argument must be of type \'number\'');
        }
        if(options) {
            options.layerScale = layerScale;
        } else { 
            _globalOptions.layerScale = layerScale;
        }
        _updateAll();
    }
    function getMaxRotateY() {
        return _maxRotateY;
    }
    function setMaxRotateY(maxRotateY, options) {
        if(isNaN(maxRotateY)) {
            throw Error('Argument must be of type \'number\'');
        }
        if(options) {
            options.maxRotateY = maxRotateY;
        } else { 
            _globalOptions.maxRotateY = maxRotateY;
        }
        _updateAll();
    }
    function getMaxRotateX() {
        return _maxRotateX;
    }
    function setMaxRotateX(maxRotateX, options) {
        if(isNaN(maxRotateX)) {
            throw Error('Argument must be of type \'number\'');
        }
        if(options) {
            options.maxRotateX = maxRotateX;
        } else { 
            _globalOptions.maxRotateX = maxRotateX;
        }
        _updateAll();
    }
    function getMaxSlideX() {
        return _maxSlideX;
    }
    function setMaxSlideX(maxSlideX, options) {
        if(isNaN(maxSlideX)) {
            throw Error('Argument must be of type \'number\'');
        }
        if(options) {
            options.maxSlideX = maxSlideX;
        } else { 
            _globalOptions.maxSlideX = maxSlideX;
        }
        _updateAll();
    }
    function getMaxSlideY() {
        return _maxSlideY;
    }
    function setMaxSlideY(maxSlideY, options) {
        if(isNaN(maxSlideY)) {
            throw Error('Argument must be of type \'number\'');
        }
        if(options) {
            options.maxSlideY = maxSlideY;
        } else { 
            _globalOptions.maxSlideY = maxSlideY;
        }
        _updateAll();
    }
    function getAnimate() {
        return _animate;
    }
    function setAnimate(animate, options) {
        if(options) {
            options.animate = animate;
        } else { 
            _globalOptions.animate = animate;
        }
        _updateAll();
    }
    function get3d() {
        return _globalOptions.is3d;
    }
    function set3d(is3d, options) {
        if(options) {
            options.is3d = is3d;
        } else { 
            _globalOptions.is3d = is3d;
        }
        _updateAll();
    }
    
    return {
        OPTIONS:        OPTIONS,
        initialise:     initialise,
        getParentClass: getParentClass,
        setParentClass: setParentClass,
        getChildClass:  getChildClass,
        setChildClass:  setChildClass,
        getParents:     getParents,
        getChildren:    getChildren,
        getLayerScale:  getLayerScale,
        getMaxRotateY:  getMaxRotateY,
        setMaxRotateY:  setMaxRotateY,
        getMaxRotateX:  getMaxRotateX,
        setMaxRotateX:  setMaxRotateX,
        getMaxSlideX:   getMaxSlideX,
        setMaxSlideX:   setMaxSlideX,
        getMaxSlideY:   getMaxSlideY,
        setMaxSlideY:   setMaxSlideY,
        getAnimate:     getAnimate,
        setAnimate:     setAnimate,
        get3d:          get3d,
        set3d:          set3d
    }
})();