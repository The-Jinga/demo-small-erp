import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  Request,
  Get,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReceiveGoodsDto } from './dtos/receive-goods.dto';
import { BaseController } from 'src/common/base.controller';
import { StockOutDto } from './dtos/stock-out.dto';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permission } from '../common/enums/permission.enum';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { transformWithGroups } from '../common/helpers/transform.helper';
import { InventoryTransactionDto } from './dtos/inventory-transaction.dto';
import { RolePermissions } from '../auth/role-permissions.map';
import { ApiAuthDocs } from '../common/decorators/auth-swagger.decorator';
@ApiBearerAuth()
@ApiAuthDocs()
@Controller('inventories')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class InventoryController extends BaseController {
  constructor(private readonly inventoryService: InventoryService) {
    super();
  }

  @Post(':id/stock-in')
  @Permissions(Permission.STOCK_IN)
  async stockIn(
    @Param('id') purchaseOrderId: string,
    @Request() req,
    @Body() receiveGoodsDto: ReceiveGoodsDto,
  ): Promise<void> {
    await this.inventoryService.stockIn(
      purchaseOrderId,
      receiveGoodsDto,
      req.user.id,
    );
    return this.ok('Stock in successfully');
  }

  @Post('stock-out')
  @Permissions(Permission.STOCK_OUT)
  async stockOut(
    @Request() req,
    @Body() stockOutDto: StockOutDto,
  ): Promise<void> {
    await this.inventoryService.stockOut(stockOutDto, req.user.id);
    return this.ok('Stock out successfully');
  }

  @Get('transactions')
  async getTransactions(@Request() req) {
    const orders = transformWithGroups(
      InventoryTransactionDto,
      await this.inventoryService.getTransactions(),
      RolePermissions[req.user.role],
    );
    return this.ok('Fetch inventory transaction successfully', orders);
  }
}
