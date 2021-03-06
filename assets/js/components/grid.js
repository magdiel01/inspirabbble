'use strict';

define(
    [
        'jquery',
        'components/options',
        'eventEmitter/EventEmitter',
        'utils/templates',
        'imagesloaded'
    ], function(
        $,
        options,
        EventEmitter,
        templates
    ) {

        var ee = new EventEmitter();
        var events = {
            complete: 'complete'
        };

        // Class definition //

        var Grid = function(target) {
            this.$target = $(target);
            this.$grid = $(templates.grid());
            this.$target.html(this.$grid);
            this.$queue = 0;
            this.resize();
        };

        // Methods //

        /**
         * Add an element to the grid.
         *
         * @param html string|DOMNode|jQuery The element to add.
         */
        Grid.prototype.add = function(html) {
            this.$queue++;
            $(html).imagesLoaded(function() {
                this.prepend(html);
                --this.$queue;
                if (!this.$queue) {
                    ee.emitEvent(events.complete);
                }
            }.bind(this));
        };

        /**
         * Return all columns available.
         */
        Grid.prototype.cols = function() {
            return this.$target.find('.col:visible');
        };

        /**
         * Refresh the view.
         */
        Grid.prototype.refresh = function() {
            var cols = this.cols();
            var children = cols.children();
            cols.empty();
            children.each(function(index, child) {
                this.prepend(child);
            }.bind(this));
        };

        /**
         * Resize the view.
         */
        Grid.prototype.resize = function() {
            this.$target.height($(window).height() - (this.$target.outerHeight(true) - this.$target.height()));
        };

        /**
         * Prepend an element to the view.
         */
        Grid.prototype.prepend = function(html) {
            var cols = this.cols();
            var col = cols.first();
            cols.each(function() {
                var $this = $(this);
                col = col.height() < $this.height() ? col : $this;
            });
            col.prepend(html);
        };

        /**
         * Move the grid to make the next row visible.
         */
        Grid.prototype.next = function() {
            var rowHeight = this.rowHeight();
            var remaining = this.$grid.height() - this.$target.height() + (parseInt(this.$grid.css('top'), 10) || 0);
            if (remaining > rowHeight) {
                this.$grid.css('top', '-=' + rowHeight);
            } else {
                this.$grid.css('top', (this.$target.height() - this.$grid.height()));
            }
        };

        /**
         * Move the grid to make the previous row visible.
         */
        Grid.prototype.prev = function() {
            var rowHeight = this.rowHeight();
            var remaining = -parseInt(this.$grid.css('top'), 10) || 0;
            var inperfections = (remaining % rowHeight);
            if (inperfections) {
                this.$grid.css('top', '+=' + inperfections);
                this.$lastRow = false;
            } else if (remaining > rowHeight) {
                this.$grid.css('top', '+=' + rowHeight);
            } else {
                this.$grid.css('top', 0);
            }
        };

        /**
         * Return the virtual row height.
         */
        Grid.prototype.rowHeight = function() {
            var children = this.cols().first().children();
            if (children.length >= 2) {
                return children.eq(1).offset().top - children.eq(0).offset().top;
            }
            return 0;
        };

        // Events //

        /**
         * Listen to a event.
         *
         * @param event string The name of the event to listen.
         * @param listener function The function to execute.
         */
        Grid.prototype.on = function(event, listener) {
            ee.addListener(event, listener);
        };

        return Grid;

    }
);
