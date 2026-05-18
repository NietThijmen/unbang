import {bangs} from "../bang";
import type Bang from '../bang.d'
import CustomBangs from "./customBangs";

export default class Bangs {
    // get a mix of bangs from the JS and the custom bangs
    static getBangs(): Bang[] {
        const customBangs = CustomBangs.getCustomBangs();

        return [...bangs, ...customBangs];
    }

}