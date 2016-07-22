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

    protected fetchImages():angular.IPromise<ImageInterface[]> {
        var promise:angular.IDeferred<ImageInterface[]> = this.$q.defer();
        if (this.isLoading) {
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
                this.hasBeenLoaded = true;
                this.isLoading = false;
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
                this.tags = uniq(tags_with_duplicates);
                promise.resolve(response.data.data);
            }, (response:angular.IHttpPromiseCallbackArg<Error>) => {
                this.isLoading = false;
                this.hasBeenLoaded = false;
                promise.reject();
            });
        return promise.promise;
    }

    public getImages():angular.IPromise<ImageInterface[]> {
        var promise:angular.IDeferred<ImageInterface[]> = this.$q.defer();

        if (this.hasBeenLoaded) {
            promise.resolve(this.images);
            return promise.promise;
        } else {
            return this.fetchImages();
        }
    }

    getTags():angular.IPromise<string[]> {
        var promise:angular.IDeferred<string[]> = this.$q.defer();
        if (this.hasBeenLoaded) {
            promise.resolve(this.tags);
        } else {
            this.fetchImages().then(() => {
                promise.resolve(this.tags);
            });
        }
        return promise.promise;

    }

    public clear() {
        this.hasBeenLoaded = false;
        this.isLoading = false;
        this.images.length = 0;
        this.tags.length = 0;
    }
}
