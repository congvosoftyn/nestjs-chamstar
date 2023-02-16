export class ReOrderProductsDto {
    id?: number;
    name: string;
    cost: number;
    price: number;
    stocks: number;
    description?: string;
    photo?: string;
    thumb?: string;
    color?: string;
    orderBy?: number;
    serviceDuration: number = 60;
    SKU?: string;
    storeId?: number;
    suppilerId?: number;
    categoryId?: number;
}