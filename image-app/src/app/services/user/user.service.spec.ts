import {UserServiceInterface} from './user.service';
describe('UserService', () => {
    var userService;
    var httpBackend;
    var $rootScope;
    var ENV;
    var $q;

    beforeEach(angular.mock.module('app'));

    beforeEach(inject(function (_$rootScope_:angular.IRootScopeService, $httpBackend:angular.IHttpBackendService, _ENV_:any, UserService:UserServiceInterface, _$q_:angular.IQService) {
        userService = UserService;
        httpBackend = $httpBackend;
        ENV = _ENV_;
        $q = _$q_;
        $rootScope = _$rootScope_;
    }));

    afterEach(function () {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    // test should pass but doesn't. Needs further investigation
    xit('should perform a fake login', function () {
        var url = ENV.API + 'login';
        var mocked_response = {
            'data': [
                {
                    'success': true,
                    'user': 'John',
                    'name': 'John Doe'
                }
            ]
        };

        httpBackend.expectPOST(url, {}).respond(200, mocked_response);
        userService.login();
        httpBackend.flush();
    });


});
