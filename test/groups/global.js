module('global variable');
test('test if object exist', function () {
	'use strict';
	//var $fixture = $( "#qunit-fixture" );
	ok(window.Flickable !== undefined, 'exists');
	strictEqual(typeof (window.Flickable), 'function', 'is function');
	//strictEqual(Flickable('#qunit-fixture', {}), undefined, 'function returns undefined');
});