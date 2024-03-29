(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../release/go"], factory);
    }
})(function (require, exports) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    /*
    *  Copyright (C) 1998-2019 by Northwoods Software Corporation. All Rights Reserved.
    */
    var go_1 = require("../release/go");
    var QuadNode = /** @class */ (function () {
        function QuadNode(bounds, parent, level) {
            this.objects = [];
            this.treeObjects = [];
            this.totalObjects = 0; // total in this node + in all children (recursively)
            this.nodes = [null, null, null, null];
            this.bounds = bounds;
            this.parent = parent;
            this.level = level;
        }
        QuadNode.prototype.split = function () {
            var subWidth = this.bounds.width / 2;
            var subHeight = this.bounds.height / 2;
            var x = this.bounds.x;
            var y = this.bounds.y;
            this.nodes[0] = new QuadNode(new go_1.Rect(x + subWidth, y, subWidth, subHeight), this, this.level + 1);
            this.nodes[1] = new QuadNode(new go_1.Rect(x, y, subWidth, subHeight), this, this.level + 1);
            this.nodes[2] = new QuadNode(new go_1.Rect(x, y + subHeight, subWidth, subHeight), this, this.level + 1);
            this.nodes[3] = new QuadNode(new go_1.Rect(x + subWidth, y + subHeight, subWidth, subHeight), this, this.level + 1);
        };
        QuadNode.prototype.clear = function () {
            this.treeObjects = [];
            this.objects = [];
            this.totalObjects = 0;
            for (var i = 0; i < this.nodes.length; i++) {
                var n = this.nodes[i];
                if (n !== null) {
                    n.clear();
                    this.nodes[i] = null;
                }
            }
        };
        return QuadNode;
    }());
    /**
     * Object to be contained by the {@link Quadtree} class. This object needs
     * to have rectangular bounds (described by an {@link Rect} object), as well
     * as something (of any type) associated with it.
     */
    var TreeObject = /** @class */ (function () {
        function TreeObject(bounds, obj) {
            this.bounds = bounds;
            this.obj = obj;
        }
        return TreeObject;
    }());
    /**
     * Implementation of the quadtree data structure using the {@link Rect} class.
     * Each Quadtree has defined bounds found at {@link #bounds}, an array
     * of member rectangles, and an array of child nodes
     * (Quadtrees themselves). If the Quadtree has no
     * children, the nodes array will have four nulls. To construct a Quadtree, you
     * can call its constructor with no arguments. Then, to insert a rectangle, call
     * {@link #add}. This tree supports adding points (rectangles with 0
     * width and height), segments (rectangles with either 0 width or 0 height), and
     * rectangles with nonzero widths and heights.
     *
     * Quadtrees can be used to calculate intersections extremely quickly between a
     * given rectangle and all of the rectangles in the quadtree. Use of this data
     * structure prevents having to do precise intersection calculations for every
     * rectangle in the tree. To calculate all of the rectangular intersections for
     * a given rectangle, use {@link #intersecting}.
     *
     * Other common operations are detailed below.
     * @category Layout Extension
     */
    var Quadtree = /** @class */ (function () {
        /**
         * In most cases, simply calling this constructor with no arguments will produce the desired behaviour.
         * @constructor
         * @param {number=} nodeCapacity The node capacity of this quadtree. This is the number of objects a node can contain before it splits. Defaults to 1.
         * @param {number=} maxLevel The maximum depth the Quadtree will allow before it will no longer split. Defaults to Infinity (no maximum depth).
         * @param {Rect=} bounds The bounding box surrounding the entire Quadtree. If the bounds are unset or a node is inserted outside of the bounds, the tree will automatically grow.
         */
        function Quadtree(nodeCapacity, maxLevel, bounds) {
            /** @hidden @internal */ this._nodeCapacity = 1;
            /** @hidden @internal */ this._maxLevels = Infinity;
            /** @hidden @internal */ this._treeObjectMap = new go_1.Map();
            // we can avoid unnecessary work when adding objects if there are no objects with 0 width or height.
            // Note that after being set to true, these flags are not ever set again to false, even if all objects
            // with zero width/height are removed (assumption was made that this should almost never matter)
            /** @hidden @internal */ this._hasZeroWidthObject = false;
            /** @hidden @internal */ this._hasZeroHeightObject = false;
            if (nodeCapacity) {
                this._nodeCapacity = nodeCapacity;
            }
            if (maxLevel) {
                this._maxLevels = maxLevel;
            }
            if (bounds === undefined) {
                bounds = new go_1.Rect();
            }
            this._root = new QuadNode(bounds, null, 0);
        }
        Object.defineProperty(Quadtree.prototype, "nodeCapacity", {
            /**
             * Gets the node capacity of this quadtree. This is the number of objects a node can contain before it splits.
             */
            get: function () { return this._nodeCapacity; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Quadtree.prototype, "maxLevels", {
            /**
             * Gets the maximum depth the Quadtree will allow before it will no longer split..
             */
            get: function () { return this._maxLevels; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Quadtree.prototype, "bounds", {
            /**
             * Gets the boundaries of the node. All nodes should be square.
             */
            get: function () { return this._root.bounds; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Quadtree.prototype, "root", {
            /**
             * Gets the root node of the tree
             */
            get: function () { return this._root; },
            enumerable: true,
            configurable: true
        });
        /**
         * Clears the Quadtree, removing all objects and children nodes. Keeps the current bounds of the root node.
         * @this {Quadtree}
         * @return {void}
         */
        Quadtree.prototype.clear = function () {
            this._root.clear();
        };
        /**
         * @hidden @internal
         * Returns a list of possible quadrants that the given rect could be in
         * @this {Quadtree}
         * @param {Rect} rect the rectangle to test
         * @return {Array<number>}
         */
        Quadtree.prototype._getQuadrants = function (rect, node) {
            var quadrants = [];
            var horizontalMidpoint = node.bounds.x + (node.bounds.width / 2);
            var verticalMidpoint = node.bounds.y + (node.bounds.height / 2);
            var topQuadrant = rect.y <= verticalMidpoint;
            var bottomQuadrant = rect.y + rect.height >= verticalMidpoint;
            if (rect.x <= horizontalMidpoint) {
                if (topQuadrant) {
                    quadrants.push(1);
                }
                if (bottomQuadrant) {
                    quadrants.push(2);
                }
            }
            if (rect.x + rect.width >= horizontalMidpoint) {
                if (topQuadrant) {
                    quadrants.push(0);
                }
                if (bottomQuadrant) {
                    quadrants.push(3);
                }
            }
            return quadrants;
        };
        /**
         * @hidden @internal
         * Determine which node the rect belongs to. -1 means rect
         * cannot completely fit within a child node and is part of
         * the parent node. This function avoids some additional
         * calculations by assuming that the rect is contained entirely
         * within the parent node's bounds.
         * @this {Quadtree}
         * @param {Rect} rect the rect to test
         * @return {number}
         */
        Quadtree.prototype._getIndex = function (rect, node) {
            var index = -1;
            if (node.bounds === undefined) { // the quadtree is empty
                return index;
            }
            var horizontalMidpoint = node.bounds.x + (node.bounds.width / 2);
            var verticalMidpoint = node.bounds.y + (node.bounds.height / 2);
            var topQuadrant = rect.y <= verticalMidpoint && rect.y + rect.height <= verticalMidpoint;
            var bottomQuadrant = rect.y >= verticalMidpoint;
            if (rect.x + rect.width <= horizontalMidpoint) {
                if (topQuadrant) {
                    index = 1;
                }
                else if (bottomQuadrant) {
                    index = 2;
                }
            }
            else if (rect.x >= horizontalMidpoint) {
                if (topQuadrant) {
                    index = 0;
                }
                else if (bottomQuadrant) {
                    index = 3;
                }
            }
            return index;
        };
        /**
         * Insert the object into the quadtree. If the node
         * exceeds the capacity, it will split and add all
         * objects to their corresponding nodes. If the object is
         * outside the bounds of the tree's root node, the tree
         * will grow to accomodate it. Possibly restructures the
         * tree if a more efficient configuration can be found with
         * the new dimensions. Bounds can be given either as a
         * single {@link Rect} or as any combination of arguments
         * which is valid for the {@link Rect} constructor.
         * @this {Quadtree}
         * @param {T} obj the object to insert
         * @param {Rect|Point|number} x The Rect bounds of the object, or top-left Point, or x value.
         * @param {Point|Size|number} y Bottom-right Point or Size or y value.
         * @param {number} w Width to be used if x,y are specified;
         * must be non-negative.
         * @param {number} h Height to be used if x,y are specified;
         * @return {void}
         */
        Quadtree.prototype.add = function (obj, x, y, w, h) {
            var bounds;
            if (!(obj instanceof TreeObject) && (x === undefined || x === null)) {
                throw new Error('Invalid bounds for added object');
            }
            if (x instanceof go_1.Rect) {
                bounds = x.copy();
            }
            else {
                bounds = new go_1.Rect(x, y, w, h);
            }
            var treeObj;
            if (obj instanceof TreeObject) {
                treeObj = obj;
                obj = treeObj.obj;
                bounds = treeObj.bounds;
            }
            else {
                treeObj = new TreeObject(bounds, obj);
            }
            if (isNaN(bounds.x) || bounds.x === Infinity ||
                isNaN(bounds.y) || bounds.y === Infinity ||
                isNaN(bounds.width) || bounds.width === Infinity ||
                isNaN(bounds.height) || bounds.height === Infinity) {
                throw new Error('Invalid rectangle, contains NaN or Infinity properties');
            }
            this._hasZeroWidthObject = this._hasZeroWidthObject || bounds.width === 0;
            this._hasZeroHeightObject = this._hasZeroHeightObject || bounds.height === 0;
            // initialize bounds of tree as the max width or height of the first object added
            if (this._root.bounds.width === 0 || this._root.bounds.height === 0) {
                var len = Math.max(bounds.width, bounds.height);
                this._root.bounds = new go_1.Rect(bounds.x, bounds.y, len, len);
            }
            // fixes quadtree having a width and height of 0 if the first object added is a point
            // this will only be called after a second object is added, the new width/height is the maximum distance between them
            if (this._root.bounds !== undefined && (this._root.bounds.width === 0 || this._root.bounds.height === 0)) {
                var len = Math.max(Math.abs(bounds.x - this._root.bounds.x), Math.abs(bounds.y - this._root.bounds.y));
                this._root.bounds = new go_1.Rect(Math.min(this._root.bounds.x, bounds.x), Math.min(this._root.bounds.y, bounds.y), len, len);
            }
            // map the object to its corresponding TreeObject (so that the bounds of this object can be retrieved later)
            this._treeObjectMap.add(obj, treeObj);
            // grow as many times as necessary to fit the new object
            while (!this._root.bounds.containsRect(bounds)) {
                var old = this._root;
                this.walk(this._increaseLevel, old);
                var intersectsTopBound = bounds.y < this._root.bounds.y;
                var intersectsBottomBound = bounds.y + bounds.height > this._root.bounds.y + this._root.bounds.height;
                var intersectsRightBound = bounds.x + bounds.width > this._root.bounds.x + this._root.bounds.width;
                var intersectsLeftBound = bounds.x < this._root.bounds.x;
                if ((intersectsTopBound && intersectsRightBound) || (intersectsTopBound && !intersectsLeftBound)) {
                    /*  _______
                     * | 1 | 0 |
                     * |___|___|
                     * |old| 3 |
                     * |___|___|
                     */
                    var newBounds = new go_1.Rect(this._root.bounds.x, this._root.bounds.y - this._root.bounds.height, this._root.bounds.width * 2, this._root.bounds.height * 2);
                    this._root = new QuadNode(newBounds, null, 0);
                    this._root.split();
                    this._root.nodes[2] = old;
                    this._root.totalObjects = old.totalObjects;
                    old.parent = this._root;
                    this._restructure(old);
                    this._restructureLevels(old);
                    if (this._hasZeroHeightObject) {
                        this._fixTopObjectPlacement(old);
                    }
                }
                else if (intersectsTopBound && intersectsLeftBound) {
                    /*  _______
                     * | 1 | 0 |
                     * |___|___|
                     * | 2 |old|
                     * |___|___|
                     */
                    var newBounds = new go_1.Rect(this._root.bounds.x - this._root.bounds.width, this._root.bounds.y - this._root.bounds.height, this._root.bounds.width * 2, this._root.bounds.height * 2);
                    this._root = new QuadNode(newBounds, null, 0);
                    this._root.split();
                    this._root.nodes[3] = old;
                    this._root.totalObjects = old.totalObjects;
                    old.parent = this._root;
                    this._restructure(old);
                    this._restructureLevels(old);
                    if (this._hasZeroWidthObject) {
                        this._fixLeftObjectPlacement(old);
                    }
                    if (this._hasZeroHeightObject) {
                        this._fixTopObjectPlacement(old);
                    }
                }
                else if ((intersectsBottomBound && intersectsRightBound) || ((intersectsRightBound || intersectsBottomBound) && !intersectsLeftBound)) {
                    /*  _______
                     * |old| 0 |
                     * |___|___|
                     * | 2 | 3 |
                     * |___|___|
                     */
                    var newBounds = new go_1.Rect(this._root.bounds.x, this._root.bounds.y, this._root.bounds.width * 2, this._root.bounds.height * 2);
                    this._root = new QuadNode(newBounds, null, 0);
                    this._root.split();
                    this._root.nodes[1] = old;
                    this._root.totalObjects = old.totalObjects;
                    old.parent = this._root;
                    this._restructure(old);
                    this._restructureLevels(old);
                }
                else if ((intersectsBottomBound && intersectsLeftBound) || intersectsLeftBound) {
                    /*  _______
                     * | 1 |old|
                     * |___|___|
                     * | 2 | 3 |
                     * |___|___|
                     */
                    var newBounds = new go_1.Rect(this._root.bounds.x - this._root.bounds.width, this._root.bounds.y, this._root.bounds.width * 2, this._root.bounds.height * 2);
                    this._root = new QuadNode(newBounds, null, 0);
                    this._root.split();
                    this._root.nodes[0] = old;
                    this._root.totalObjects = old.totalObjects;
                    old.parent = this._root;
                    this._restructure(old);
                    this._restructureLevels(old);
                    if (this._hasZeroWidthObject) {
                        this._fixLeftObjectPlacement(old);
                    }
                }
            }
            // add the object to the tree
            this._addHelper(this._root, treeObj);
        };
        /**
         * @hidden @internal
         * Helper function to recursively perform the add operation
         * on the tree.
         * @this {Quadtree}
         * @param {QuadNode<T>} root the current node being operated on
         * @param {TreeObject<T>} treeObj the object being added
         * @return {void}
         */
        Quadtree.prototype._addHelper = function (root, treeObj) {
            root.totalObjects++;
            if (root.nodes[0]) {
                var index = this._getIndex(treeObj.bounds, root);
                if (index !== -1) {
                    var selected = root.nodes[index];
                    if (selected !== null) {
                        this._addHelper(selected, treeObj);
                        return;
                    }
                }
            }
            root.treeObjects.push(treeObj);
            root.objects.push(treeObj.obj);
            if (root.treeObjects.length > this._nodeCapacity && root.level < this._maxLevels) {
                if (!root.nodes[0]) {
                    root.split();
                }
                var i = 0;
                while (i < root.treeObjects.length) {
                    var index = this._getIndex(root.treeObjects[i].bounds, root);
                    if (index !== -1 && !(root.treeObjects[i].bounds.width === 0 || root.treeObjects[i].bounds.height === 0)) {
                        root.objects.splice(i, 1);
                        var selected = root.nodes[index];
                        if (selected !== null) {
                            this._addHelper(selected, root.treeObjects.splice(i, 1)[0]);
                        }
                    }
                    else {
                        i++;
                    }
                }
            }
        };
        /**
         * @hidden @internal
         * Increases the level of the given {@link Quadtree}. Given as an argument
         * to {@link #walk} in {@link #add} and defined here to
         * avoid creation of a new function every time {@link #add} is
         * called.
         * @this {Quadtree}
         * @param {QuadNode<T>} n the node to increase the level of
         * @return {void}
         */
        Quadtree.prototype._increaseLevel = function (n) {
            n.level += 1;
        };
        /**
         * @hidden @internal
         * Recursively moves objects placed on the right side of a vertical border
         * between two nodes to the left side of the vertical border. This allows
         * them to be located by {@link #_getIndex}. This function is called
         * after an {@link #add} call grows the Quadtree, but only if there
         * are 0 width objects in the tree.
         * @this {Quadtree}
         * @param {QuadNode<T>} root the current root node being operated on
         * @return {void}
         */
        Quadtree.prototype._fixLeftObjectPlacement = function (root) {
            var nw = root.nodes[1];
            if (nw !== null) { // if root is split
                this._fixLeftObjectPlacement(nw); // NW
                var sw = root.nodes[2];
                if (sw !== null) {
                    this._fixLeftObjectPlacement(sw); // SW
                }
            }
            var toRemove = [];
            var toAdd = [];
            for (var i = 0; i < root.objects.length; i++) {
                var obj = root.treeObjects[i];
                if (obj.bounds.width === 0 && obj.bounds.x === root.bounds.x) {
                    toRemove.push(i);
                    toAdd.push(obj);
                }
            }
            this._removeFromOwner(root, toRemove);
            for (var _i = 0, toAdd_1 = toAdd; _i < toAdd_1.length; _i++) {
                var obj = toAdd_1[_i];
                this.add(obj.obj, obj.bounds);
            }
        };
        /**
         * @hidden @internal
         * Recursively moves objects placed on the bottom side of a horizontal border
         * between two nodes to the top side of the vertical border. This allows
         * them to be located by {@link #_getIndex}. This function is called
         * after an {@link #add} call grows the Quadtree, but only if there
         * are 0 height objects in the tree.
         * @this {Quadtree}
         * @param {QuadNode<T>} root the current root node being operated on
         * @return {void}
         */
        Quadtree.prototype._fixTopObjectPlacement = function (root) {
            var ne = root.nodes[0];
            if (ne !== null) { // if root is split
                this._fixTopObjectPlacement(ne); // NE
                var nw = root.nodes[1];
                if (nw !== null) {
                    this._fixTopObjectPlacement(nw); // NW
                }
            }
            var toRemove = [];
            var toAdd = [];
            for (var i = 0; i < root.objects.length; i++) {
                var obj = root.treeObjects[i];
                if (obj.bounds.height === 0 && obj.bounds.y === root.bounds.y) {
                    toRemove.push(i);
                    toAdd.push(obj);
                }
            }
            this._removeFromOwner(root, toRemove);
            for (var _i = 0, toAdd_2 = toAdd; _i < toAdd_2.length; _i++) {
                var obj = toAdd_2[_i];
                this.add(obj);
            }
        };
        /**
         * @hidden @internal
         * Moves all objects from a leaf node to its parent and unsplits.
         * Used after growing the tree when level>max level.
         * @this {Quadtree}
         * @param {QuadNode<T>} node the leaf node to restructure
         * @return {void}
         */
        Quadtree.prototype._restructureLevels = function (node) {
            if (node && this._maxLevels < Infinity && node.nodes[0] !== null) {
                if (node.level >= this._maxLevels) {
                    for (var i = 0; i < node.nodes.length; i++) {
                        var selected = node.nodes[i];
                        if (selected !== null) {
                            node.objects.push.apply(node.objects, selected.objects);
                            node.treeObjects.push.apply(node.treeObjects, selected.treeObjects);
                            selected.clear();
                            node.nodes[i] = null;
                        }
                    }
                }
                else {
                    for (var i = 0; i < node.nodes.length; i++) {
                        var selected = node.nodes[i];
                        if (selected !== null) {
                            this._restructureLevels(selected);
                        }
                    }
                }
            }
        };
        /**
         * Return the node that contains the given object.
         * @this {Quadtree}
         * @param {T} obj the object to find
         * @return {QuadNode<T>} the node containing the given object, null if the object is not found
         */
        Quadtree.prototype.find = function (obj) {
            var treeObj = this._treeObjectMap.get(obj);
            if (treeObj) {
                return this._findHelper(this._root, treeObj);
            }
            return null;
        };
        Quadtree.prototype._findHelper = function (root, treeObj) {
            for (var _i = 0, _a = root.treeObjects; _i < _a.length; _i++) {
                var object = _a[_i];
                if (object === treeObj) {
                    return root;
                }
            }
            var index = this._getIndex(treeObj.bounds, root);
            var selected = index === -1 ? null : root.nodes[index];
            if (selected !== null) {
                var result = this._findHelper(selected, treeObj);
                if (result) {
                    return result;
                }
            }
            return null;
        };
        /**
         * Convenience method, calls {@link #find} and returns a boolean
         * indicating whether or not the tree contains the given object
         * @this {Quadtree}
         * @param {T} obj the object to check for
         * @return {boolean} whether or not the given object is present in the tree
         */
        Quadtree.prototype.has = function (obj) {
            return !!this.find(obj);
        };
        /**
         * Checks if any of the objects in the tree have the given boundaries
         * @this {Quadtree}
         * @param {Rect} bounds the rectangle to check for
         * @return {Rect} the actual bounds object stored in the tree
         */
        Quadtree.prototype.findBounds = function (bounds) {
            if (bounds) {
                return this._findBoundsHelper(this._root, bounds);
            }
            return null;
        };
        Quadtree.prototype._findBoundsHelper = function (root, bounds) {
            for (var _i = 0, _a = root.treeObjects; _i < _a.length; _i++) {
                var object = _a[_i];
                if (bounds.equalsApprox(object.bounds)) {
                    return bounds;
                }
            }
            var index = this._getIndex(bounds, root);
            var selected = index === -1 ? null : root.nodes[index];
            if (selected !== null) {
                return this._findBoundsHelper(selected, bounds);
            }
            return null;
        };
        /**
         * Remove the given object from the tree, restructuring to
         * get rid of empty nodes that are unneeded.
         * @this {Quadtree}
         * @param {T} obj the object to remove
         * @return {boolean} whether or not the deletion was successful. False when the object is not in the tree.
         */
        Quadtree.prototype.remove = function (obj) {
            var treeObj = this._treeObjectMap.get(obj);
            if (treeObj) {
                var owner = this._findHelper(this._root, treeObj);
                if (owner) {
                    owner.treeObjects.splice(owner.treeObjects.indexOf(treeObj), 1);
                    owner.objects.splice(owner.objects.indexOf(obj), 1);
                    owner.totalObjects--;
                    this._treeObjectMap.remove(obj);
                    var parent_1 = owner.parent;
                    while (parent_1) {
                        parent_1.totalObjects--;
                        parent_1 = parent_1.parent;
                    }
                    if (owner.nodes[0] && owner.totalObjects <= this._nodeCapacity) {
                        this._addChildObjectsToNode(owner, owner);
                        for (var i = 0; i < owner.nodes.length; i++) {
                            var selected = owner.nodes[i];
                            if (selected !== null) {
                                selected.clear();
                            }
                            owner.nodes[i] = null;
                        }
                    }
                    this._restructure(owner);
                    return true;
                }
            }
            return false;
        };
        /**
         * Removes multiple objects at the given indices from the given owner. Similar
         * to the normal remove function, but much faster when the owner and indices are
         * already known.
         * @this {Quadtree}
         * @param {QuadNode<T>} owner the node to remove objects from
         * @param {Array<number>} indexes the indices to remove. Should be given in ascending order.
         */
        Quadtree.prototype._removeFromOwner = function (owner, indexes) {
            if (indexes.length === 0) {
                return;
            }
            for (var i = indexes.length - 1; i >= 0; i--) {
                this._treeObjectMap.remove(owner.objects[indexes[i]]);
                owner.treeObjects.splice(indexes[i], 1);
                owner.objects.splice(indexes[i], 1);
            }
            owner.totalObjects -= indexes.length;
            var parent = owner.parent;
            while (parent) {
                parent.totalObjects -= indexes.length;
                parent = parent.parent;
            }
            if (owner.nodes[0] && owner.totalObjects <= this._nodeCapacity) {
                this._addChildObjectsToNode(owner, owner);
                for (var i = 0; i < owner.nodes.length; i++) {
                    var selected = owner.nodes[i];
                    if (selected !== null) {
                        selected.clear();
                    }
                    owner.nodes[i] = null;
                }
            }
            this._restructure(owner);
        };
        /**
         * @hidden @internal
         * Recursively adds all objects from children of the given
         * root tree to the given owner tree
         * Used internally by {@link #remove}
         * @this {Quadtree}
         * @param {Quadtree} owner the tree to add objects to
         * @return {void}
         */
        Quadtree.prototype._addChildObjectsToNode = function (owner, root) {
            for (var _i = 0, _a = root.nodes; _i < _a.length; _i++) {
                var node = _a[_i];
                if (node) {
                    owner.treeObjects.push.apply(owner.treeObjects, node.treeObjects);
                    owner.objects.push.apply(owner.objects, node.objects);
                    this._addChildObjectsToNode(owner, node);
                }
            }
        };
        /**
         * @hidden @internal
         * Recursively combines parent nodes that should be split, all the way
         * up the tree. Starts from the given node.
         * @this {Quadtree}
         * @return {void}
         */
        Quadtree.prototype._restructure = function (root) {
            var parent = root.parent;
            if (parent) {
                // if none of the child nodes have any objects, the parent should not be split
                var childrenHaveNoObjects = true;
                for (var _i = 0, _a = parent.nodes; _i < _a.length; _i++) {
                    var node = _a[_i];
                    if (node !== null && node.totalObjects > 0) {
                        childrenHaveNoObjects = false;
                        break;
                    }
                }
                // unsplit children and move nodes to parent
                if (parent.totalObjects <= this._nodeCapacity || childrenHaveNoObjects) {
                    for (var i = 0; i < parent.nodes.length; i++) {
                        var selected = parent.nodes[i];
                        if (selected !== null) {
                            parent.objects.push.apply(parent.objects, selected.objects);
                            parent.treeObjects.push.apply(parent.treeObjects, selected.treeObjects);
                            selected.clear();
                            parent.nodes[i] = null;
                        }
                    }
                    this._restructure(parent);
                }
            }
        };
        /**
         * Can be called as either (obj, x, y) or (obj, point). Translate
         * the given object to given x and y coordinates or to a given {@link Point}.
         * @this {Quadtree}
         * @param {T} obj the object to move
         * @param {number|Point} x the x coordinate or Point to move the object to
         * @param {number} y the y coordinate to move the object to
         * @return {boolean} whether or not the move was successful. False if the object was not in the tree.
         */
        Quadtree.prototype.move = function (obj, x, y) {
            var treeObj = this._treeObjectMap.get(obj);
            if (treeObj && this.remove(obj)) {
                if (x instanceof go_1.Point) {
                    treeObj.bounds.x = x.x;
                    treeObj.bounds.y = x.y;
                }
                else if (y !== undefined) {
                    treeObj.bounds.x = x;
                    treeObj.bounds.y = y;
                }
                else {
                    throw new Error('Please provide the position as either a Point or two numbers');
                }
                this.add(treeObj);
                return true;
            }
            return false;
        };
        /**
         * Can be called as either (obj, width, height) or (obj, size). Resize
         * the given object to given width and height or to a given {@link Size}.
         * @this {Quadtree}
         * @param {T} obj the object to resize
         * @param {number|Size} width the width or Size to resize the object to
         * @param {number} height the height to resize the object to
         * @return {boolean} whether or not the resize was successful. False if the object was not in the tree.
         */
        Quadtree.prototype.resize = function (obj, width, height) {
            var treeObj = this._treeObjectMap.get(obj);
            if (treeObj && this.remove(obj)) {
                if (width instanceof go_1.Size) {
                    treeObj.bounds.width = width.width;
                    treeObj.bounds.height = width.height;
                }
                else if (height !== undefined) {
                    treeObj.bounds.width = width;
                    treeObj.bounds.height = height;
                }
                else {
                    throw new Error('Please provide the size as either a Size or two numbers');
                }
                this.add(treeObj);
                return true;
            }
            return false;
        };
        /**
         * Updates the given object to have the bounds given, provided as either a
         * {@link Rect} or x, y, width, and height.
         * @this {Quadtree}
         * @param obj the object to change the bounds of
         * @param x the x-coordinate or Rect to set the object to
         * @param y the y-coordinate to set the object to, unnecessary if a Rect was given
         * @param width the width to set the object to, unnecessary if a Rect was given
         * @param height the height to set the object to, unnecessary if a Rect was given
         */
        Quadtree.prototype.setTo = function (obj, x, y, width, height) {
            var treeObj = this._treeObjectMap.get(obj);
            if (treeObj && this.remove(obj)) {
                if (x instanceof go_1.Rect) {
                    treeObj.bounds.set(x);
                }
                else if (y !== undefined && width !== undefined && height !== undefined) {
                    treeObj.bounds.setTo(x, y, width, height);
                }
                else {
                    throw new Error('Please provide new bounds as either a Rect or combination of four numbers (x, y, width, height)');
                }
                this.add(treeObj);
                return true;
            }
            return false;
        };
        /**
         * Return all objects that intersect (wholly or partially) with
         * the given {@link Rect} or {@link Point}. Touching edges and
         * objects overlapping by 1e-7 or less (to account for floating
         * point error) are both not considered intersections.
         * @this {Quadtree}
         * @param {Rect|Point} rect the Rect or Point to check intersections for. If a point is given, a Rect with size (0, 0) is created for intersection calculations.
         * @return {Array<T>} array containing all intersecting objects
         */
        Quadtree.prototype.intersecting = function (rect) {
            if (rect instanceof go_1.Point) {
                rect = new go_1.Rect(rect.x, rect.y, 0, 0);
            }
            var returnObjects = [];
            this._intersectingHelper(rect, this._root, returnObjects);
            return returnObjects;
        };
        Quadtree.prototype._intersectingHelper = function (rect, root, returnObjects) {
            var index = this._getIndex(rect, root);
            var selected = index === -1 ? null : root.nodes[index];
            if (selected !== null) {
                this._intersectingHelper(rect, selected, returnObjects);
            }
            else if (root.nodes[0] !== null) {
                var quadrants = this._getQuadrants(rect, root);
                for (var _i = 0, quadrants_1 = quadrants; _i < quadrants_1.length; _i++) {
                    var quadrant = quadrants_1[_i];
                    var node = root.nodes[quadrant];
                    if (node !== null) {
                        this._intersectingHelper(rect, node, returnObjects);
                    }
                }
            }
            for (var _a = 0, _b = root.treeObjects; _a < _b.length; _a++) {
                var obj = _b[_a];
                if (Quadtree._rectsIntersect(obj.bounds, rect)) {
                    returnObjects.push(obj.obj);
                }
            }
        };
        /**
         * @hidden @internal
         * Return all TreeObjects that intersect (wholly or partially)
         * with the given {@link Rect} or {@link Point}. Touching edges
         * are not considered intersections.
         * @this {Quadtree}
         * @param {Rect|Point} rect the Rect or Point to check intersections for. If a point is given, a Rect with size (0, 0) is created for intersection calculations.
         * @return {Array<TreeObject>} array containing all intersecting TreeObjects
         */
        Quadtree.prototype._intersectingTreeObjs = function (rect) {
            if (rect instanceof go_1.Point) {
                rect = new go_1.Rect(rect.x, rect.y, 0, 0);
            }
            var returnObjects = [];
            this._intersectingTreeObjsHelper(rect, this._root, returnObjects);
            return returnObjects;
        };
        Quadtree.prototype._intersectingTreeObjsHelper = function (rect, root, returnObjects) {
            var index = this._getIndex(rect, root);
            var selected = index === -1 ? null : root.nodes[index];
            if (selected !== null) {
                this._intersectingTreeObjsHelper(rect, selected, returnObjects);
            }
            else if (root.nodes[0]) {
                var quadrants = this._getQuadrants(rect, root);
                for (var _i = 0, quadrants_2 = quadrants; _i < quadrants_2.length; _i++) {
                    var quadrant = quadrants_2[_i];
                    var node = root.nodes[quadrant];
                    this._intersectingTreeObjsHelper(rect, root, returnObjects);
                }
            }
            for (var _a = 0, _b = root.treeObjects; _a < _b.length; _a++) {
                var obj = _b[_a];
                if (Quadtree._rectsIntersect(obj.bounds, rect)) {
                    returnObjects.push(obj);
                }
            }
        };
        /**
         * @hidden @internal
         * Similar as {@link Rect.intersectsRect}, but doesn't count edges as intersections.
         * Also accounts for floating error (by returning false more often) up to an error of 1e-7.
         * Used by {@link #intersecting}.
         * @this {Quadtree}
         * @param {Rect} r1 first rectangle
         * @param {Rect} r2 second rectangle
         * @return {boolean} whether or not the two rectangles intersect
         */
        Quadtree._rectsIntersect = function (r1, r2) {
            return !(r2.left + 1e-7 >= r1.right || r2.right - 1e-7 <= r1.left || r2.top + 1e-7 >= r1.bottom || r2.bottom - 1e-7 <= r1.top);
        };
        /**
         * Return all objects that fully contain the given {@link Rect} or {@link Point}.
         * @this {Quadtree}
         * @param {Rect|Point} rect the Rect or Point to check containing for. If a point is given, a Rect with size (0, 0) is created for containment calculations.
         * @return {Array<T>} array containing all containing objects
         */
        Quadtree.prototype.containing = function (rect) {
            if (rect instanceof go_1.Point) {
                rect = new go_1.Rect(rect.x, rect.y, 0, 0);
            }
            var returnObjects = [];
            this._containingHelper(rect, this._root, returnObjects);
            return returnObjects;
        };
        Quadtree.prototype._containingHelper = function (rect, root, returnObjects) {
            var index = this._getIndex(rect, root);
            var selected = index === -1 ? null : root.nodes[index];
            if (selected !== null) {
                this._containingHelper(rect, selected, returnObjects);
            }
            else if (root.nodes[0]) {
                var quadrants = this._getQuadrants(rect, root);
                for (var _i = 0, quadrants_3 = quadrants; _i < quadrants_3.length; _i++) {
                    var quadrant = quadrants_3[_i];
                    var node = root.nodes[quadrant];
                    if (node !== null) {
                        this._containingHelper(rect, node, returnObjects);
                    }
                }
            }
            for (var _a = 0, _b = root.treeObjects; _a < _b.length; _a++) {
                var obj = _b[_a];
                if (obj.bounds.containsRect(rect)) {
                    returnObjects.push(obj.obj);
                }
            }
        };
        /**
         * A slightly briefer and more semantic sounding way to call {@link #intersecting}. See
         * {@link #intersecting} for details.
         * @this {Quadtree}
         * @param {Point} point the point to check intersections for
         * @return {Array<T>} array containing all intersecting objects
         */
        Quadtree.prototype.at = function (point) {
            return this.intersecting(point);
        };
        /**
         * Returns the square of the distance from the centers of the given objects
         * @this {Quadtree}
         * @param {T} obj1
         * @param {T} obj2
         * @return {number} square of the distance between the centers of obj1 and obj2
         */
        Quadtree.prototype.distanceSquared = function (obj1, obj2) {
            var owner1 = this.find(obj1);
            var owner2 = this.find(obj2);
            if (owner1 !== null && owner2 !== null) {
                var treeObj1 = this._treeObjectMap.get(obj1);
                var treeObj2 = this._treeObjectMap.get(obj2);
                if (treeObj1 !== null && treeObj2 !== null) {
                    return treeObj1.bounds.center.distanceSquaredPoint(treeObj2.bounds.center);
                }
            }
            return -1;
        };
        /**
         * Recursively traverses the tree (depth first) and executes the
         * given callback on each node.
         * @this {Quadtree}
         * @param {function} callback the callback to execute on each node. Takes the form of (n: Quadtree) => void
         * @param {boolean} root whether or not to execute the callback on the root node as well. Defaults to true
         * @return {void}
         */
        Quadtree.prototype.walk = function (callback, node, root) {
            if (node === void 0) { node = this._root; }
            if (root === void 0) { root = true; }
            if (root) {
                root = false;
                callback(node);
            }
            for (var _i = 0, _a = node.nodes; _i < _a.length; _i++) {
                var n = _a[_i];
                if (n) {
                    callback(n);
                    this.walk(callback, n, root);
                }
            }
        };
        /**
         * Visits every object stored in the tree (depth first)
         * @this {Quadtree}
         * @param {function} callback the callback to execute on each object.
         * @return {void}
         */
        Quadtree.prototype.forEach = function (callback) {
            this.walk(function (n) {
                for (var _i = 0, _a = n.objects; _i < _a.length; _i++) {
                    var obj = _a[_i];
                    callback(obj);
                }
            });
        };
        /**
         * Finds the most furthest object in each direction stored in the tree.
         * Bounds are tested using the center x and y coordinate.
         * @this {Quadtree}
         * @return {Array<T>} maximum and minimum objects in the tree, in the format [min x, max x, min y, max y].
         */
        Quadtree.prototype.findExtremeObjects = function () {
            var _a = this._findExtremeObjectsHelper(), extremes0 = _a[0], extremes1 = _a[1], extremes2 = _a[2], extremes3 = _a[3];
            return [
                extremes0 !== null ? extremes0.obj : null,
                extremes1 !== null ? extremes1.obj : null,
                extremes2 !== null ? extremes2.obj : null,
                extremes3 !== null ? extremes3.obj : null
            ];
        };
        /**
         * @hidden @internal
         * Recursive helper function for {@link #findExtremeObjects}
         * @this {Quadtree}
         * @param {QuadNode<T>} root the current root node being searched
         * @return {Array<TreeObject<T>>} maximum and minimum objects in the tree, in the format [min x, max x, min y, max y].
         */
        Quadtree.prototype._findExtremeObjectsHelper = function (root) {
            if (root === void 0) { root = this._root; }
            var minX = null;
            var maxX = null;
            var minY = null;
            var maxY = null;
            if (root.nodes[0]) { // if root is split
                for (var _i = 0, _a = root.nodes; _i < _a.length; _i++) {
                    var node = _a[_i];
                    if (node !== null) {
                        var _b = this._findExtremeObjectsHelper(node), extremes0 = _b[0], extremes1 = _b[1], extremes2 = _b[2], extremes3 = _b[3];
                        if (minX == null || (extremes0 !== null && extremes0.bounds.centerX < minX.bounds.centerX)) {
                            minX = extremes0;
                        }
                        if (maxX === null || (extremes1 !== null && extremes1.bounds.centerX > maxX.bounds.centerX)) {
                            maxX = extremes1;
                        }
                        if (minY === null || (extremes2 !== null && extremes2.bounds.centerY < minY.bounds.centerY)) {
                            minY = extremes2;
                        }
                        if (maxY === null || (extremes3 !== null && extremes3.bounds.centerY > maxY.bounds.centerY)) {
                            maxY = extremes3;
                        }
                    }
                }
            }
            for (var _c = 0, _d = root.treeObjects; _c < _d.length; _c++) {
                var obj = _d[_c];
                if (!minX || obj.bounds.centerX < minX.bounds.centerX) {
                    minX = obj;
                }
                if (!maxX || obj.bounds.centerX > maxX.bounds.centerX) {
                    maxX = obj;
                }
                if (!minY || obj.bounds.centerY < minY.bounds.centerY) {
                    minY = obj;
                }
                if (!maxY || obj.bounds.centerY > maxY.bounds.centerY) {
                    maxY = obj;
                }
            }
            return [minX, maxX, minY, maxY];
        };
        return Quadtree;
    }());
    exports.Quadtree = Quadtree;
});
