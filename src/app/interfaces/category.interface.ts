export interface Subcategory {
    id: number,
    name: string,
    nav: string
}

export interface Category {
    id: number,
    name: string,
    nav: string,
    subcat: Subcategory[],
    image_path: string
}