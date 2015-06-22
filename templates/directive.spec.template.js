'use strict';

describe('Directive: <%= cameledName %>', function () {

	// load the directive's module
	beforeEach(module('<%= appName %>'));

	var element,
		scope;

	beforeEach(inject(function ($rootScope) {
		scope = $rootScope.$new();
	}));

	it('should do something', inject(function () {

	}));
});
