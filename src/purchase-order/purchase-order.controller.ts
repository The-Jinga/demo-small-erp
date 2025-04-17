import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BaseController } from '../common/base.controller';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePurchaseOrderDto } from './dtos/create-purchase-order.dto';
import { PurchaseOrderService } from './purchase-order.service';
import { Request } from '@nestjs/common';
import { ReviewPurchaseOrderDto } from './dtos/review-purchase-order.dto';
import { PurchaseOrderStatus } from '../common/enums';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { Permission } from '../common/enums/permission.enum';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PurchaseOrderDto } from './dtos/purchase-order.dto';
import { transformWithGroups } from '../common/helpers/transform.helper';
import { RolePermissions } from '../auth/role-permissions.map';
import { ApiAuthDocs } from '../common/decorators/auth-swagger.decorator';

@ApiTags('Purchase Orders')
@ApiBearerAuth()
@ApiAuthDocs()
@Controller('purchase-orders')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PurchaseOrderController extends BaseController {
  constructor(private readonly purchaseOrderService: PurchaseOrderService) {
    super();
  }

  @ApiOperation({ summary: 'Create a new purchase order' })
  @Permissions(Permission.CREATE_PURCHASE_ORDER)
  @Post()
  async create(@Request() req, @Body() createDto: CreatePurchaseOrderDto) {
    const order = await this.purchaseOrderService.create(
      req.user.id,
      createDto,
    );
    if (!order) {
      throw new HttpException(
        'Create purchase order fail',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.ok('Create purchase order successfully');
  }

  @ApiOperation({ summary: 'Submit a purchase order for review' })
  @Permissions(Permission.CREATE_PURCHASE_ORDER)
  @Put(':id/submit')
  async submitForReview(@Param('id') id: string) {
    const order = await this.purchaseOrderService.submitForReview(id);
    return this.ok(
      'Change purchase order to pending review successfully',
      order,
    );
  }

  @ApiOperation({ summary: 'Review a purchase order' })
  @Permissions(Permission.APPROVE_PURCHASE_ORDER)
  @Put(':id/review')
  async review(
    @Request() req,
    @Param('id') id: string,
    @Body() reviewDto: ReviewPurchaseOrderDto,
  ) {
    const order = await this.purchaseOrderService.review(
      id,
      req.user.id,
      reviewDto,
    );
    return this.ok(
      `Change purchase order to ${order.status} review successfully`,
    );
  }

  @ApiOperation({ summary: 'Get all purchase orders' })
  @Get()
  async findAll(@Request() req, @Query('status') status?: PurchaseOrderStatus) {
    const orders = transformWithGroups(
      PurchaseOrderDto,
      await this.purchaseOrderService.findAll(status),
      RolePermissions[req.user.role],
    );
    return this.ok('Fetch purchase orders successfully', orders);
  }

  @ApiOperation({ summary: 'Get a purchase order by id' })
  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    const orders = transformWithGroups(
      PurchaseOrderDto,
      await this.purchaseOrderService.findOne(id),
      RolePermissions[req.user.role],
    );
    return this.ok('Fetch purchase orders successfully', orders);
  }
}
