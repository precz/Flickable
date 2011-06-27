var Flickable = function(elementSelector, options) {
    
    var elements = document.querySelectorAll(elementSelector),
        i, j,
        events,
        settings = {
            itemSelector: 'ul',
            itemWidth: screen.width,
            offset: 0
        };
    
    // Extend settings with options from parameter
    if (options) {
        for (i in options) {
            if (options.hasOwnProperty(i)) {
                settings[i] = options[i];
            }
        }
    }
    
    // Detect if current device supports touch events, otherwise use mouse events
    if ('ontouchstart' in document.createElement('div')) {
        events = {
            start: 'touchstart',
            move: 'touchmove',
            end: 'touchend'
        };
    } else {
        events = {
            start: 'mousedown',
            move: 'mousemove',
            end: 'mouseup'
        };
    }
    
    // Set up flickables for all matched elements
    for (i = 0, j = elements.length; i < j; i++) {
        (function() {
            
            var element = elements[i],
                item = element.querySelector(settings.itemSelector),
                subItemCount = item.children.length,
                offset = settings.offset;

            // Set up default styles
            item.style.WebkitTransform = 'translate3d(0, 0, 0)';
            item.style.MozTransform = 'translateX(0)';
            item.style.OTransform = 'translateX(0)';
            item.style.transform = 'translateX(0)';
            item.style.width = (settings.itemWidth * subItemCount) + 'px';

            // Get X and Y value from a touch or mouse event
            var getXY = function(evt) {
                if (evt.touches && evt.touches.length) {
                    return [evt.touches[0].clientX, evt.touches[0].clientY];
                } else {
                    return [evt.clientX, evt.clientY];
                }
            };

            // Set up listener
            element.addEventListener(events.start, function(evt) {

                // Get origin position
                var origin = getXY(evt);
                var current = origin;

                // Disable animations while dragging
                item.style.WebkitTransition = '';
                item.style.MozTransition = '';
                item.style.OTransition = '';
                item.style.transition = '';

                // Reposition gallery based on event
                var reposition = function(evt) {
                    var distanceX = Math.abs(current[0] - origin[0]);
                    var distanceY = Math.abs(current[1] - origin[1]);

                    // Only scroll gallery if X distance is greater than Y distance
                    if (distanceX > distanceY) {
                        evt.preventDefault();
                    } else {
                        current[0] = origin[0];
                    }

                    // Get delta X distance
                    var delta = current[0] - origin[0];

                    // Make scrolling "sticky" if we are scrolling past the first or last panel
                    if (offset + delta > 0 || offset + delta < -((subItemCount-1) * settings.itemWidth)) {
                        delta = Math.floor(delta / 2);
                    }

                    // Update position
                    item.style.WebkitTransform = 'translate3d(' + (offset + delta) + 'px, 0, 0)';
                    item.style.MozTransform = 'translateX(' + (offset + delta) + 'px)';
                    item.style.OTransform = 'translateX(' + (offset + delta) + 'px)';
                    item.style.transform = 'translateX(' + (offset + delta) + 'px)';
                };

                var moveEvent = function(evt) {
                    current = getXY(evt);
                    reposition(evt);
                };

                var endEvent = function(evt) {
                    var diff = current[0] - origin[0];

                    // Enable animation
                    item.style.WebkitTransition = '-webkit-transform 0.4s ease';
                    item.style.MozTransition = '-moz-transform 0.4s ease';
                    item.style.OTransition = '-o-transform 0.4s ease';
                    item.style.transition = 'transform 0.4s ease';

                    // Snap to closest panel
                    if (diff > settings.itemWidth / 4 && offset !== 0) {
                        current[0] = origin[0] + settings.itemWidth;
                        reposition(evt);
                        offset = offset + settings.itemWidth;
                    } else if (diff < -(settings.itemWidth / 4) && offset != -((subItemCount - 1) * settings.itemWidth)) {
                        current[0] = origin[0] - settings.itemWidth;
                        reposition(evt);
                        offset = offset - settings.itemWidth;
                    } else {
                        current[0] = origin[0];
                        reposition(evt);
                    }

                    // Remove drag and end event listeners
                    element.removeEventListener(events.move, moveEvent, false);
                    element.removeEventListener(events.end, endEvent, false);
                };

                // Set up drag and end event listeners
                element.addEventListener(events.move, moveEvent, false);
                element.addEventListener(events.end, endEvent, false);

            }, false);
        })();
    }
};