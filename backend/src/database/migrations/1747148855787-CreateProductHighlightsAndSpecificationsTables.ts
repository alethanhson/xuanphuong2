import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductHighlightsAndSpecificationsTables1747148855787 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Tạo bảng product_highlights
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "product_highlights" (
                "id" SERIAL PRIMARY KEY,
                "productId" INTEGER NOT NULL,
                "title" VARCHAR(255) NOT NULL,
                "description" TEXT NOT NULL,
                "icon" VARCHAR(255) NULL,
                "order" INTEGER NOT NULL DEFAULT 0,
                FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE
            )
        `);

        // Tạo bảng product_specifications
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "product_specifications" (
                "id" SERIAL PRIMARY KEY,
                "productId" INTEGER NOT NULL,
                "name" VARCHAR(255) NOT NULL,
                "value" TEXT NOT NULL,
                "group" VARCHAR(255) NULL,
                "order" INTEGER NOT NULL DEFAULT 0,
                FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Xóa các bảng theo thứ tự ngược lại
        await queryRunner.query(`DROP TABLE IF EXISTS "product_specifications"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "product_highlights"`);
    }

}
