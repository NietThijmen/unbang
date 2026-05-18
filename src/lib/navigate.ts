import type Bang from "./bang.d";
import {bangs} from "./bang";

function doRegex(input: string) {
    const bangRegex = /!(\w+)\s+(.*)/
    const match = input.match(bangRegex)
    if (!match) {
        console.info("No bang found in input")
        return {
            bangShortcut: null,
            queryWithoutBang: input
        };
    }
    const bangShortcut = match[1]
    const query = match[2]
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
        window.location.href = query; // redirect to the query itself if no bang is found
    }


    const bang = findBang(bangShortcut as string)
    if (!bang) {
        console.info("No bang found in query, skipping redirect")
        window.location.href = query; // redirect to the query itself if no bang is found
    }

    // redirect to the bang's URL with the query parameter replaced with the query
    // @ts-ignore
    const redirectUrl = bang.u.replace('{{{s}}}', encodeURIComponent(queryWithoutBang))
    window.location.href = redirectUrl;
    return redirectUrl;
}

export {findBang, handleRedirect}