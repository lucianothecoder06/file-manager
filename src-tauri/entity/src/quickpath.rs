//! `SeaORM` Entity, @generated by sea-orm-codegen 1.1.4

use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq, serde::Serialize, serde::Deserialize)]
#[sea_orm(table_name = "quickpath")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub parent_id: Option<i32>,
    pub name: String,
    #[sea_orm(unique)]
    pub full_path: String,
    pub is_dir: bool,
    #[sea_orm(column_type = "custom(\"DATETIME\")", nullable)]
    pub created_at: Option<String>,
    #[sea_orm(column_type = "custom(\"DATETIME\")", nullable)]
    pub updated_at: Option<String>,
    #[sea_orm(column_type = "custom(\"DATETIME\")", nullable)]
    pub last_modified: Option<String>,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}
