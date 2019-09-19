import {MigrationInterface, QueryRunner} from "typeorm";

export class AddingCategories1568886672652 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `product` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `description` varchar(255) NOT NULL, UNIQUE INDEX `IDX_22cc43e9a74d7498546e9a63e7` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `category` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `description` varchar(255) NOT NULL, `parentCategoryId` int NULL, UNIQUE INDEX `IDX_23c05c292c439d77b0de816b50` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `product_categories_category` (`productId` int NOT NULL, `categoryId` int NOT NULL, INDEX `IDX_342d06dd0583aafc156e076379` (`productId`), INDEX `IDX_15520e638eb4c46c4fb2c61c4b` (`categoryId`), PRIMARY KEY (`productId`, `categoryId`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `user` CHANGE `role` `role` enum ('admin', 'customer') NOT NULL DEFAULT 'customer'");
        await queryRunner.query("ALTER TABLE `category` ADD CONSTRAINT `FK_9e5435ba76dbc1f1a0705d4db43` FOREIGN KEY (`parentCategoryId`) REFERENCES `category`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `product_categories_category` ADD CONSTRAINT `FK_342d06dd0583aafc156e0763790` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `product_categories_category` ADD CONSTRAINT `FK_15520e638eb4c46c4fb2c61c4b4` FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `product_categories_category` DROP FOREIGN KEY `FK_15520e638eb4c46c4fb2c61c4b4`");
        await queryRunner.query("ALTER TABLE `product_categories_category` DROP FOREIGN KEY `FK_342d06dd0583aafc156e0763790`");
        await queryRunner.query("ALTER TABLE `category` DROP FOREIGN KEY `FK_9e5435ba76dbc1f1a0705d4db43`");
        await queryRunner.query("ALTER TABLE `user` CHANGE `role` `role` enum ('admin', 'customer') NOT NULL");
        await queryRunner.query("DROP INDEX `IDX_15520e638eb4c46c4fb2c61c4b` ON `product_categories_category`");
        await queryRunner.query("DROP INDEX `IDX_342d06dd0583aafc156e076379` ON `product_categories_category`");
        await queryRunner.query("DROP TABLE `product_categories_category`");
        await queryRunner.query("DROP INDEX `IDX_23c05c292c439d77b0de816b50` ON `category`");
        await queryRunner.query("DROP TABLE `category`");
        await queryRunner.query("DROP INDEX `IDX_22cc43e9a74d7498546e9a63e7` ON `product`");
        await queryRunner.query("DROP TABLE `product`");
    }

}
