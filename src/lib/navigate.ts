import type Bang from "./bang.d";
import {bangs} from "./bang";

function doRegex(input: string) {
    // allow a bang with no following query, e.g. "!g" or "!g some search"
    // - ^!(\w+)    : starts with '!' followed by the shortcut
    // - (?:\s+(.*))?: optional whitespace and the rest of the query
    const bangRegex = /^!(\w+)(?:\s+(.*))?/
    const match = input.match(bangRegex)
    if (!match) {
        console.info("No bang found in input")
        return {
            bangShortcut: null,
            queryWithoutBang: input
        };
    }
    const bangShortcut = match[1]
    // if there's no query part (user typed just "!g"), match[2] will be undefined
    // normalize it to empty string so callers can treat missing query the same as an empty query
    const query = match[2] ?? ''
    console.info(`Found bang shortcut: ${bangShortcut}, query: ${query}`)

    return {
        bangShortcut: bangShortcut,
        queryWithoutBang: query
    }
}

function findBang(bangShortcut: string): Bang|null {


    // find the bang in the list of bangs
    const bang = bangs.find(b => b.t === bangShortcut)
    if (!bang) {
        return null;
    }

    // return the bang and the query
    return bang;
}

function handleRedirect() {
    // look for the ?q= parameter in the URL
    const urlParams = new URLSearchParams(window.location.search)
    const query = urlParams.get('q')
    if(!query) {
        console.info("No query found in URL, skipping redirect")
        return null;
    }

    const {bangShortcut, queryWithoutBang} = doRegex(query)

    if(!bangShortcut) {
        console.info("No bang shortcut found in query, skipping redirect")
        window.location.replace(query);
        return null;
    }


    let bang = findBang(bangShortcut as string)
    if (!bang) {
        console.info("No bang found in query, skipping redirect")
        window.location.replace(query);
        return null;
    }

    // bang is now always not null, so we can safely use it (This is such a hack, but it works)
    bang = bang as Bang;




    let redirectUrl: string;
    if(!queryWithoutBang) {
        redirectUrl = `https://${bang.d}`;
    } else {
        redirectUrl = bang.u.replace('{{{s}}}', encodeURIComponent(queryWithoutBang))
    }

    window.location.replace(redirectUrl);
    return redirectUrl;
}

export {findBang, handleRedirect}