import type Bang from '../bang.d'

export default class CustomBangs {
    // a store for custom bangs, backed by local storage

    static getCustomBangs(): Bang[] {
        const customBangs = localStorage.getItem('customBangs');
        if (!customBangs) {
            return [];
        }

        let customBangData = JSON.parse(customBangs);

        customBangData = customBangData.map((bang: Bang) => {
            bang.isCustom = true;
            return bang;
        });

        return customBangData;
    }

    static addCustomBang(bang: Bang) {
        const customBangs = CustomBangs.getCustomBangs();
        customBangs.push(bang);
        localStorage.setItem('customBangs', JSON.stringify(customBangs));
    }

    static removeCustomBang(bangShortcut: string) {
        let customBangs = CustomBangs.getCustomBangs();
        customBangs = customBangs.filter(b => b.t !== bangShortcut);
        localStorage.setItem('customBangs', JSON.stringify(customBangs));
    }
}