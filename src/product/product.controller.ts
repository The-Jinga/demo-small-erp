import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ProductService } from './product.service';
import { BaseController } from 'src/common/base.controller';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { ProductDto } from './dtos/product.dto';
import { transformWithGroups } from '../common/helpers/transform.helper';
import { RolePermissions } from '../auth/role-permissions.map';
import { ApiAuthDocs } from '../common/decorators/auth-swagger.decorator';
import { ApiBaseArrayResponse } from '../common/decorators/api-base-array-response.decorator';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiAuthDocs()
@Controller('products')
export class ProductController extends BaseController {
  constructor(private readonly productService: ProductService) {
    super();
  }

  @Get()
  @ApiBaseArrayResponse(ProductDto)
  @ApiOkResponse({
    description: 'Fetch products successfully',
  })
  async findAll(@Request() req) {
    const products = transformWithGroups(
      ProductDto,
      await this.productService.findAll(),
      RolePermissions[req.user.role],
    );

    return this.ok('Fetch products successfully', products);
  }
}
