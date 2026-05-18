export default class DefaultBang {
    // just a store with the default bang backed by local storage

    static getDefaultBang(): string {
        const defaultBang = localStorage.getItem('defaultBang');
        if (!defaultBang) {
            return 'g'; // default to Google if no default bang is set
        }
        return defaultBang;
    }

    static setDefaultBang(bangShortcut: string) {
        localStorage.setItem('defaultBang', bangShortcut);
    }
}