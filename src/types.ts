export interface Country{
    id:string,
    name:string,
    population:string,
    land_area:string,
    density:string,
    capital:string,
    currency:string,
    flag:string,
    [key:string]: number|string
}

export interface TableHeader{
    name:string,
    checked:boolean,
    [key:string]: number|string|boolean
}

export interface Pagination{
    offset:number,
    current:number,
    next:number,
    prev:number,
    total:number,
    perPage:number,
    [key:string]: number|string|boolean
}