import { cleanInjector, getInstance, providers, NoProviderError, inject } from "./provider";
import { expect, use } from 'chai';
import SinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';

use(SinonChai);
use(chaiAsPromised);

describe('injector decorator test suite', () => {

    class TestClass { }

    afterEach(() => {
        cleanInjector();
    });

    describe('getInstance method test suite', () => {
        it('should instanciate and provide a TestClass instance, and provide same instance when requested again', () => {
            const test = getInstance(TestClass);
            expect(test).to.be.instanceof(TestClass);

            const test2 = getInstance(TestClass);
            expect(test2).to.be.equal(test);
        });

        it('should instanciate and provide instance based on a registered provider with useClass attribute', () => {
            providers([{
                provide: 'ProviderName',
                useClass: TestClass
            }]);

            const test = getInstance('ProviderName');
            expect(test).to.be.instanceof(TestClass);
        });

        it('should instanciate and provide instance based on a registered provider with useValue attribute', () => {
            const value = 'ABC';
            providers([{
                provide: 'ProviderName',
                useValue: value
            }]);

            const test = getInstance('ProviderName');
            expect(test).to.be.equal('ABC');
        });

        it('should instanciate a provide instance based on a registered provider with useFunction attribute', () => {
            providers([{
                provide: 'ProviderName',
                useFunction: () => '123'
            }]);

            const test = getInstance('ProviderName');
            expect(test).to.be.equal('123');
        });

        it('should throw an exception if it does not finde any provider', () => {
            expect(() => getInstance('UnknowProvider')).to.throw(NoProviderError, 'not possible to find a provider for UnknowProvider');
        });
    });

    describe('inject decorator test suite', () => {
        it('should return a PropertyDecorator', () => {
            expect(inject(TestClass)).to.be.instanceOf(Function);
        });

        it('should set a getter and setter to retrieve the injected value', () => {
            const target: any = {};
            const key = 'myAttr';
            inject(TestClass)(target, key);

            expect(target[key]).to.be.instanceof(TestClass);

            target[key] = 'NewValue';
            expect(target[key]).to.be.equal('NewValue');
        });
    });
});
