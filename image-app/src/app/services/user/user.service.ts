export interface UserApiResponse {
    data: UserInterface[];
}
export interface UserInterface {
    success:boolean;
    user:string;
    name:string;
}
export interface UserServiceInterface {
    isLoggedIn: boolean;
    login():void;
    logout():void;
    getLoginStatus():boolean;
    clear():void;
}

/**
 * this service fetches images from the remote api and locally stores images and tags
 */
export class UserService implements UserServiceInterface {
    static $inject:string[] = ['$log', '$http', '$q', 'ENV'];
    private user:UserInterface[];
    public isLoggedIn:boolean;
    protected hasBeenLoaded:boolean;
    protected isLoading:boolean;
    protected currentHttpPromise:angular.IPromise<UserInterface[]>;

    constructor(private $log:angular.ILogService,
                private $http:angular.IHttpService,
                private $q:angular.IQService,
                private ENV:any) {
        this.hasBeenLoaded = false;
        this.isLoading = false;
        this.user = <UserInterface[]>[];
    }

    /**
     * performs a fake login
     * @returns {angular.IPromise<ImageInterface[]>}
     */
    public login():angular.IPromise<UserInterface[]> {
        var promise:angular.IDeferred<UserInterface[]> = this.$q.defer();
        if (this.isLoading) {
            // if http request is still pending, return the current promise
            return this.currentHttpPromise;
        } else {
            this.isLoading = true;
            this.currentHttpPromise = promise.promise;
        }
        var httpConfigObj:angular.IRequestConfig = {
            url: this.ENV.API + 'login',
            method: 'POST'
        };
        this.$http(httpConfigObj)
            .then((response:angular.IHttpPromiseCallbackArg<UserApiResponse>) => {
                // if data has already been loaded there is no need to load it again
                this.hasBeenLoaded = true;
                // toggle loading state
                this.isLoading = false;
                // user is logged in
                this.isLoggedIn = true;
                // save user
                this.user = response.data.data;
                promise.resolve(response.data.data);
            }, (response:angular.IHttpPromiseCallbackArg<Error>) => {
                // just in case
                this.isLoading = false;
                this.hasBeenLoaded = false;
                promise.reject();
            });
        return promise.promise;
    }

    public getLoginStatus() {
        return this.isLoggedIn;
    }

    /**
     * logout
     */
    public logout() {
        this.clear();
    }

    /**
     * reset service if necessary
     */
    public clear() {
        this.hasBeenLoaded = false; // toggle
        this.isLoading = false; // toggle
        this.isLoggedIn = false; // toggle
        this.user.length = 0; // reset array without loosing reference
    }
}
