export class QueryPostsDto {
    take: number = 10;
    skip: number = 0;
    fromCustomerId?: number;
}