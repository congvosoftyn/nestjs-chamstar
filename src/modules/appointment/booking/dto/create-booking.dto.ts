import { PartialType } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";
import { AppointmentBookingStatus } from "src/entities/AppointmentBooking.entity";

export class Service {
    @IsNumber()
    id: number;
    @IsNumber()
    price: number = 0;
    @IsNumber()
    @IsOptional()
    categoryId?: number;
    @IsNumber()
    staffId: number;
}

export class Package {
    @IsNumber()
    id: number;
    @IsNumber()
    price: number;
    @IsNumber()
    staffId: number;
}

export class AppointmentDto {
    @IsNumber()
    @IsOptional()
    customerId?: number;
    date: Date;
    lastDate: Date;
    status: string = AppointmentBookingStatus.booked;
    color: string = '#EEEEEE';
    note?: string;
    storeId?: number;
    isCheckIn: boolean = false;
    labelId?: number;
    remiderSent?: boolean = false;
    followUpSent?: boolean = false;
    didNotShow: boolean = false;
    didNotShowSent: boolean = false;
    duration: number;
    extraTime?: number = 0;
}

export class CreateAppointmentDto extends PartialType(AppointmentDto) {
    services?: Service[];
    packages?: Package[];
    reason?: string;
}
