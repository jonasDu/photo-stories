import {ImageInterface} from '../../services/image/image.service';
import ILightbox = angular.bootstrap.lightbox.ILightbox;
import {UserServiceInterface} from '../../services/user/user.service';
export interface HomeControllerInterface {
    openLightboxModal(images:ImageInterface[], index:number):void;
    getLoginStatus():boolean;
    login():void;
    logout():void;
}

export class HomeController implements HomeControllerInterface {
    static $inject = ['$log', 'Lightbox', 'UserService', 'ENV', 'images', 'tags'];
    public selected_tag:string;
    constructor(private $log:angular.ILogService, private lightbox:ILightbox, private userService:UserServiceInterface,private ENV:any, private images:ImageInterface[], private tags:string[]) {
        this.selected_tag = '';
    }

    /**
     * opens the ligthbox in a bootstrap modal
     * @param images
     * @param index
     */
    openLightboxModal(images:ImageInterface[], index:number) {
        this.lightbox.openModal(images, index);
    };

    /**
     * returns the current login status
     * @returns {Object}
     */
    getLoginStatus() {
        return this.userService.isLoggedIn;
    }

    /**
     * perform a fake login
     */
    login() {
        this.userService.login();
    }

    /**
     * perform a fake logout
     */
    logout() {
        this.userService.logout();
    }
}
