use dotenv::dotenv;
use sea_orm::{ActiveModelTrait, Database, DatabaseConnection};
use std::env::var;

use entity::quickpath as QuickPathTable;
use entity::quickpath::Model as QuickPath;
use sea_orm::entity::prelude::*;
use sea_orm::ActiveValue::Set;

#[derive(serde::Deserialize, serde::Serialize)]
pub struct QuickPathData {
    pub path: String,
    pub parent_id: Option<i32>,
    pub name: String,
}

#[tauri::command]
pub async fn create_quickpath(new_quickpath: QuickPathData) -> Result<String, String> {
    dotenv().ok();
    let db_url: String = var("DATABASE_URL").unwrap();

    let db: DatabaseConnection = match Database::connect(db_url).await {
        Ok(db) => db,
        Err(e) => return Err(e.to_string()),
    };

    let quickpath = QuickPathTable::ActiveModel {
        full_path: Set(new_quickpath.path.to_owned()),
        parent_id: Set(new_quickpath.parent_id),
        name: Set(new_quickpath.name.to_owned()),
        is_dir: Set(true),
        ..Default::default()
    }
    .save(&db)
    .await;

    match quickpath {
        Ok(_) => println!("QuickPath created"),
        Err(e) => return Err(e.to_string()),
    }

    Ok("".to_string())
}

#[tauri::command]
pub async fn get_quickpaths() -> Result<Vec<QuickPath>, String> {
    dotenv().ok();
    let db_url: String = var("DATABASE_URL").unwrap();
    let db: DatabaseConnection = match Database::connect(db_url).await {
        Ok(db) => db,
        Err(e) => return Err(e.to_string()),
    };
    let quickpaths: Vec<QuickPath> = QuickPathTable::Entity::find().all(&db).await.unwrap();
    Ok(quickpaths)
}
