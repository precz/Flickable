module('flickable initialization');
test('test if flickable is properly initialized', function () {
	'use strict';
	var $fixture = $( "#qunit-fixture" );
	$fixture.append( 
		"<ul><li>First</li><li>Second</li><li>Third</li></ul>"
	);
	strictEqual(Flickable('#qunit-fixture', {}), undefined, 'function returns undefined');
});