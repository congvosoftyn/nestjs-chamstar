export class NewProductDto {
    // id?: number;
    name: string;
    cost: number = 0;
    price: number = 0;
    stocks: number = 0;
    description?: string;
    photo?: string;
    thumb?: string;
    color?: string;
    orderBy: number = 0;
    serviceDuration: number = 60;
    SKU?: string;
    storeId?: number;
    // suppilerId?: number;
    // categoryId?: number;
    // removed_options?: ProductOptionDto[];
}

// export class ProductOptionDto {
//     id: number;
//     name: string;
//     price: number;
//     orderBy: number;
// }