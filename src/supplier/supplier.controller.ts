import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { Supplier } from './entities/supplier.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BaseController } from '../common/base.controller';
import { RolePermissions } from '../auth/role-permissions.map';
import { transformWithGroups } from '../common/helpers/transform.helper';
import { SupplierDto } from './dtos/supplier.dto';
import { ApiAuthDocs } from '../common/decorators/auth-swagger.decorator';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { ApiBaseArrayResponse } from '../common/decorators/api-base-array-response.decorator';
import { ApiBaseResponse } from '../common/decorators/api-base-response.decorator';

@ApiBearerAuth()
@ApiAuthDocs()
@Controller('suppliers')
@UseGuards(JwtAuthGuard)
export class SupplierController extends BaseController {
  constructor(private readonly supplierService: SupplierService) {
    super();
  }

  @Get()
  @ApiBaseArrayResponse(SupplierDto)
  @ApiOkResponse({
    description: 'Fetch products successfully',
  })
  async findAll(@Request() req): Promise<Supplier[]> {
    const suppliers = transformWithGroups(
      SupplierDto,
      await this.supplierService.findAll(),
      RolePermissions[req.user.role],
    );
    return this.ok('Fetch suppliers successfully', suppliers);
  }

  @Get(':id')
  @ApiBaseResponse(SupplierDto)
  @ApiOkResponse({
    description: 'Fetch products successfully',
  })
  async findOne(@Request() req, @Param('id') id: string): Promise<Supplier> {
    const supplier = transformWithGroups(
      SupplierDto,
      await this.supplierService.findOne(id),
      RolePermissions[req.user.role],
    );
    return this.ok('Fetch supplier successfully', supplier);
  }
}
