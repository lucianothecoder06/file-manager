mod commands;
mod quickpath_commands;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::get_home,
            commands::get_custom_dir,
            commands::get_home_path,
            commands::get_download_path,
            commands::get_document_path,
            quickpath_commands::create_quickpath,
            quickpath_commands::get_quickpaths,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
