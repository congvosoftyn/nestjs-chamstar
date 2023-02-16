export class CreatePaymentDto {
    billId: number;
    payment_method: string = "cash";
    amount: number;
}