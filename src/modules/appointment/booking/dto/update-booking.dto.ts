import { PartialType } from "@nestjs/swagger";
import { AppointmentDto, CreateAppointmentDto, Package, Service } from "./create-booking.dto";
import {AppointmentBookingStatus} from "../../../../entities/AppointmentBooking.entity";
import { IsNumber } from "class-validator";

class UpdateService extends PartialType(Service) {
    delete: boolean = true;
    @IsNumber()
    bookingInfoId: number;
}

class UpdatePackage extends PartialType(Package) {
    delete: boolean = true;
    @IsNumber()
    bookingInfoId: number;
}

export class UpdateBookingDto extends PartialType(AppointmentDto) {
    packages?: UpdatePackage[];
    services?: UpdateService[];
}

export class CancelBookingDto {
    reason?: string;
    status: AppointmentBookingStatus.canceled;
}
