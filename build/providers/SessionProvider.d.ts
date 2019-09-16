export default class SessionProvider {
    protected $container: any;
    constructor($container: any);
    register(): void;
    boot(): void;
}
