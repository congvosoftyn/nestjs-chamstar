export class UpdateServicesByCategoryDto {
    categories: Array<CategoryDto>;
}

export class CategoryDto {
    service_id: number;
    category_id: number;
    name: string;
    selected: boolean;
    addNew: boolean = true;
}