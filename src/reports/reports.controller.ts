import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { BaseController } from '../common/base.controller';
import { InventoryTurnoverQueryDto } from './dtos/inventory-turnover-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permission } from '../common/enums/permission.enum';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { ApiAuthDocs } from 'src/common/decorators/auth-swagger.decorator';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { ApiBaseArrayResponse } from '../common/decorators/api-base-array-response.decorator';
import { InventoryTurnoverDto } from './dtos/inventory-turnover.dto';
import { plainToInstance } from 'class-transformer';
import { SupplierSpendingDto } from './dtos/supplier-spending.dto';

@Controller('reports')
@ApiBearerAuth()
@ApiAuthDocs()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Permissions(Permission.VIEW_FINANCIAL_FIELDS)
export class ReportsController extends BaseController {
  constructor(private readonly reportsService: ReportsService) {
    super();
  }

  @Get('inventory-turnover')
  @ApiBaseArrayResponse(InventoryTurnoverDto)
  @ApiOkResponse({
    description: 'Fetch inventory turnover reports successfully',
  })
  async getInventoryTurnover(@Query() query: InventoryTurnoverQueryDto) {
    const data = await this.reportsService.getInventoryTurnover(
      new Date(query.start),
      new Date(query.end),
    );
    return this.ok(
      'Fetch inventory turnover reports successfully',
      plainToInstance(InventoryTurnoverDto, data),
    );
  }

  @Get('supplier-spending')
  @ApiBaseArrayResponse(SupplierSpendingDto)
  @ApiOkResponse({
    description: 'Fetch supplier spending reports successfully',
  })
  async getSupplierSpending() {
    const data = plainToInstance(
      SupplierSpendingDto,
      await this.reportsService.getSupplierSpending(),
    );
    return this.ok('Fetch supplier spending reports successfully', data);
  }
}
