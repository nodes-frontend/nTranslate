export interface INTranslateConfig {
    apiKey: string;
    appId: string;
    defaultLanguage: string;
    expires: number;
    rootUrl: string;
    platform: string;
}

export const NTranslateConfigDefaults: INTranslateConfig = {
    apiKey: '',
    appId: '',
    defaultLanguage: '',
    expires: 24 * 60 * 60 * 1000,
    rootUrl: 'https://nstack.like.st/api/v1/translate',
    platform: 'web'
};

export function NTranslateConfigFactory(config: INTranslateConfig): NTranslateConfig {
    return new NTranslateConfig(config);
}

export class NTranslateConfig {
    private _config: INTranslateConfig;

    constructor(_config: INTranslateConfig) {

        if(_config.apiKey.length < 1) {
            throw new Error(
                'NTranslateConfig missing apiKey'
            )
        }
        if(_config.appId.length < 1) {
            throw new Error(
                'NTranslateConfig missing appId'
            )
        }

        this._config = Object.assign({}, NTranslateConfigDefaults, _config);
    }

    public getConfig(): INTranslateConfig {
        return this._config;
    }
}
