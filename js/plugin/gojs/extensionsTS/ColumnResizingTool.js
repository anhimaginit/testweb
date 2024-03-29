/*
*  Copyright (C) 1998-2019 by Northwoods Software Corporation. All Rights Reserved.
*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../release/go"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var go = require("../release/go");
    /**
     * The ColumnResizingTool class lets the user resize each column of a named Table Panel in a selected Part.
     *
     * If you want to experiment with this extension, try the <a href="../../extensionsTS/ColumnResizing.html">Column Resizing</a> sample.
     * @category Tool Extension
     */
    var ColumnResizingTool = /** @class */ (function (_super) {
        __extends(ColumnResizingTool, _super);
        /**
         * Constructs a ColumnResizingTool and sets the handle and name of the tool.
         */
        function ColumnResizingTool() {
            var _this = _super.call(this) || this;
            _this._tableName = 'TABLE';
            // internal state
            _this._handle = null;
            _this._adornedTable = null;
            var h = new go.Shape();
            h.geometryString = 'M0 0 V14 M2 0 V14';
            h.desiredSize = new go.Size(2, 14);
            h.cursor = 'col-resize';
            h.geometryStretch = go.GraphObject.None;
            h.background = 'rgba(255,255,255,0.5)';
            h.stroke = 'rgba(30,144,255,0.5)';
            _this._handleArchetype = h;
            _this.name = 'ColumnResizing';
            return _this;
        }
        Object.defineProperty(ColumnResizingTool.prototype, "handleArchetype", {
            /**
             * Gets or sets small GraphObject that is copied as a resize handle for each column.
             * This tool expects that this object's {@link GraphObject#desiredSize} (a.k.a width and height) has been set to real numbers.
             *
             * The default value is a {@link Shape} that is a narrow rectangle.
             */
            get: function () { return this._handleArchetype; },
            set: function (val) { this._handleArchetype = val; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ColumnResizingTool.prototype, "tableName", {
            /**
             * Gets or sets the name of the Table Panel to be resized.
             *
             * The default value is the name "TABLE".
             */
            get: function () { return this._tableName; },
            set: function (val) { this._tableName = val; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ColumnResizingTool.prototype, "handle", {
            /**
             * This read-only property returns the {@link GraphObject} that is the tool handle being dragged by the user.
             * This will be contained by an {@link Adornment} whose category is "ColumnResizing".
             * Its {@link Adornment#adornedObject} is the same as the {@link #adornedTable}.
             */
            get: function () { return this._handle; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ColumnResizingTool.prototype, "adornedTable", {
            /**
             * This read-only property returns the {@link Panel} of type {@link Panel#Table} whose columns are being resized.
             * This must be contained within the selected {@link Part}.
             */
            get: function () { return this._adornedTable; },
            enumerable: true,
            configurable: true
        });
        /**
         * Show an {@link Adornment} with a resize handle at each column.
         * Don't show anything if {@link #tableName} doesn't identify a {@link Panel}
         * that has a {@link Panel#type} of type {@link Panel#Table}.
         */
        ColumnResizingTool.prototype.updateAdornments = function (part) {
            if (part === null || part instanceof go.Link)
                return; // this tool never applies to Links
            if (part.isSelected && !this.diagram.isReadOnly) {
                var selelt = part.findObject(this.tableName);
                if (selelt instanceof go.Panel && selelt.actualBounds.isReal() && selelt.isVisibleObject() &&
                    part.actualBounds.isReal() && part.isVisible() &&
                    selelt.type === go.Panel.Table) {
                    var table_1 = selelt;
                    var adornment = part.findAdornment(this.name);
                    if (adornment === null) {
                        adornment = this.makeAdornment(table_1);
                        part.addAdornment(this.name, adornment);
                    }
                    if (adornment !== null) {
                        var pad_1 = table_1.padding;
                        var numcols_1 = table_1.columnCount;
                        // update the position/alignment of each handle
                        adornment.elements.each(function (h) {
                            if (!h.pickable)
                                return;
                            var coldef = table_1.getColumnDefinition(h.column);
                            var wid = coldef.actual;
                            if (wid > 0)
                                wid = coldef.total;
                            var sep = 0;
                            // find next non-zero-width column's separatorStrokeWidth
                            var idx = h.column + 1;
                            while (idx < numcols_1 && table_1.getColumnDefinition(idx).actual === 0)
                                idx++;
                            if (idx < numcols_1) {
                                sep = table_1.getColumnDefinition(idx).separatorStrokeWidth;
                                if (isNaN(sep))
                                    sep = table_1.defaultColumnSeparatorStrokeWidth;
                            }
                            h.alignment = new go.Spot(0, 0, pad_1.left + coldef.position + wid + sep / 2, pad_1.top + h.height / 2);
                        });
                        adornment.locationObject.desiredSize = table_1.actualBounds.size;
                        adornment.location = table_1.getDocumentPoint(adornment.locationSpot);
                        adornment.angle = table_1.getDocumentAngle();
                        return;
                    }
                }
            }
            part.removeAdornment(this.name);
        };
        /**
         * @hidden @internal
         * @param {Panel} table the Table Panel whose columns may be resized
         * @return {Adornment}
         */
        ColumnResizingTool.prototype.makeAdornment = function (table) {
            // the Adornment is a Spot Panel holding resize handles
            var adornment = new go.Adornment();
            adornment.category = this.name;
            adornment.adornedObject = table;
            adornment.type = go.Panel.Spot;
            adornment.locationObjectName = 'BLOCK';
            // create the "main" element of the Spot Panel
            var block = new go.TextBlock(); // doesn't matter much what this is
            block.name = 'BLOCK';
            block.pickable = false; // it's transparent and not pickable
            adornment.add(block);
            // now add resize handles for each column
            for (var i = 0; i < table.columnCount; i++) {
                var coldef = table.getColumnDefinition(i);
                var h = this.makeHandle(table, coldef);
                if (h !== null)
                    adornment.add(h);
            }
            return adornment;
        };
        /**
         * @hidden @internal
         * @param {Panel} table the Table Panel whose columns may be resized
         * @param {RowColumnDefinition} coldef the column definition to be resized
         * @return a copy of the {@link #handleArchetype}
         */
        ColumnResizingTool.prototype.makeHandle = function (table, coldef) {
            var h = this.handleArchetype;
            if (h === null)
                return null;
            var c = h.copy();
            c.column = coldef.index;
            return c;
        };
        /**
         * This tool may run when there is a mouse-down event on a "ColumnResizing" handle,
         * the diagram is not read-only, the left mouse button is being used,
         * and this tool's adornment's resize handle is at the current mouse point.
         */
        ColumnResizingTool.prototype.canStart = function () {
            if (!this.isEnabled)
                return false;
            var diagram = this.diagram;
            if (diagram.isReadOnly)
                return false;
            if (!diagram.lastInput.left)
                return false;
            var h = this.findToolHandleAt(diagram.firstInput.documentPoint, this.name);
            return (h !== null);
        };
        /**
         * Find the {@link #handle}, ensure type {@link Panel#Table}, capture the mouse, and start a transaction.
         *
         * If the call to {@link Tool#findToolHandleAt} finds no "ColumnResizing" tool handle, this method returns without activating this tool.
         */
        ColumnResizingTool.prototype.doActivate = function () {
            var diagram = this.diagram;
            this._handle = this.findToolHandleAt(diagram.firstInput.documentPoint, this.name);
            if (this.handle === null)
                return;
            var panel = this.handle.part.adornedObject;
            if (!panel || panel.type !== go.Panel.Table)
                return;
            this._adornedTable = panel;
            diagram.isMouseCaptured = true;
            this.startTransaction(this.name);
            this.isActive = true;
        };
        /**
         * Stop the current transaction and release the mouse.
         */
        ColumnResizingTool.prototype.doDeactivate = function () {
            this.stopTransaction();
            this._handle = null;
            this._adornedTable = null;
            var diagram = this.diagram;
            diagram.isMouseCaptured = false;
            this.isActive = false;
        };
        /**
         * Call {@link #resize} with a new size determined by the current mouse point.
         * This determines the new bounds by calling {@link #computeResize}.
         */
        ColumnResizingTool.prototype.doMouseMove = function () {
            var diagram = this.diagram;
            if (this.isActive) {
                var newpt = this.computeResize(diagram.lastInput.documentPoint);
                this.resize(newpt);
            }
        };
        /**
         * Call {@link #resize} with the final bounds based on the most recent mouse point, and commit the transaction.
         * This determines the new bounds by calling {@link #computeResize}.
         */
        ColumnResizingTool.prototype.doMouseUp = function () {
            var diagram = this.diagram;
            if (this.isActive) {
                var newpt = this.computeResize(diagram.lastInput.documentPoint);
                this.resize(newpt);
                this.transactionResult = this.name; // success
            }
            this.stopTool();
        };
        /**
         * Change the {@link RowColumnDefinition#width} of the column being resized
         * to a value corresponding to the given mouse point.
         * @param {Point} newPoint the value returned by the call to {@link #computeResize}
         */
        ColumnResizingTool.prototype.resize = function (newPoint) {
            var table = this.adornedTable;
            if (table === null)
                return;
            var h = this.handle;
            if (h === null)
                return;
            var pad = table.padding;
            var numcols = table.columnCount;
            var locpt = table.getLocalPoint(newPoint);
            var coldef = table.getColumnDefinition(h.column);
            var sep = 0;
            var idx = h.column + 1;
            while (idx < numcols && table.getColumnDefinition(idx).actual === 0)
                idx++;
            if (idx < numcols) {
                sep = table.getColumnDefinition(idx).separatorStrokeWidth;
                if (isNaN(sep))
                    sep = table.defaultColumnSeparatorStrokeWidth;
            }
            coldef.width = Math.max(0, locpt.x - pad.left - coldef.position - (coldef.total - coldef.actual) - sep / 2);
        };
        /**
         * This can be overridden in order to customize the resizing process.
         * @expose
         * @param {Point} p the point where the handle is being dragged
         * @return {Point}
         */
        ColumnResizingTool.prototype.computeResize = function (p) {
            return p;
        };
        /**
         * Pressing the Delete key removes any column width setting and stops this tool.
         */
        ColumnResizingTool.prototype.doKeyDown = function () {
            if (!this.isActive)
                return;
            var e = this.diagram.lastInput;
            if (e.key === 'Del' || e.key === '\t') { // remove width setting
                if (this.adornedTable !== null && this.handle !== null) {
                    var coldef = this.adornedTable.getColumnDefinition(this.handle.column);
                    coldef.width = NaN;
                    this.transactionResult = this.name; // success
                    this.stopTool();
                    return;
                }
            }
            _super.prototype.doKeyDown.call(this);
        };
        return ColumnResizingTool;
    }(go.Tool));
    exports.ColumnResizingTool = ColumnResizingTool;
});
