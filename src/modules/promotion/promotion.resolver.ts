import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PromotionEntity } from 'src/entities/Promotion.entity';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { User } from '../user/decorators/user.decorator';
import { UpdatePromotionInput } from './dto/UpdatePromotion.input';
import { PromotionService } from './promotion.service';

@Resolver(() => PromotionEntity)
@UseGuards(JwtAuthenticationGuard)
export class PromotionResolver {
  constructor(private promotionService: PromotionService) {}

  // @ApiBearerAuth('access-token')
  @Query(() => PromotionEntity)
  async getPromotions(
    @Args('search', { type: () => String }) search: string,
    @User('companyId') companyId: number,
  ) {
    return this.promotionService.getPromotions(search, companyId);
  }

  // @ApiBearerAuth('access-token')
  @Mutation(() => PromotionEntity)
  @UsePipes(new ValidationPipe())
  async updatePromotion(
    @Args('updatePromotion') updatePromotion: UpdatePromotionInput,
    @User('companyId') companyId: number,
    @User('storeId') storeId: number,
  ) {
    return this.promotionService.updatePromotion(updatePromotion, companyId, storeId);
  }

  // @ApiBearerAuth('access-token')
  @Mutation(() => PromotionEntity)
  async deletePromotion(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<{ status: string }> {
    return this.promotionService.deletePromotion(id);
  }
}
