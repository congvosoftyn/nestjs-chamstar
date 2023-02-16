import { Body, Controller, Get, Post, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import { User } from '../user/decorators/user.decorator';
import { AddonService } from './addon.service';
import { AddAddonToBillDto } from './dto/AddAddonToBill.dto';
import { InAppPurchaseAddonDto } from './dto/InAppPurchaseAddon.dto';

@Controller('addon')
@ApiTags('addon')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthenticationGuard)
export class AddonController {
    constructor(private addonService: AddonService) { }

    @Get()
    async getAddon() {
        return this.addonService.getAddon();
    }

    // @Post('/addToAccount')
    // @UsePipes(new ValidationPipe())
    // async addAddonToBill(@Body() body: AddAddonToBillDto, @User('companyId') companyId: number) {
    //     return this.addonService.addAddonToBill(companyId, body);
    // }

    // @Post('/iap')
    // async inAppPurchaseAddon(@Body() body: InAppPurchaseAddonDto, @User('companyId') companyId: number) {
    //     return this.addonService.inAppPurchaseAddon(body, companyId);
    // }
}
