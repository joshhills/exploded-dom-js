/*!
 * ExplodedDOMJS v1.0
 *
 * A lightweight library to add 3D effects
 * to HTML elements.
 * 
 * Contact & Information:
 * https://github.com/JoshHills/exploded-dom-js
 * 
 * Distributed under MIT license, 2017, Josh Hills
 * https://opensource.org/licenses/MIT
 *
 */
const ExplodedDOMJS = (function() {
    var _parentClass  = 'ed-parent',
        _triggerClass = 'ed-trigger',
        _childClass   = 'ed-child-',
        _maxPitch     = 10,
        _maxYaw       = 40,
        _layerGap     = 20,
        _parents      = [],
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

    function EDParent(element, children, trigger) {
        this.element = element;
        this.trigger = trigger;
        this.children = children;
        this.start = function() {
            var _this = this;
            (this.trigger ? this.trigger : this.element)
                .addEventListener('mousemove', function(e) {
                    _this.update(e);
                });
        }
        this.stop = function() {
           (this.trigger ? this.trigger : this.element).removeEventListener('mousemove');
        }
        this.update = function(e) {
            var _rect = (this.trigger ? this.trigger : this.element).getBoundingClientRect();
            
            var _localX = e.clientX - _rect.left;
            var _localY = e.clientY - _rect.top;
            if(_localX < 0) {
                _localX = 0;
            }
            if(_localY < 0) {
                _localY = 0;
            }

            var _minYaw = -_maxYaw;
            var _amountYaw = _minYaw + ((_localX / _rect.width) * (_maxYaw - _minYaw));
            
            var _minPitch = -_maxPitch;
            var _amountPitch = _minPitch + ((_localY / _rect.height) * (_maxPitch - _minPitch));
            
            var _newTransformRotateXY = 'rotateY({0}deg) rotateX({1}deg)'.format(
                -_amountYaw,
                _amountPitch
            );
            
            this.element.style.transform = _newTransformRotateXY;
        }
        this.getChildren = function() {
            return this.children;
        }
        this.getElement = function() {
            return this.element;
        }
    }
    
    function EDChild(element, parentElement) {
        this.element = element;
        this.layer = (function() {
            var _tempClasses = element.classList;
            for(var i = 0; i < _tempClasses.length; i++) {
                if(_tempClasses[i].indexOf(_childClass) != -1) {
                    var _layer = _tempClasses[i].match(/\d+/)[0];
                    if(_layer == null || isNaN(_layer)) {
                        throw Error('Malformed class for EDChild.');
                    }
                    return _layer;
                }
            }
        })();
        this.element.style.transform = 'translate3d(0px,0px,{0}px)'.format(this.layer * _layerGap);
        
        this.getElement = function() {
            return this.element;
        }
    }
    
    function initialise(options) {
        function _setFromOptions() {
            if(options != null) {
                if(options.parentClass != null) {
                    setParentClass(options.parentClass);
                }
                if(options.triggerClass != null) {
                    setTriggerClass(options.triggerClass);
                }
                if(options.childClass != null) {
                    setChildClass(options.childClass);
                }
                if(options.maxPitch != null) {
                    setMaxPitch(options.maxPitch);
                }
                if(options.maxYaw != null) {
                    setMaxYaw(options.maxYaw);
                }
            }
        }
        function _retrieveDOMElements() {
            var _tempParents = document.getElementsByClassName(_parentClass);
            
            Array.prototype.forEach.call(_tempParents, function(p, i) {
                var _tempChildren = [];
                var _tempElements = document.querySelectorAll('[class*=' + _childClass + ']');
                Array.prototype.forEach.call(_tempElements, function(c) {
                    if(c.className.indexOf(_childClass) != -1) {
                        _tempChildren.push(new EDChild(c, p));
                    }
                });
                var _tempTrigger = 
                    (p.parentElement.className.indexOf(_triggerClass) != -1) ? p.parentElement : null
                _parents.push(new EDParent(p, _tempChildren, _tempTrigger));
                _children.push(_tempChildren);
            });
        }
        function _addEventListeners() {
            Array.prototype.forEach.call(_parents, function(p) {
                p.start();
            });
        }
        _setFromOptions();
        _retrieveDOMElements();
        _addEventListeners();
    }
    
    function getParentClass() {
        return _parentClass;
    }
    function setParentClass(parentClass) {
        _parentClass = parentClass;
    }
    function getTriggerClass() {
        return _triggerClass;
    }
    function setTriggerClass(triggerClass) {
        _triggerClass = triggerClass;
    }
    function getChildClass() {
        return _childClass;
    }
    function setChildClass(childClass) {
        _childClass = childClass;
    }
    function getParents() {
        return _parents;
    }
    function getChildren() {
        return _children;
    }
    function getLayerGap() {
        return _layerGap;
    }
    function setLayerGap(layerGap) {
        if(isNaN(layerGap)) {
            throw Error('Argument must be of type \'number\'');
        }
        _layerGap = Math.abs(layerGap);
    }
    function getMaxPitch() {
        return _maxPitch;
    }
    function setMaxPitch(maxPitch) {
        if(isNaN(maxPitch)) {
            throw Error('Argument must be of type \'number\'');
        }
        _maxPitch = Math.abs(maxPitch);
    }
    function getMaxYaw() {
        return _maxYaw;
    }
    function setMaxYaw(maxYaw) {
        if(isNaN(maxYaw)) {
            throw Error('Argument must be of type \'number\'');
        }
        _maxYaw = Math.abs(maxYaw);
    }
    
    // Expose useful methods.
    return {
        initialise:     initialise,
        getParentClass: getParentClass,
        setParentClass: setParentClass,
        getChildClass:  getChildClass,
        setChildClass:  setChildClass,
        getParents:     getParents,
        getChildren:    getChildren,
        getMaxPitch:    getMaxPitch,
        setMaxPitch:    setMaxPitch,
        getMaxYaw:      getMaxYaw,
        setMaxYaw:      setMaxYaw
    }
})();