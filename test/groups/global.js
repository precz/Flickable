(function () {
	'use strict';

	var fixtureText = '<div class="flickable"><ul>' +
        '<li id="first">First</li>' +
		'<li id="second">Second</li>' +
		'<li id="third">Third</li>' +
		'</ul><div>',
		firstDisplayTest = function () {
			strictEqual(
				$('.flickableIndicatorDots span:nth-child(1)').hasClass('flickableIndicatorActive'),
				true,
				'first flickable inidicator is selected'
			);
			strictEqual(
				$('.flickableIndicatorDots span:nth-child(2)').hasClass('flickableIndicatorActive'),
				false,
				'second flickable inidicator has no class'
			);
			strictEqual(
				$('.flickableIndicatorDots span:nth-child(3)').hasClass('flickableIndicatorActive'),
				false,
				'third flickable inidicator has no class'
			);
			strictEqual($('#first').css('display'), 'block', 'first element is displayed');
			strictEqual($('#second').css('display'), 'none', 'second element is not displayed');
			strictEqual($('#third').css('display'), 'none', 'third element is not displayed');
		},
		secondDisplayTest = function () {
			strictEqual(
				$('.flickableIndicatorDots span:nth-child(1)').hasClass('flickableIndicatorActive'),
				false,
				'first flickable inidicator has no class'
			);
			strictEqual(
				$('.flickableIndicatorDots span:nth-child(2)').hasClass('flickableIndicatorActive'),
				true,
				'second fflickable inidicator is selected'
			);
			strictEqual(
				$('.flickableIndicatorDots span:nth-child(3)').hasClass('flickableIndicatorActive'),
				false,
				'third flickable inidicator has no class'
			);
			strictEqual($('#first').css('display'), 'none', 'first element is not displayed');
			strictEqual($('#second').css('display'), 'block', 'second element is displayed');
			strictEqual($('#third').css('display'), 'none', 'third element is displayed');
		},
		thirdDisplayTest = function () {
			strictEqual(
				$('.flickableIndicatorDots span:nth-child(1)').hasClass('flickableIndicatorActive'),
				false,
				'first flickable inidicator has no class'
			);
			strictEqual(
				$('.flickableIndicatorDots span:nth-child(2)').hasClass('flickableIndicatorActive'),
				false,
				'second fflickable inidicator is selected'
			);
			strictEqual(
				$('.flickableIndicatorDots span:nth-child(3)').hasClass('flickableIndicatorActive'),
				true,
				'third flickable inidicator has no class'
			);
			strictEqual($('#first').css('display'), 'none', 'first element is displayed');
			strictEqual($('#second').css('display'), 'none', 'second element is not displayed');
			strictEqual($('#third').css('display'), 'block', 'third element is displayed');
		};

	module('global variable');
	test('test if object exist', function () {
		ok(window.Flickable !== undefined, 'exists');
		strictEqual(typeof (window.Flickable), 'function', 'is function');
	});

	module('no option set', {
		setup: function () {
			$('#qunit-fixture').append(fixtureText);
			window.Flickable('.flickable', {});
		},
		teardown: function () {
			$('#qunit-fixture').empty();
		}
	});

	test('test if flickable is properly initialized', function () {
		strictEqual($('.slideshowNavigation').length, 1, 'there is slideshow navigation');
		strictEqual($('.slideshowNavigation a.prevSlideButton').length, 1, 'there is prev button');
		strictEqual($('.slideshowNavigation a.nextSlideButton').length, 1, 'there is next button');
		strictEqual($('.flickableIndicatorDots').length, 1, 'there are slideshow inidicator dots');
		firstDisplayTest();
	});

	test('test prev button works', function () {
		$('.slideshowNavigation a.prevSlideButton')[0].click();
		thirdDisplayTest();
		$('.slideshowNavigation a.prevSlideButton')[0].click();
		secondDisplayTest();
		$('.slideshowNavigation a.prevSlideButton')[0].click();
		firstDisplayTest();
	});

	test('test next button works', function () {
		$('.slideshowNavigation a.nextSlideButton')[0].click();
		secondDisplayTest();
		$('.slideshowNavigation a.nextSlideButton')[0].click();
		thirdDisplayTest();
		$('.slideshowNavigation a.nextSlideButton')[0].click();
		firstDisplayTest();
	});

	module('"offset" option set', {
		setup: function () {
			$('#qunit-fixture').append(fixtureText);
			window.Flickable('.flickable', {offset: 1});
		}
	});

	test('test if flickable is properly initialized', function () {
		strictEqual($('.slideshowNavigation').length, 1, 'there is slideshow navigation');
		strictEqual($('.slideshowNavigation a.prevSlideButton').length, 1, 'there is prev button');
		strictEqual($('.slideshowNavigation a.nextSlideButton').length, 1, 'there is next button');
		strictEqual($('.flickableIndicatorDots').length, 1, 'there is flickable inidicator');
		secondDisplayTest();
	});

	test('test prev button works', function () {
		$('.slideshowNavigation a.prevSlideButton')[0].click();
		firstDisplayTest();
		$('.slideshowNavigation a.prevSlideButton')[0].click();
		thirdDisplayTest();
		$('.slideshowNavigation a.prevSlideButton')[0].click();
		secondDisplayTest();
	});

	test('test next button works', function () {
		$('.slideshowNavigation a.nextSlideButton')[0].click();
		thirdDisplayTest();
		$('.slideshowNavigation a.nextSlideButton')[0].click();
		firstDisplayTest();
		$('.slideshowNavigation a.nextSlideButton')[0].click();
		secondDisplayTest();
	});

	module('"enableMouseEvents" option set', {
		setup: function () {
			$('#qunit-fixture').append(fixtureText);
			window.Flickable('.flickable', {enableMouseEvents: true});
		}
	});

	test('test if flickable is properly initialized', function () {
		strictEqual($('.flickableIndicatorDots').length, 1, 'there is flickable inidicator');
		strictEqual($('div.flickable ul').css('-webkit-transform'),
			'matrix(1, 0, 0, 1, 0, 0)', 'webkit transform is set');
		strictEqual(parseInt($('div.flickable ul').css('width'), 10),
			$(window).width() * 3, 'flicable element has width of three window width');
		strictEqual(parseInt($('div.flickable ul li:nth-child(1)').css('width'), 10),
			$(window).width(), 'first element has width of window');
		strictEqual(parseInt($('div.flickable ul li:nth-child(2)').css('width'), 10),
			$(window).width(), 'second element has width of window');
		strictEqual(parseInt($('div.flickable ul li:nth-child(3)').css('width'), 10),
			$(window).width(), 'third element has width of window');
	});

	//TODO: unable to test transformations and touch events.

	module('"enableMouseEvents", "showButtons" option set', {
		setup: function () {
			$('#qunit-fixture').append(fixtureText);
			window.Flickable('.flickable', {enableMouseEvents: true, showButtons: true});
		}
	});

	test('test if flickable is properly initialized', function () {
		strictEqual($('.flickableIndicatorDots').length, 1, 'there is flickable inidicator');
		strictEqual($('div.flickable ul').css('-webkit-transform'),
			'matrix(1, 0, 0, 1, 0, 0)', 'webkit transform is set');
		strictEqual(parseInt($('div.flickable ul').css('width'), 10),
			$(window).width() * 3, 'flicable element has width of three window width');
		strictEqual(parseInt($('div.flickable ul li:nth-child(1)').css('width'), 10),
			$(window).width(), 'first element has width of window');
		strictEqual(parseInt($('div.flickable ul li:nth-child(2)').css('width'), 10),
			$(window).width(), 'second element has width of window');
		strictEqual(parseInt($('div.flickable ul li:nth-child(3)').css('width'), 10),
			$(window).width(), 'third element has width of window');
	});

	test('test prev button works', function () {
		$('.slideshowNavigation a.prevSlideButton')[0].click();
		strictEqual(
			$('.flickableIndicatorDots span:nth-child(1)').hasClass('flickableIndicatorActive'),
			false,
			'first flickable inidicator has no class'
		);
		strictEqual(
			$('.flickableIndicatorDots span:nth-child(2)').hasClass('flickableIndicatorActive'),
			false,
			'second fflickable inidicator is selected'
		);
		strictEqual(
			$('.flickableIndicatorDots span:nth-child(3)').hasClass('flickableIndicatorActive'),
			true,
			'third flickable inidicator has no class'
		);

		$('.slideshowNavigation a.prevSlideButton')[0].click();
		strictEqual(
			$('.flickableIndicatorDots span:nth-child(1)').hasClass('flickableIndicatorActive'),
			false,
			'first flickable inidicator has no class'
		);
		strictEqual(
			$('.flickableIndicatorDots span:nth-child(2)').hasClass('flickableIndicatorActive'),
			true,
			'second fflickable inidicator is selected'
		);
		strictEqual(
			$('.flickableIndicatorDots span:nth-child(3)').hasClass('flickableIndicatorActive'),
			false,
			'third flickable inidicator has no class'
		);

		$('.slideshowNavigation a.prevSlideButton')[0].click();
		strictEqual(
			$('.flickableIndicatorDots span:nth-child(1)').hasClass('flickableIndicatorActive'),
			true,
			'first flickable inidicator is selected'
		);
		strictEqual(
			$('.flickableIndicatorDots span:nth-child(2)').hasClass('flickableIndicatorActive'),
			false,
			'second flickable inidicator has no class'
		);
		strictEqual(
			$('.flickableIndicatorDots span:nth-child(3)').hasClass('flickableIndicatorActive'),
			false,
			'third flickable inidicator has no class'
		);
	});

	test('test next button works', function () {
		$('.slideshowNavigation a.nextSlideButton')[0].click();
		strictEqual(
			$('.flickableIndicatorDots span:nth-child(1)').hasClass('flickableIndicatorActive'),
			false,
			'first flickable inidicator has no class'
		);
		strictEqual(
			$('.flickableIndicatorDots span:nth-child(2)').hasClass('flickableIndicatorActive'),
			true,
			'second fflickable inidicator is selected'
		);
		strictEqual(
			$('.flickableIndicatorDots span:nth-child(3)').hasClass('flickableIndicatorActive'),
			false,
			'third flickable inidicator has no class'
		);

		$('.slideshowNavigation a.nextSlideButton')[0].click();
		strictEqual(
			$('.flickableIndicatorDots span:nth-child(1)').hasClass('flickableIndicatorActive'),
			false,
			'first flickable inidicator has no class'
		);
		strictEqual(
			$('.flickableIndicatorDots span:nth-child(2)').hasClass('flickableIndicatorActive'),
			false,
			'second fflickable inidicator is selected'
		);
		strictEqual(
			$('.flickableIndicatorDots span:nth-child(3)').hasClass('flickableIndicatorActive'),
			true,
			'third flickable inidicator has no class'
		);

		$('.slideshowNavigation a.nextSlideButton')[0].click();
		strictEqual(
			$('.flickableIndicatorDots span:nth-child(1)').hasClass('flickableIndicatorActive'),
			true,
			'first flickable inidicator is selected'
		);
		strictEqual(
			$('.flickableIndicatorDots span:nth-child(2)').hasClass('flickableIndicatorActive'),
			false,
			'second flickable inidicator has no class'
		);
		strictEqual(
			$('.flickableIndicatorDots span:nth-child(3)').hasClass('flickableIndicatorActive'),
			false,
			'third flickable inidicator has no class'
		);
	});
	
	//TODO: unable to test transformations and touch events.
}());