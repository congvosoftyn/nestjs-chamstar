import { Package, Service } from "src/modules/appointment/booking/dto/create-booking.dto";

class Product {
    id: number;
    price: number;
    quantity: number;
}


export class CheckOutDto {
    startTime: string = new Date().toLocaleDateString("sv");;
    bookingId: number;
    products?: Product[];
    services?: Service[];
    packages?: Package[];
    discount?: number = 0;
    coupon?: number = 0;
    note?: string;
    total: number;
    labelId?: number;
    date?: Date;
}