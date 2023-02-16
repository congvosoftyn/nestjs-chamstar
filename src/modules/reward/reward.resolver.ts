import { UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { Args, Int, Mutation, Resolver,Query } from "@nestjs/graphql";
import { RewardEntity } from "src/entities/Reward.entity";
import JwtAuthenticationGuard from "src/shared/guards/jwtAuthenticationGuard";
import { User } from "../user/decorators/user.decorator";
import { ClaimARewardInput } from "./dto/ClaimAReward.input";
import { NewRewardInput } from "./dto/NewReward.input";
import { RewardService } from "./reward.service";

@Resolver(() => RewardEntity)
@UseGuards(JwtAuthenticationGuard)
export class RewardResolver {
    constructor(private rewardService: RewardService) { }

    // @ApiBearerAuth('access-token')
    @Mutation(()=>RewardEntity)
    @UsePipes(new ValidationPipe())
    async newReward(@Args('newReward') newReward: NewRewardInput, @User('storeId') storeId: number) {
        return this.rewardService.newReward(storeId, newReward);
    }

    // @ApiBearerAuth('access-token')
    @Mutation(()=>RewardEntity)
    @UsePipes(new ValidationPipe())
    async updateReward(@Args('updateReward') updateReward: NewRewardInput, @User('storeId') storeId: number) {
        return this.rewardService.newReward(storeId, updateReward);
    }

    // @ApiBearerAuth('access-token')
    @Query(()=>RewardEntity)
    async getRewards(@Args('search',{type:()=>String}) search: string, @User('storeId') storeId: number) {
        return this.rewardService.getRewards(search, storeId);
    }

    // @ApiBearerAuth('access-token')
    @Query(()=>RewardEntity,{name:'claimed'})
    async rewardClaim(@Args('id', { type: () => Int }) id: number) {
        return this.rewardService.rewardClaim(id);
    }

    // @ApiBearerAuth('access-token')
    @Mutation(()=>RewardEntity,{name:'claim'})
    async claimAReward(@Args('claimAReward') claimAReward: ClaimARewardInput, @User('companyId') companyId: number, @User('storeId') storeId: number) {
        return this.rewardService.claimAReward(claimAReward, companyId, storeId);
    }

    // @ApiBearerAuth('access-token')
    @Mutation(()=>RewardEntity)
    async deleteReward(@Args('id', { type: () => Int }) id: number) {
        return this.rewardService.deleteReward(id);
    }
}