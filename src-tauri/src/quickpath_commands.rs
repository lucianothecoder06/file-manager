use dotenv::dotenv;
use sea_orm::{Database, DatabaseConnection, Set};

use entity::quickpath as QuickPathTable;
use entity::quickpath::Model as QuickPath;
use sea_orm::entity::prelude::*;

use entity::{dir_entries, quickpath, tags};
use sea_orm::{ConnectionTrait, Schema, Statement};

use std::env;
use std::path::PathBuf;

pub fn get_install_dir() -> PathBuf {
    env::current_dir().unwrap_or_else(|_| PathBuf::from("."))
}


#[derive(serde::Deserialize, serde::Serialize)]
pub struct QuickPathData {
    pub path: String,
    pub parent_id: Option<i32>,
    pub name: String,
}

#[tauri::command]
pub async fn setup_database() -> Result<String, String> {
    dotenv().ok();

    let install_dir = get_install_dir();// Get install dir
    let db_path = install_dir.join("db.sqlite"); // Database inside install dir
    let db_url = format!("sqlite:{}?mode=rwc", db_path.display());
    

    let db: DatabaseConnection = match Database::connect(&db_url).await {
        Ok(db) => db,
        Err(e) => return Err(format!("Database connection failed: {}", e)),
    };

    let backend = db.get_database_backend();
    let schema = Schema::new(backend);

    let queries = vec![
        schema.create_table_from_entity(quickpath::Entity),
        schema.create_table_from_entity(dir_entries::Entity),
        schema.create_table_from_entity(tags::Entity),
    ];

    for query in queries {
        let sql = backend.build(&query).to_string();
        if let Err(_err) = db.execute(Statement::from_string(backend, sql)).await {
            println!("table exists");
        }
    }

    Ok("Database setup successful".to_string())
}

#[tauri::command]
pub async fn get_connection_status() -> Result<String, String> {
    dotenv().ok();
    let install_dir = get_install_dir();// Get install dir
    let db_path = install_dir.join("db.sqlite"); // Database inside install dir
    let db_url = format!("sqlite:{}?mode=rwc", db_path.display());

    match Database::connect(db_url).await {
        Ok(_) => Ok("connected".to_string()),
        Err(e) =>  Err(e.to_string()),
    }
}

#[tauri::command]
pub async fn create_quickpath(new_quickpath: QuickPathData) -> Result<String, String> {
    dotenv().ok();
    let install_dir = get_install_dir();// Get install dir
    let db_path = install_dir.join("db.sqlite"); // Database inside install dir
    let db_url = format!("sqlite:{}?mode=rwc", db_path.display());

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
    let install_dir = get_install_dir();// Get install dir
    let db_path = install_dir.join("db.sqlite"); // Database inside install dir
    let db_url = format!("sqlite:{}?mode=rwc", db_path.display());
    
    let db: DatabaseConnection = match Database::connect(db_url).await {
        Ok(db) => db,
        Err(e) => return Err(e.to_string()),
    };
    let quickpaths: Vec<QuickPath> = QuickPathTable::Entity::find().all(&db).await.unwrap();
    Ok(quickpaths)
}
