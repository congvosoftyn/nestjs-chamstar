export class UpdatePromotionDto {
    name?: string;
    text?: string;
    description?: string;
    groups: string;
    startDate?: Date;
    endDate?: Date;
}