/*
 * This library is a fork of [BoostCommunications / Flickable]
 * (https://github.com/BoostCommunications/Flickable) by Arne Martin Aurlien
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2013 Paweł Preczyński
 *
 * Permission is hereby granted, free of charge, to any person obtaining 
 * a copy of this software and associated documentation files 
 * (the "Software"), to deal in the Software without restriction, 
 * including without limitation the rights to use, copy, modify, merge, 
 * publish, distribute, sublicense, and/or sell copies of the Software, 
 * and to permit persons to whom the Software is furnished to do so, 
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be 
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF 
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY 
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, 
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var Flickable = function (elementSelector, options) {
    'use strict';

    var i,
        j,
        events,
        orientationTimeout,
        elements = [],
        elementRegex = new RegExp('^([#.])([^#.,> ]+)'),
        elementMatches = elementRegex.exec(elementSelector),
        settings = {
            width: 'screen',
            offset: 0,
            enableMouseEvents: false,
            showIndicators: true,
            showNumbers: false,
            showButtons: false,
            dotsIndicatorClass: 'flickableIndicatorDots',
            numberIndicatorClass: 'flickableIndicatorNumbers',
            activeIndicatorClass: 'flickableIndicatorActive',
            slideshowNavigationClass: 'slideshowNavigation',
            nextButtonClass: 'nextSlideButton',
            prevButtonClass: 'prevSlideButton',
            nextButtonText: 'Next',
            prevButtonText: 'Previous',
            orientationEvent: 'orientationchange',
            timeInterval: 0,
            widthCallback: function () {
                return window.innerWidth;
            }
        },
        orientationEvent,
        // Generate next/previous slide buttons
        createButtons = function (prevCallback, nextCallback) {
            var slideshowNavigation = document.createElement('div'),
                nextButton = document.createElement('a'),
                prevButton = document.createElement('a');

            slideshowNavigation.className = settings.slideshowNavigationClass;
            nextButton.className = settings.nextButtonClass;
            prevButton.className = settings.prevButtonClass;
            nextButton.href = '#';
            prevButton.href = '#';

            if (settings.nextButtonText) {
                nextButton.innerHTML = settings.nextButtonText;
            }

            if (settings.prevButtonText) {
                prevButton.innerHTML = settings.prevButtonText;
            }

            // Set up events for next/previous buttons
            prevButton.addEventListener('click', function (evt) {
                evt.preventDefault();
                prevCallback();
            });

            nextButton.addEventListener('click', function (evt) {
                evt.preventDefault();
                nextCallback();
            });

            slideshowNavigation.appendChild(prevButton);
            slideshowNavigation.appendChild(nextButton);

            return slideshowNavigation;
        },
        setUpFlickables = function (i) {
            var element = elements[i],
                item = element.children[0],
                subItems = item.children,
                subItemCount = subItems.length,
                currentSlide = settings.offset,
                previousSlide = currentSlide,
                offset,
                k,
                indicator,
                updateIndicators = function () {
                    if (settings.showIndicators) {
                        var indicators = indicator.childNodes, k, l, k1;
                        for (k = 0, l = indicators.length; k < l; k += 1) {
                            if (k !== currentSlide) {
                                indicators[k].removeAttribute('class');
                                indicators[k].innerHTML = "";
                            } else {
                                indicators[k].setAttribute('class', settings.activeIndicatorClass);
                                if (settings.showNumbers) {
                                    k1 = k + 1;
                                    indicators[k].innerHTML = '<div class="caption">' + subItems[k].getAttribute('data-caption') + '</div><div class="number">' + ' ' + k1 + ' / ' + indicators.length + '</div>';
                                }
                            }
                        }
                    }
                },
                callCallback = function () {
                    if (settings.callback) {
                        setTimeout(function () {
                            if (currentSlide !== previousSlide) {
                                settings.callback(currentSlide);
                                previousSlide = currentSlide;
                            }
                        }, 200);
                    }
                },
                enableAnimation = function () {
                    item.style.WebkitTransition = '-webkit-transform 0.4s ease';
                    item.style.MozTransition = '-moz-transform 0.4s ease';
                    item.style.OTransition = '-o-transform 0.4s ease';
                    item.style.transition = 'transform 0.4s ease';
                },
                disableAnimation = function () {
                    item.style.WebkitTransition = '';
                    item.style.MozTransition = '';
                    item.style.OTransition = '';
                    item.style.transition = '';
                },
                snapToCurrentSlide = function (showAnimation) {
                    if (showAnimation) {
                        enableAnimation();
                    } else {
                        disableAnimation();
                    }
                    offset = -(currentSlide * settings.width);

                    item.style.WebkitTransform = 'translate3d(' + offset + 'px, 0, 0)';
                    item.style.MozTransform = 'translateX(' + offset + 'px)';
                    item.style.OTransform = 'translateX(' + offset + 'px)';
                    item.style.transform = 'translate3d(' + offset + 'px, 0, 0)';
                    callCallback();
                    updateIndicators();
                },
                resetWidths = function () {
                    snapToCurrentSlide(false);
                    item.style.width = (settings.width * subItemCount) + 'px';

                    for (k = 0; k < subItemCount; k += 1) {
                        subItems[k].style.width = settings.width + 'px';
                    }
                },
                getXY = function (evt) {
                    if (evt.targetTouches && evt.targetTouches.length) {
                        var i,
                            j = evt.targetTouches.length,
                            sumX = 0,
                            sumY = 0;
                        for (i = 0; i < j; i += 1) {
                            sumX += evt.targetTouches[i].clientX;
                            sumY += evt.targetTouches[i].clientY;
                        }
                        return [sumX / j, sumY / j];
                    }
                    return [evt.clientX, evt.clientY];
                },
                hideInactiveSlides = function () {
                    for (k = 0; k < subItemCount; k += 1) {
                        if (k !== currentSlide) {
                            subItems[k].style.display = 'none';
                        } else {
                            subItems[k].style.display = '';
                        }
                    }
                };

            if (settings.showIndicators) {
                indicator = document.createElement('div');

                if (settings.showNumbers) {
                    indicator.setAttribute('class', settings.numberIndicatorClass);
                } else {
                    indicator.setAttribute('class', settings.dotsIndicatorClass);
                }

                for (k = 0; k < subItemCount; k += 1) {
                    indicator.appendChild(document.createElement('span'));
                }

                indicator.childNodes[currentSlide].setAttribute('class', settings.activeIndicatorClass);
                element.parentNode.insertBefore(indicator, element.nextSibling);
            }

            // Use touch events and transforms on fancy phones
            if (events) {
                
                resetWidths();

                window.addEventListener(orientationEvent, function () {
                    setTimeout(function () {
                        resetWidths();
                    }, 400);
                });

                // Show buttons if wanted
                if (settings.showButtons) {
                    element.appendChild(createButtons(function () {
                        currentSlide = currentSlide - 1;
                        if (!subItems[currentSlide]) {
                            currentSlide = subItemCount - 1;
                        }
                        snapToCurrentSlide(true);
                    }, function () {
                        currentSlide = currentSlide + 1;
                        if (!subItems[currentSlide]) {
                            currentSlide = 0;
                        }
                        snapToCurrentSlide(true);
                    }));
                }

                // auto-rotation if wanted
                if (options.timeInterval > 0) {
                    setInterval(function () {
                        currentSlide = currentSlide + 1;
                        if (!subItems[currentSlide]) {
                            currentSlide = 0;
                        }
                        snapToCurrentSlide(true);
                    }, options.timeInterval * 1000
                        );
                }

                // Set up touch listener
                element.addEventListener(events.start, function (evt) {

                    // Get origin position
                    var origin = getXY(evt),
                        current = origin,
                        prevTime = (new Date()).getTime(),
                        speed = 0,
                        reposition = function (evt) {
                            var distanceX = Math.abs(current[0] - origin[0]),
                                distanceY = Math.abs(current[1] - origin[1]),
                                newTime = (new Date()).getTime(),
                                delta;

                            speed = (current[0] - origin[0]) / (newTime - prevTime);
                            prevTime = newTime;

                            // Only scroll gallery if X distance is greater than Y distance
                            if (distanceX > distanceY) {
                                evt.stopPropagation();
                                evt.preventDefault();
                            } else {
                                current[0] = origin[0];
                            }

                            // Get delta X distance
                            delta = current[0] - origin[0];

                            // Make scrolling "sticky" if we are scrolling past the first or last panel
                            if (offset + delta > 0 || offset + delta < -((subItemCount - 1) * settings.width)) {
                                delta = Math.floor(delta / 2);
                            }

                            // Update position
                            item.style.WebkitTransform = 'translate3d(' + (offset + delta) + 'px, 0, 0)';
                            item.style.MozTransform = 'translateX(' + (offset + delta) + 'px)';
                            item.style.OTransform = 'translateX(' + (offset + delta) + 'px)';
                            item.style.transform = 'translate3d(' + (offset + delta) + 'px, 0, 0)';
                        },
                        moveEvent = function (evt) {
                            current = getXY(evt);
                            reposition(evt);
                        },
                        endEvent = function () {
                            var diff = current[0] - origin[0] + ((speed / settings.width) * 12000);

                            // Snap to closest panel
                            if (diff > settings.width / 2 && offset !== 0) {
                                current[0] = origin[0] + settings.width;
                                offset = offset + settings.width;
                            } else if (diff < -(settings.width / 2) && offset !== -((subItemCount - 1) * settings.width)) {
                                current[0] = origin[0] - settings.width;
                                offset = offset - settings.width;
                            } else {
                                current[0] = origin[0];
                            }

                            currentSlide = Math.floor(Math.abs(offset / settings.width));
                            snapToCurrentSlide(true);

                            // Remove drag and end event listeners
                            element.removeEventListener(events.move, moveEvent, false);
                            element.removeEventListener(events.end, endEvent, false);
                        };

                    disableAnimation();
                    
                    // Set up drag and end event listeners
                    element.addEventListener(events.move, moveEvent, false);
                    element.addEventListener(events.end, endEvent, false);

                }, false);
            // Use buttons and stuff on boring phones
            } else {
                // Hide all slides but the active one
                hideInactiveSlides();

                element.appendChild(createButtons(function () {
                    currentSlide = currentSlide - 1;
                    if (!subItems[currentSlide]) {
                        currentSlide = subItemCount - 1;
                    }
                    hideInactiveSlides();
                    callCallback();
                    updateIndicators();
                }, function () {
                    currentSlide = currentSlide + 1;
                    if (!subItems[currentSlide]) {
                        currentSlide = 0;
                    }
                    hideInactiveSlides();
                    callCallback();
                    updateIndicators();
                }));
            }
        };

    if (elementMatches[1] === '.') {
        elements = document.getElementsByClassName(elementMatches[2]);
    } else if (elementMatches[1] === '#') {
        elements = [document.getElementById(elementMatches[2])];
    }

    // Extend settings with options from parameter
    if (options) {
        for (i in options) {
            if (options.hasOwnProperty(i)) {
                settings[i] = options[i];
            }
        }
    }

    // 'onorientationchange' could be disabled by passing 'resize' option.
    // Default option is 'orientationchange' if supported by browser.
    if (settings.orientationEvent === 'orientationchange'
            &&  window.onorientationchange !== undefined) {
        orientationEvent = 'orientationchange';
    } else {
        orientationEvent = 'resize';
    }

    if (settings.itemWidth) {
        settings.width = settings.itemWidth;
    }


    if (settings.width === 'screen') {
        settings.widthScreen = true;
        settings.width = settings.widthCallback();
        window.addEventListener(orientationEvent, function () {
            clearTimeout(orientationTimeout);
            orientationTimeout = setTimeout(function () {
                settings.width = settings.widthCallback();
            }, 200);
        });
    }

    // Detect if current device supports touch events, otherwise use mouse events
    if (document.createElement('div').ontouchstart !== undefined) {
        events = {
            start: 'touchstart',
            move: 'touchmove',
            end: 'touchend'
        };
    } else if (settings.enableMouseEvents) {
        events = {
            start: 'mousedown',
            move: 'mousemove',
            end: 'mouseup'
        };
    }

    // Set up flickables for all matched elements
    for (i = 0, j = elements.length; i < j; i += 1) {
        setUpFlickables(i);
    }
};
