import {MigrationInterface, QueryRunner} from "typeorm";

export class AddindUserCard1568986109247 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `card_product_quantity` (`id` int NOT NULL AUTO_INCREMENT, `cardId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `card` (`id` int NOT NULL AUTO_INCREMENT, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `user` ADD `cardId` int NULL");
        await queryRunner.query("ALTER TABLE `user` ADD UNIQUE INDEX `IDX_de44ed71836e81c3fca3dc7fc5` (`cardId`)");
        await queryRunner.query("CREATE UNIQUE INDEX `REL_de44ed71836e81c3fca3dc7fc5` ON `user` (`cardId`)");
        await queryRunner.query("ALTER TABLE `user` ADD CONSTRAINT `FK_de44ed71836e81c3fca3dc7fc5c` FOREIGN KEY (`cardId`) REFERENCES `card`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `card_product_quantity` ADD CONSTRAINT `FK_73b322a27cc447fb7e5d3afa7af` FOREIGN KEY (`cardId`) REFERENCES `card`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `card_product_quantity` DROP FOREIGN KEY `FK_73b322a27cc447fb7e5d3afa7af`");
        await queryRunner.query("ALTER TABLE `user` DROP FOREIGN KEY `FK_de44ed71836e81c3fca3dc7fc5c`");
        await queryRunner.query("DROP INDEX `REL_de44ed71836e81c3fca3dc7fc5` ON `user`");
        await queryRunner.query("ALTER TABLE `user` DROP INDEX `IDX_de44ed71836e81c3fca3dc7fc5`");
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `cardId`");
        await queryRunner.query("DROP TABLE `card`");
        await queryRunner.query("DROP TABLE `card_product_quantity`");
    }

}
