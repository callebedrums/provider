
let $providers: IProviders[] = [];
let $instances: any = {};

export interface IProviders {
    provide: any,
    useValue?: any,
    useClass?: any,
    useFunction?: () => any
}

export class NoProviderError extends Error { }

export const cleanInjector = () => {
    $providers = [];
    $instances = {};
};

export const getInstance = (provide: any): any => {
    if ($instances[provide]) return $instances[provide];

    const provider = $providers.find(p => p.provide === provide);

    if (provider && provider.useValue) return $instances[provide] = provider.useValue;
    if (provider && provider.useClass) return $instances[provide] = new provider.useClass();
    if (provider && provider.useFunction) return $instances[provide] = provider.useFunction();
    if (provide instanceof Function) return $instances[provide] = new provide();

    throw new NoProviderError(`not possible to find a provider for ${provide}`);
}

export const providers = (newProviders: IProviders[]) => {
    $providers = [...newProviders, ...$providers];
}

export function inject(provide: any): PropertyDecorator {

    return (target: any, key: string) => {
        const privateKey = Symbol(`__${key}`);
        delete target[key];

        Object.defineProperty(target, key, {
            get() {
                return this[privateKey] || getInstance(provide);
            },
            set(v) {
                this[privateKey] = v;
            },
            enumerable: true,
            configurable: false
        });
    }
}
