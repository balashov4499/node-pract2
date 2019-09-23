import {MigrationInterface, QueryRunner} from "typeorm";

export class ProductQuantityFields1568989091110 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `card_product_quantity` ADD `productId` int NOT NULL");
        await queryRunner.query("ALTER TABLE `card_product_quantity` ADD `quantity` int NOT NULL DEFAULT 0");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `card_product_quantity` DROP COLUMN `quantity`");
        await queryRunner.query("ALTER TABLE `card_product_quantity` DROP COLUMN `productId`");
    }

}
