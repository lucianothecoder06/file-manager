pub use sea_orm_migration::prelude::*;

mod m20250223_210101_create_file_type;
mod m20250223_224256_create_tags_and_quickpaths;
mod m20250223_230300_create_quickpaths;
mod m20250223_230720_create_quick;
mod m20250223_231011_restoration_of_data;




pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![Box::new(m20250223_231011_restoration_of_data::Migration)]
    }
}