import { UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CheckInEntity } from "src/entities/CheckIn.entity";
import { CompanyEntity } from "src/entities/Company.entity";
import { MessageSentEntity } from "src/entities/MessageSent.entity";
import { ReviewEntity } from "src/entities/Review.entity";
import JwtAuthenticationGuard from "src/shared/guards/jwtAuthenticationGuard";
import { User } from "../user/decorators/user.decorator";
import { MessageStatusInput } from "./dto/MessageStatus.input";
import { UpdateReviewInput } from "./dto/UpdateReview.input";
import { ReviewService } from "./review.service";

@Resolver(() => ReviewEntity)
export class ReviewResolver {
    constructor(private reviewService: ReviewService) { }

    // @ApiBearerAuth('access-token')
    @Query(() => ReviewEntity)
    @UseGuards(JwtAuthenticationGuard)
    async getReviews(@Args('page', { type: () => Int }) page: number, @User('storeId') storeId: number) {
        return this.reviewService.getReviews(page, storeId);
    }

    @Query(() => CompanyEntity, { name: 'company' })
    async getCompanyData(@Args('token', { type: () => String }) token: string) {
        return this.reviewService.getCompanyData(token);
    }

    @Query(() => CheckInEntity, { name: 'string' })
    async getStoreData(@Args('id', { type: () => String }) id: string) {
        return this.reviewService.getStoreData(id);
    }

    @Query(() => MessageSentEntity, { name: 'messageStatus' })
    @UsePipes(new ValidationPipe())
    async messageStatus(@Args('messageStatus') messageStatus: MessageStatusInput) {
        return this.reviewService.messageStatus(messageStatus);
    }

    @Mutation(() => ReviewEntity, { name: 'mood' })
    @UsePipes(new ValidationPipe())
    async addMood(@Args('id', { type: () => Int }) id: number, @Args('mood', { type: () => String }) mood: string,) {
        return this.reviewService.addMood({ id, mood });
    }

    @Mutation(() => ReviewEntity)
    @UsePipes(new ValidationPipe())
    async updateReview(@Args('updateReview') updateReview: UpdateReviewInput) {
        return this.reviewService.updateReview(updateReview);
    }
}