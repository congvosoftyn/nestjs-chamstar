import { IsNumber } from "class-validator";

export class RequestWaitListFromCustomerDto {
    @IsNumber()
    storeId: number;

    @IsNumber()
    tableSize: number;

    @IsNumber()
    distanceToStore: number;
}