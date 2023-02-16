export class AddCustomerGroupDto {
    customerId: number;
    group: {
        name: string;
        icon: string;
    };
}