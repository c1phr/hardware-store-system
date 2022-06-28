export interface Product {
    amount: number,
    brand: string,
    description: string,
    id: number,
    name: string,
    url: string,
    value: number,
    nav?: string,
    id_category?: number,
    id_subcategory?: number,
    removed?: boolean,
    stockmin?: number
    year?: number
}