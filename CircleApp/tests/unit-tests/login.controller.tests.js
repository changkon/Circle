describe('Controllers', function(){
    var scope;

    // load the controller's module
    beforeEach(module('starter.controllers'));

    beforeEach(inject(function($rootScope, $controller, $httpBackend) {
        scope = $rootScope.$new();
        httpMock = $httpBackend
        $rootScope.client = jasmine.createSpyObj('$state spy', ['go']);
        httpMock.expectPOST("https://circleapp.azurewebsites.net/api/auth").respond(201, {token: "111"});
        $controller('DashCtrl', { $scope: scope }); 
    }));

    it('should have login tab showing', function(){
        expect(scope.showLogin).toEqual(true);
    });

    it('should have register tab not showing', function(){
        expect(scope.showRegister).toEqual(false);
    });

    it('should be cool', function(){
        scope.data.username = "Tom"
        scope.data.password = "lol"
        scope.login()
        httpMock.flush();

        expect(scope.showRegister).toEqual(false);
    });
});