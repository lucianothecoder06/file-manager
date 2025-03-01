mod commands;
mod quickpath_commands;
use std::env;
use tauri_plugin_sql::{Migration, MigrationKind};
use dotenv::dotenv;


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    dotenv().ok(); 
    let db_url: String ="sqlite:db.sqlite?mode=rwc".to_string();
    let migrations = vec![
        // Define your migrations here
        Migration {
            version: 1,
            description: "create_initial_tables",
            sql: "
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
            kind: MigrationKind::Up,
        },
    ];

    tauri::Builder::default()
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            // Block on the async migration task so that migrations finish before continuing.
            Ok(())
        })
        .plugin(tauri_plugin_fs::init())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations(&db_url, migrations)
                .build(),
        )
        .invoke_handler(tauri::generate_handler![
            commands::get_home,
            commands::search,
            commands::get_custom_dir,
            commands::get_home_path,
            commands::get_download_path,
            commands::get_document_path,
            commands::delete_file,
            commands::delete_dir,
            quickpath_commands::create_quickpath,
            quickpath_commands::get_quickpaths,
            quickpath_commands::get_connection_status,
            quickpath_commands::setup_database,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
