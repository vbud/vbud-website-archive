'use strict';

describe('Controller: <%= cameledName %>', function(){
  var scope;

  beforeEach(module('<%= appName %>'));

  beforeEach(inject(function($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should do something', inject(function($controller) {

    $controller('<%= cameledName %>', {
      $scope: scope
    });

  }));
});
