test('Global varaible', function () {
	'use strict';
	ok(window.Flickable !== undefined, 'is global');
	ok(typeof (window.Flickable) === 'function', 'is function');
	ok(Flickable('#qunit-fixture', {}) === undefined, 'returns undefined');
});