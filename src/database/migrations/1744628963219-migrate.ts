import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrate1744628963219 implements MigrationInterface {
  name = 'Migrate1744628963219';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" text NOT NULL,
        "email" text NOT NULL,
        "passwordHash" text NOT NULL,
        "role" text NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
        CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "audit_logs" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "action" text NOT NULL,
        "entityType" text NOT NULL,
        "entityId" uuid NOT NULL,
        "changes" jsonb NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "userId" uuid,
        CONSTRAINT "PK_1bb179d048bbc581caa3b013439" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "suppliers" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" text NOT NULL,
        "email" text,
        "creditLimit" numeric(18,2),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_b70ac51766a9e3144f778cfe81e" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "purchase_orders" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "status" text NOT NULL,
        "totalAmount" numeric(18,2) NOT NULL DEFAULT '0',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "supplierId" uuid,
        "createdBy" uuid,
        CONSTRAINT "PK_05148947415204a897e8beb2553" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "products" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" text NOT NULL,
        "sku" text NOT NULL,
        "category" text,
        "unitPrice" numeric(12,2) NOT NULL,
        "stock" integer NOT NULL DEFAULT '0',
        "pendingStock" integer NOT NULL DEFAULT '0',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_c44ac33a05b144dd0d9ddcf9327" UNIQUE ("sku"),
        CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "purchase_order_items" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "quantity" integer NOT NULL,
        "unitPrice" numeric(12,2) NOT NULL,
        "purchaseOrderId" uuid,
        "productId" uuid,
        CONSTRAINT "PK_e8b7568d25c41e3290db596b312" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "inventory_transactions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "type" text NOT NULL,
        "quantity" integer NOT NULL,
        "note" text,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "productId" uuid,
        "relatedPoId" uuid,
        "performedBy" uuid,
        CONSTRAINT "PK_9b7144851f08f9eededde7edd42" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "approval_logs" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "action" text NOT NULL,
        "comment" text,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "purchaseOrderId" uuid,
        "approvedBy" uuid,
        CONSTRAINT "PK_5ea530f8eff8a9e5e143c3b60be" PRIMARY KEY ("id")
      )
    `);

    // Foreign Keys
    await queryRunner.query(`
      ALTER TABLE "audit_logs" ADD CONSTRAINT "FK_audit_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "purchase_orders" ADD CONSTRAINT "FK_po_supplier" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "purchase_orders" ADD CONSTRAINT "FK_po_creator" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "purchase_order_items" ADD CONSTRAINT "FK_poi_po" FOREIGN KEY ("purchaseOrderId") REFERENCES "purchase_orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "purchase_order_items" ADD CONSTRAINT "FK_poi_product" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "inventory_transactions" ADD CONSTRAINT "FK_it_product" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "inventory_transactions" ADD CONSTRAINT "FK_it_po" FOREIGN KEY ("relatedPoId") REFERENCES "purchase_orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "inventory_transactions" ADD CONSTRAINT "FK_it_user" FOREIGN KEY ("performedBy") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "approval_logs" ADD CONSTRAINT "FK_al_po" FOREIGN KEY ("purchaseOrderId") REFERENCES "purchase_orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "approval_logs" ADD CONSTRAINT "FK_al_user" FOREIGN KEY ("approvedBy") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "approval_logs" DROP CONSTRAINT "FK_3609d1eec9ed6a57ee5e59579d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "approval_logs" DROP CONSTRAINT "FK_b5d7969735f12b9f7b9230cd4d5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_transactions" DROP CONSTRAINT "FK_18dd799fc31bb0db7501ba46710"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_transactions" DROP CONSTRAINT "FK_7a6edf3dda28e84a361825b8189"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_transactions" DROP CONSTRAINT "FK_2520d97de0c9a0fbfc9b00f4c1b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchase_order_items" DROP CONSTRAINT "FK_d5089517fc19b1b9fb04454740c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchase_order_items" DROP CONSTRAINT "FK_3f92bb44026cedfe235c8b91244"`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchase_orders" DROP CONSTRAINT "FK_99f44faa1ca8d7ec9ebef918b06"`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchase_orders" DROP CONSTRAINT "FK_d16a885aa88447ccfd010e739b0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "audit_logs" DROP CONSTRAINT "FK_bd2726fd31b35443f2245b93ba0"`,
    );
    await queryRunner.query(`DROP TABLE "approval_logs"`);
    await queryRunner.query(`DROP TABLE "inventory_transactions"`);
    await queryRunner.query(`DROP TABLE "purchase_order_items"`);
    await queryRunner.query(`DROP TABLE "products"`);
    await queryRunner.query(`DROP TABLE "purchase_orders"`);
    await queryRunner.query(`DROP TABLE "suppliers"`);
    await queryRunner.query(`DROP TABLE "audit_logs"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
