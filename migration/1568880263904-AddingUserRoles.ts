import {MigrationInterface, QueryRunner} from "typeorm";

export class AddingUserRoles1568880263904 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `user` ADD `role` enum ('admin', 'customer') NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `role`");
    }

}
