/// <reference path='../../typings/main.d.ts' />

import {HomeController} from './views/home/home.controller';
import {routerConfig} from './index.route';
import {NavigationController} from './views/navigation/navigation.controller';
import {ImageService} from './services/image/image.service';
import {UserService} from './services/user/user.service';
declare var moment:moment.MomentStatic;

module app {
    'use strict';
    angular.module('app', [
            'ngAnimate',
            'ngCookies',
            'ngTouch',
            'ngSanitize',
            'ngMessages',
            'ngAria',
            'ui.router',
            'angular-cache',
            'ui.bootstrap',
            'ngOrderObjectBy', // ng-repeat ordering for objects by property,
            'bootstrapLightbox' // lightbox plugin
        ])
        .constant('ENV', {
            ENVIRONMENT: 'development',
            API: 'http://localhost:4730/api/',
            STATIC: 'http://localhost:4730/static/'
        })
        .config(routerConfig)
        .controller('NavigationController', NavigationController)
        .controller('HomeController', HomeController)
        .service('ImageService', ImageService)
        .service('UserService', UserService);
}
