export class CreateLabelDto {
  isEditable: boolean = true;
  name: string;
  color: string = '#EEEEEE';
  description: string = '';
}