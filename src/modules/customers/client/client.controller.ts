import { Controller, Get, Param, Query, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import { ClientService } from './client.service';
import { QueryFollowersDto } from './dto/QueryFollowers.dto';

@Controller('customer-client')
@ApiTags('customer-client')
export class ClientController {
  constructor(private readonly clientService: ClientService) { }

  @Get('/follower')
  @ApiBearerAuth('customer-token')
  @UseGuards(JwtAuthenticationGuard)
  @UsePipes(new ValidationPipe())
  async getFollowers(@Query() query: QueryFollowersDto) {
    return this.clientService.getFollowers(query)
  }

  @Get('/following')
  @ApiBearerAuth('customer-token')
  @UseGuards(JwtAuthenticationGuard)
  @UsePipes(new ValidationPipe())
  async getFollowings(@Query() query: QueryFollowersDto) {
    return this.clientService.getFollowings(query)
  }

  @Get('/:id')
  @ApiBearerAuth('customer-token')
  @UseGuards(JwtAuthenticationGuard)
  async customerDetail(@Param('id') id: number) {
    return this.clientService.customerDetail(id)
  }
}
