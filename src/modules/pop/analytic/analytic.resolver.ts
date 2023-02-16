import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { CustomerEntity } from 'src/entities/Customer.entity';
import { User } from 'src/modules/user/decorators/user.decorator';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { AnalyticService } from './analytic.service';

@Resolver(() => CustomerEntity)
//   @ApiBearerAuth('access-token')
@UseGuards(JwtAuthenticationGuard)
export class AnalyticResolver {
  constructor(private readonly analyticService: AnalyticService) {}

  @Query(() => CustomerEntity)
  async getStoreDashboard(
    @User('companyId') companyId: number,
    @User('storeId') storeId: number,
  ) {
    return this.analyticService.getStoreDashboard(companyId, storeId);
  }
}
