import { AppointmentBookingEntity } from "src/entities/AppointmentBooking.entity";
import { PackageCategoryEntity } from "src/entities/package-category.entity";
import { ProductEntity } from "src/entities/Product.entity";

export class BookingInfo {
    id: number;
    bookingId: number;
    serviceId: number | null;
    staffId: number;
    packageId: number | null;
    price: number;
    deleted: boolean;
    created_at: Date;
    updated_at: Date;
    service: ProductEntity;
    packages: PackageCategoryEntity;
    booking: AppointmentBookingEntity;
}