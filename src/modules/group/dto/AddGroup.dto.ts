import { IsString } from "class-validator";

export class AddGroupDto {
    @IsString()
    name: string;

    @IsString()
    icon: string;
}