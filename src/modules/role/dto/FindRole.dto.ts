export class FindRoleDto {
    pageNumber: number = 0;
    pageSize: number = 10;
    sortField: string = '';
    sortOrder: string = 'asc';
    filter: string = '';
}