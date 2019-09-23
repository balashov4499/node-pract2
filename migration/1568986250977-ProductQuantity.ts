import {MigrationInterface, QueryRunner} from "typeorm";

export class ProductQuantity1568986250977 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP INDEX `IDX_de44ed71836e81c3fca3dc7fc5` ON `user`");
        await queryRunner.query("ALTER TABLE `product` ADD `quantity` int NOT NULL DEFAULT 0");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `product` DROP COLUMN `quantity`");
        await queryRunner.query("CREATE UNIQUE INDEX `IDX_de44ed71836e81c3fca3dc7fc5` ON `user` (`cardId`)");
    }

}
