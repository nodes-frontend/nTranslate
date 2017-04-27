import {Injectable, Inject} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';

import {LocalStorageService} from 'angular-2-local-storage';

import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';

import {NTranslateConfig, INTranslateConfig} from "./nTranslate.config";

@Injectable()
export class nTranslateService {

    private config: INTranslateConfig;
    private EXPIRES_KEY: string = 'EXPIRES';

    constructor(
        private options: NTranslateConfig,
        private localStorage: LocalStorageService,
        private http: Http
    ) {
        this.config = options.getConfig();
    }

    public getSection(sectionName: string, forceAsync?: boolean) {

    }

    public getAllSections(forceAsync?: boolean) {

    }

    public getLanguages(forceAsync?: boolean) {

    }

    public getBestFitLanguage(forceAsync?: boolean) {

    }

    private request() {

    }

    private setDefaultLanguageFromBrowser() {

    }

    private isExpired() {

    }
    private updateExpires() {

    }



    // getSection(section: string, forceRefresh?: boolean) {
    //
    //     let url = [
    //         this.ROOT_URL,
    //         this.appSettings.nStack.platform,
    //         'keys',
    //         section
    //     ].join('/');
    //
    //
    //     let options = this._constructRequestOpts();
    //     let data;
    //
    //     if(!forceRefresh && this.localStorageService.get(section)) {
    //         if(!this._isExpired()) {
    //
    //             data = this.localStorageService.get(section);
    //
    //             // return data;
    //             return new Observable(subscriber => {
    //                 subscriber.next(data);
    //                 subscriber.complete();
    //             });
    //         }
    //     }
    //
    //     return this.http.get(url, options)
    //         .map(res => {
    //             let body = res.json();
    //
    //             data = body.data;
    //
    //             // this.localStorageService.set(section, data);
    //             this._setExpiration();
    //
    //             return data;
    //         })
    //         .catch(this._handleError.bind(this));
    //
    // }
    //
    // getAllSections(forceRefresh?: boolean) {
    //
    //     let url = [
    //         this.ROOT_URL,
    //         this.appSettings.nStack.platform,
    //         'keys'
    //     ].join('/');
    //
    //     let options = this._constructRequestOpts();
    //     let data;
    //
    //     if(!forceRefresh && this.localStorageService.get(this.ALL_SECTIONS_KEY)) {
    //         if(!this._isExpired()) {
    //             data = this.localStorageService.get(this.ALL_SECTIONS_KEY);
    //             return new Observable(
    //                 subscriber => subscriber.next(data)
    //             );
    //         }
    //     }
    //
    //     return this.http.get(url, options)
    //         .map(res => {
    //             let body = res.json();
    //
    //             data = body.data;
    //
    //             this.localStorageService.set(this.ALL_SECTIONS_KEY, data);
    //             this._setExpiration();
    //
    //             return data;
    //         })
    //         .catch(this._handleError.bind(this));
    //
    // }
    //
    // private _setExpiration() {
    //     let now = new Date().getTime() + this.EXPIRES;
    //     this.localStorageService.set(this.EXPIRES_KEY, now);
    // }
    // private _isExpired() {
    //
    //     let now = new Date().getTime();
    //     let expires = this.localStorageService.get(this.EXPIRES_KEY);
    //
    //     if(!expires) {return true}
    //
    //     return now > expires;
    // }
    //
    // private _constructHeaders() {
    //     let appId = this.appSettings.nStack.appId;
    //     let apiKey = this.appSettings.nStack.apiKey;
    //
    //     let headers = new Headers({
    //         'X-Application-Id': appId,
    //         'X-Rest-Api-Key': apiKey
    //     });
    //
    //     return headers;
    // }
    //
    // private _constructRequestOpts() {
    //     let headers = this._constructHeaders();
    //     let opts = new RequestOptions({headers: headers});
    //     return opts;
    //
    // }
    //
    // /**
    //  * Helper method for handling error responses
    //  * @param error
    //  * @returns {ErrorObservable}
    //  * @private
    //  */
    // private _handleError(error) {
    //
    //     let body = error.json();
    //
    //     let response = body.message;
    //
    //     console.error(response);
    //
    //     return Observable.throw(response);
    //
    // }
}