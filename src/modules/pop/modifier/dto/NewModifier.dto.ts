export class NewModifierDto {
    id?: number;
    name: string;
    orderBy?: number = 0;
    selectOneOnly: boolean;
}