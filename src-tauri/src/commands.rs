use dirs::home_dir;
use std::{fs, path::PathBuf, time::SystemTime};
// use std::fs::File;
#[derive(serde::Serialize)]
pub struct DirInfo {
    name: String,
    path: PathBuf,
    is_dir: bool,
    last_accessed: SystemTime,
}

#[tauri::command]
pub async fn get_download_dirs() -> Result<Vec<PathBuf>, String> {
    let paths: fs::ReadDir = match fs::read_dir("C:\\") {
        Ok(paths) => paths,
        Err(e) => return Err(format!("Failed to read directory: {}", e)),
    };
    let mut goodpaths: Vec<PathBuf> = Vec::new();
    for path in paths.flatten() {
        println!("Name: {:?}", path);
        goodpaths.push(path.path());
    }

    Ok(goodpaths)
}
#[tauri::command]
pub async fn get_home() -> Result<Vec<DirInfo>, String> {
    let home_path: PathBuf = match home_dir() {
        Some(home_path) => home_path,
        None => return Err("Failed to load directory:".to_string()),
    };
    let paths: fs::ReadDir = match fs::read_dir(home_path) {
        Ok(paths) => paths,
        Err(e) => return Err(format!("Failed to read directory: {}", e)),
    };
    let mut goodpaths: Vec<DirInfo> = Vec::new();
    for path in paths.flatten() {
        println!("Name: {:?}", path);

        let accessed: SystemTime = match path.metadata().unwrap().accessed() {
            Ok(last_accessed) => last_accessed,
            Err(_) => SystemTime::now(),
        };

        goodpaths.push(DirInfo {
            name: path.file_name().to_string_lossy().into_owned(),
            path: path.path(),
            is_dir: path.metadata().unwrap().is_dir(),
            last_accessed: accessed,
        });
        //
    }

    Ok(goodpaths)
}

#[tauri::command]
pub async fn get_home_path() -> Result<PathBuf, String> {
    let home_path: PathBuf = match home_dir() {
        Some(home_path) => home_path,
        None => return Err("Failed to load directory:".to_string()),
    };
    Ok(home_path)
}

#[tauri::command]
pub async fn get_custom_dir(custom_path: String) -> Result<Vec<DirInfo>, String> {
    let paths: fs::ReadDir = match fs::read_dir(custom_path) {
        Ok(paths) => paths,
        Err(e) => return Err(format!("Failed to read directory: {}", e)),
    };
    let mut goodpaths: Vec<DirInfo> = Vec::new();
    for path in paths.flatten() {
        println!("Name: {:?}", path);
        let accessed: SystemTime = match path.metadata().unwrap().accessed() {
            Ok(last_accessed) => last_accessed,
            Err(_) => SystemTime::now(),
        };
        goodpaths.push(DirInfo {
            name: path.file_name().to_string_lossy().into_owned(),
            path: path.path(),
            is_dir: path.metadata().unwrap().is_dir(),
            last_accessed: accessed,
        });
    }
    Ok(goodpaths)
}

// #[tauri::command]
// async fn open_file() -> Result<(), String> {
//   Ok(())
// }
