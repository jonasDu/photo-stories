import {ImageServiceInterface, ImageInterface} from './services/image/image.service';
routerConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
export function routerConfig($stateProvider:angular.ui.IStateProvider, $urlRouterProvider:angular.ui.IUrlRouterProvider) {
    $stateProvider
        .state('home', {
            url: '/',
            views: {
                navigation: {
                    templateUrl: 'app/views/navigation/navigation.html',
                    controller: 'NavigationController',
                    controllerAs: 'NavigationController'
                },
                main: {
                    templateUrl: 'app/views/home/home.html',
                    controller: 'HomeController',
                    controllerAs: 'HomeController'
                }
            },
            resolve: {
                images: ['$q', 'ImageService', ($q:angular.IQService, ImageService:ImageServiceInterface) => {
                    var promise = $q.defer();
                    ImageService.getImages().then((images:ImageInterface[]) => {
                        promise.resolve(images);
                    });
                    return promise.promise;
                }],
                tags: ['$q', 'ImageService', ($q:angular.IQService, ImageService:ImageServiceInterface) => {
                    var promise = $q.defer();
                    ImageService.getTags().then((tags:string[]) => {
                        promise.resolve(tags);
                    });
                    return promise.promise;
                }]

            }
        });

    $urlRouterProvider.otherwise('/');
}
