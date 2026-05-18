export default interface Bang {
    c: string // Category
    d: string // Domain
    r: number // Relevance
    s: string // Title
    sc: string // Alternate title
    t: string // Shortcut
    u: string // search URL

    isCustom?: boolean // whether this is a custom bang or not
}