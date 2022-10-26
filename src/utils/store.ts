export class Store {
    private static _store = new Map<string, any>();

    public static KEYS = {
        CACHE: "cache",
    };
    public static get<T>(key: string) {
        return Store._store.get(key) as T;
    }

    public static set(key: string, value: any) {
        Store._store.set(key, value);
    }
}
