import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { PermissionService } from './permission.service';

@Controller('permission')
@ApiTags('permission')
export class PermissionController {
    constructor(private permissionService: PermissionService) { }

    @Get()
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    async allPermissions() {
        return this.permissionService.allPermissions();
    }

}
