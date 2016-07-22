import {ImageServiceInterface} from './image.service';
describe('ImageService', () => {
    var imageService;
    var httpBackend;
    var $rootScope;
    var ENV;
    var $q;

    beforeEach(angular.mock.module('app'));

    beforeEach(inject(function (_$rootScope_:angular.IRootScopeService, $httpBackend:angular.IHttpBackendService, _ENV_:any, ImageService:ImageServiceInterface, _$q_:angular.IQService) {
        imageService = ImageService;
        httpBackend = $httpBackend;
        ENV = _ENV_;
        $q = _$q_;
        $rootScope = _$rootScope_;
    }));

    afterEach(function () {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    it('should retrieve images from the server', function () {
        var url = ENV.API;
        var mocked_response = {
            'data': [
                {
                    'label': 'Test 1',
                    'url': 'image_1.jpeg',
                    'description': 'Lorem Ipsum',
                    'tags': ['a', 'b', 'c']
                },
                {
                    'label': 'Test 2',
                    'url': 'image_2.jpeg',
                    'description': 'Lorem Impsum',
                    'tags': ['a', 'd', 'e']
                }
            ]
        };
        httpBackend.expect('GET', url).respond(200, mocked_response);
        var responsePromise = imageService.getImages();
        responsePromise.then(function(res:any) {
            // expect two images
            expect(res.length).toEqual(2);
        }, function() {
            // always fail if this is reached
            expect(0).toBe(1);
        });
        httpBackend.flush();
    });

    it('should not load images twice', function () {
        var url = ENV.API;
        httpBackend.expect('GET', url).respond(200, []);
        imageService.getImages();
        imageService.getImages();
        httpBackend.flush();
    });

    it('should get all available tags', function () {
        var url = ENV.API;
        var mocked_response = {
            'data': [
                {
                    'label': 'Test 1',
                    'url': 'image_1.jpeg',
                    'description': 'Lorem Ipsum',
                    'tags': ['a', 'b', 'c']
                },
                {
                    'label': 'Test 2',
                    'url': 'image_2.jpeg',
                    'description': 'Lorem Impsum',
                    'tags': ['a', 'd', 'e']
                }
            ]
        };
        httpBackend.expect('GET', url).respond(200, mocked_response);
        imageService.getTags().then((res) => {
            // should only return unique values
            expect(res).toEqual(['a','b','c','d','e']);
        });
        httpBackend.flush();
    });

});
