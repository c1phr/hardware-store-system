export interface Subcategory {
    id: number,
    name: string,
    nav: string,
    id_category?: number,
}

export interface Highlight {
    amount: number,
    category: number,
    description: string,
    id: number,
    name: string,
    nav?: string,
    subcategory: number,
    url?: string,
    value: number
}

export interface Category {
    id: number,
    name: string,
    nav: string,
    subcat: Subcategory[],
    image_path: string,
    highlights?: Highlight[]
}

