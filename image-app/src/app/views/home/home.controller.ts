import {ImageInterface} from '../../services/image/image.service';
import ILightbox = angular.bootstrap.lightbox.ILightbox;
export interface HomeControllerInterface {

}

export class HomeController implements HomeControllerInterface {
    static $inject = ['$log', 'Lightbox', 'ENV', 'images', 'tags'];
    public selected_tag:string;
    constructor(private $log:angular.ILogService, private lightbox:ILightbox, private ENV:any, private images:ImageInterface[], private tags:string[]) {
        this.selected_tag = '';
    }

    openLightboxModal(images:ImageInterface[], index:number) {
        this.lightbox.openModal(images, index);
    };
}
