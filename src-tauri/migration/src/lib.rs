pub use sea_orm_migration::prelude::*;

mod m20250223_210101_create_file_type;

pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![Box::new(m20250223_210101_create_file_type::Migration)]
    }
}