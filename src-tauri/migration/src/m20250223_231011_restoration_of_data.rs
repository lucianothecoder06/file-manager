use async_trait::async_trait;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        let db = manager.get_connection();

        db.execute_unprepared(
            "
            CREATE TABLE `quickpath` (
                `id` INTEGER PRIMARY KEY AUTOINCREMENT,
                `parent_id` INT DEFAULT NULL,
                `name` VARCHAR(255) NOT NULL,
                `full_path` VARCHAR(255) NOT NULL UNIQUE,
                `is_dir` BOOLEAN NOT NULL,
                `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
                `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
                `last_modified` DATETIME
            ); 
            CREATE TABLE `dir_entries` (
              `id` INTEGER PRIMARY KEY AUTOINCREMENT,
              `parent_id` INT DEFAULT NULL,
              `name` VARCHAR(255) NOT NULL,
              `full_path` VARCHAR(255) NOT NULL UNIQUE,
              `is_dir` BOOLEAN NOT NULL,
              `size` BIGINT DEFAULT 0,
              `extension` VARCHAR(50),
              `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
              `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
              `last_modified` DATETIME
            );
            CREATE TABLE `tags` (
              `id` INTEGER PRIMARY KEY AUTOINCREMENT,
              `parent_id` INT DEFAULT NULL,
              `name` VARCHAR(255) NOT NULL,
              `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
              `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
              `last_modified` DATETIME
            );
            ",
        )
        .await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .get_connection()
            .execute_unprepared(
                "DROP TABLE `quickpath`;
            DROP TABLE `dir_entries`;
            DROP TABLE `tags`;",
            )
            .await?;
        Ok(())
    }
}
