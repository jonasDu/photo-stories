import forEach = require('lodash/forEach');
import uniq = require('lodash/uniq');
export interface ImageApiResponce {
    data: ImageInterface[];
}
export interface ImageInterface {
    url:string;
    tags: string[];
    width:number;
    height:number;
}
export interface ImageServiceInterface {
    getImages():angular.IPromise<ImageInterface[]>;
    getTags():angular.IPromise<string[]>;
    clear():void;
}

/**
 * this service fetches images from the remote api and locally stores images and tags
 */
export class ImageService implements ImageServiceInterface {
    static $inject:string[] = ['$log', '$http', '$q', 'ENV'];
    protected images:ImageInterface[];
    protected tags:string[];
    protected hasBeenLoaded:boolean;
    protected isLoading:boolean;
    protected currentHttpPromise:angular.IPromise<ImageInterface[]>;

    constructor(private $log:angular.ILogService,
                private $http:angular.IHttpService,
                private $q:angular.IQService,
                private ENV:any) {
        this.hasBeenLoaded = false;
        this.isLoading = false;
        this.images = <ImageInterface[]>[];
        this.tags = [];
    }

    /**
     * fetches images from the remote server and stores the result in this.images and this.tags
     * @returns {angular.IPromise<ImageInterface[]>}
     */
    protected fetchImages():angular.IPromise<ImageInterface[]> {
        var promise:angular.IDeferred<ImageInterface[]> = this.$q.defer();
        if (this.isLoading) {
            // if http request is still pending, return the current promise
            return this.currentHttpPromise;
        } else {
            this.isLoading = true;
            this.currentHttpPromise = promise.promise;
        }
        var httpConfigObj:angular.IRequestConfig = {
            url: this.ENV.API,
            method: 'GET'
        };
        this.$http(httpConfigObj)
            .then((response:angular.IHttpPromiseCallbackArg<ImageApiResponce>) => {
                // if data has already been loaded there is no need to load it again
                this.hasBeenLoaded = true;
                // toggle loading state
                this.isLoading = false;
                // store imaage
                this.images = response.data.data;
                var tags_with_duplicates = [];
                forEach(this.images, (image) => {
                    // replace relative with absolute image url
                    image.url = this.ENV.STATIC + image.url;
                    // extract tags from images
                    forEach(image.tags, (tag) => {
                        tags_with_duplicates.push(tag);
                    });
                });
                // remove duplicate tags
                this.tags = uniq(tags_with_duplicates);
                promise.resolve(response.data.data);
            }, (response:angular.IHttpPromiseCallbackArg<Error>) => {
                // just in case
                this.isLoading = false;
                this.hasBeenLoaded = false;
                promise.reject();
            });
        return promise.promise;
    }

    /**
     * return all images
     * @returns {any}
     */
    public getImages():angular.IPromise<ImageInterface[]> {
        var promise:angular.IDeferred<ImageInterface[]> = this.$q.defer();
        // if images has already been loaded return the previous result
        if (this.hasBeenLoaded) {
            promise.resolve(this.images);
            return promise.promise;
        } else {
            // if not, fetch images from remote server
            return this.fetchImages();
        }
    }

    /**
     * return all available image tags
     * @returns {IPromise<string[]>}
     */
    getTags():angular.IPromise<string[]> {
        var promise:angular.IDeferred<string[]> = this.$q.defer();
        // if images has already been loaded return the previous result
        if (this.hasBeenLoaded) {
            promise.resolve(this.tags);
        } else {
            // if not, fetch images from remote server and return tags
            this.fetchImages().then(() => {
                promise.resolve(this.tags);
            });
        }
        return promise.promise;

    }

    /**
     * reset service if necessary
     */
    public clear() {
        this.hasBeenLoaded = false; // toggle
        this.isLoading = false; // toggle
        this.images.length = 0; // reset array without loosing reference
        this.tags.length = 0; // reset array without loosing reference
    }
}
