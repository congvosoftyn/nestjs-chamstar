import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AddonEntity } from 'src/entities/Addon.entity';
import { User } from '../user/decorators/user.decorator';
import { AddonService } from './addon.service';
import { AddAddonToBillInput } from './dto/AddAddonToBill.input';
import { InAppPurchaseAddonInput } from './dto/InAppPurchaseAddon.input';

@Resolver(() => AddonEntity)
export class AddonResolver {
  constructor(private addonService: AddonService) { }

  @Query(() => [AddonEntity])
  getAddon() {
    return this.addonService.getAddon();
  }

  // @Mutation(() => AddonEntity, { name: 'addToAccount' })
  // async addAddonToBill(@Args('addAddonToBillInput') addAddonToBillInput: AddAddonToBillInput, @User('companyId') companyId: number,) {
  //   return this.addonService.addAddonToBill(companyId, addAddonToBillInput);
  // }

  // @Mutation(() => AddonEntity, { name: 'iap' })
  // async inAppPurchaseAddon(@Args('inAppPurchaseAddonInput') inAppPurchaseAddonInput: InAppPurchaseAddonInput, @User('companyId') companyId: number,) {
  //   return this.addonService.inAppPurchaseAddon(inAppPurchaseAddonInput, companyId,);
  // }
}
