export class UpdateCustomerDto {
    id: number;
    phoneNumber?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    dob?: number;
    gender?: string;
    avatar?: string;
    website?: string;
    description?: string;
}