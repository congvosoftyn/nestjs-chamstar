import { UseGuards } from "@nestjs/common"
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql"
import { SubscriptionEntity } from "src/entities/Subscription.entity"
import JwtAuthenticationGuard from "src/shared/guards/jwtAuthenticationGuard"
import { User } from "../user/decorators/user.decorator"
import { FindSubscriptionInput } from "./dto/FindSubscription.input"
import { UpgradeSubscriptionInput } from "./dto/UpgradeSubscription.input"
import { SubscriptionService } from "./subscription.service"

@Resolver(() => SubscriptionEntity)
@UseGuards(JwtAuthenticationGuard)
export class SubscriptionResolver{
    constructor(private subscriptionService: SubscriptionService) { }

    // @ApiBearerAuth('access-token')
    @Query(()=>SubscriptionEntity)
    async getSubscription(@User('companyId') companyId: number) {
        return this.subscriptionService.getSubscription(companyId)
    }

    // @ApiBearerAuth('access-token')
    @Mutation(()=>SubscriptionEntity,{name:'upgrade'})
    async upgradeSubscription(@Args('upgradeSubscription') upgradeSubscription: UpgradeSubscriptionInput, @User('companyId') companyId: number) {
        return this.subscriptionService.upgradeSubscription(upgradeSubscription, companyId)
    }

    // @ApiBearerAuth('access-token')
    @Query(()=>SubscriptionEntity,{name:'find'})
    async findSubscription(@Args('body') body: FindSubscriptionInput, @User('companyId') companyId: number) {
        return this.subscriptionService.findSubscription(body.pageNumber, body.pageSize, companyId)
    }
}
