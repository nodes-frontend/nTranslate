import {NgModule, Optional, SkipSelf, ModuleWithProviders} from '@angular/core';
import {HttpModule} from '@angular/http';

import {LocalStorageModule} from 'angular-2-local-storage';

import {NTranslateConfig, NTranslateConfigFactory} from './nTranslate.config';
import {nTranslateService} from './nTranslate.service';

@NgModule({
    imports: [
        HttpModule,
        LocalStorageModule.withConfig({
            prefix: 'NTranslate',
            storageType: 'localStorage'
        })
    ],
    providers: [nTranslateService]
})
export class NTranslateModule {

    public static forRoot(
        providedConfig: any = {
            provide: NTranslateConfig,
            useFactory: NTranslateConfigFactory
        }
    ): ModuleWithProviders {
        return {
            ngModule: NTranslateModule,
            providers: [providedConfig]
        };
    }

    constructor(@Optional() @SkipSelf() parentModule: NTranslateModule) {
        if (parentModule) {
            throw new Error(
                'NTranslateModule is already loaded. Import it in the AppModule only');
        }
    }
}