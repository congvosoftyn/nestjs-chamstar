export class NewTaxDto {
    name: string;
    rate: number = 8.25;
    type?: number = 0;
    orderBy?: number = 0;
}