export class NewDiscountDto {
    // id?: number;
    name: string;
    percentage: boolean = true;
    amount: number = 0
    orderBy: number = 0;
    description?: string = '';
}