import {MigrationInterface, QueryRunner} from "typeorm";

export class Updates1568900597354 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `category` CHANGE `description` `description` varchar(255) NOT NULL DEFAULT ''");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `category` CHANGE `description` `description` varchar(255) NOT NULL");
    }

}
