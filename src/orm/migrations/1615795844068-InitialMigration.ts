import {MigrationInterface, QueryRunner} from 'typeorm';

export class InitialMigration1615795844068 implements MigrationInterface {
    name = 'InitialMigration1615795844068'

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`CREATE TABLE "WorklogEntity" (
        "id" varchar PRIMARY KEY NOT NULL,
        "iterator" integer NOT NULL,
        "key" varchar NOT NULL,
        "value" varchar NOT NULL,
        "time" datetime NOT NULL, 
        "deleted" boolean NOT NULL DEFAULT (0), 
        "rest" boolean NOT NULL DEFAULT (0), 
        "dayId" varchar, 
        CONSTRAINT "FK_00bb6efd3cc42dba6bea8432dc0" FOREIGN KEY ("dayId") REFERENCES "DayEntity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )`);

      await queryRunner.query(`CREATE TABLE "DayEntity" (
        "id" varchar PRIMARY KEY NOT NULL, 
        "start" datetime NOT NULL, 
        "finish" datetime
      )`);

      await queryRunner.query(`CREATE TABLE "NoteEntity" (
        "id" varchar PRIMARY KEY NOT NULL, 
        "iterator" integer NOT NULL, 
        "value" varchar NOT NULL, 
        "time" datetime NOT NULL, 
        "deleted" boolean NOT NULL DEFAULT (0)
      )`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`DROP TABLE "NoteEntity"`);
      await queryRunner.query(`DROP TABLE "DayEntity"`);
      await queryRunner.query(`DROP TABLE "WorklogEntity"`);
    }
}
