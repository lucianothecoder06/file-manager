use dirs::{document_dir, download_dir, home_dir};
use std::path::Path;
use std::{fs, path::PathBuf, time::SystemTime};
// use std::fs::File;
use walkdir::WalkDir;

#[derive(serde::Serialize)]
pub struct DirInfo {
    name: String,
    path: PathBuf,
    is_dir: bool,
    last_accessed: SystemTime,
    file_type: Option<String>,
    size: u64,
}

#[tauri::command]
pub async fn search(custom_path: String, search_query: String) -> Result<Vec<DirInfo>, String> {
    // let paths: fs::ReadDir = match fs::read_dir(custom_path) {
    //     Ok(paths) => paths,
    //     Err(e) => return Err(format!("Failed to read directory: {}", e)),
    // };
    let mut goodpaths: Vec<DirInfo> = Vec::new();
    println!("search {} on path {}", search_query, custom_path);

    for entry in WalkDir::new(custom_path).into_iter() {
        let entry = match entry {
            Ok(entry) => entry,
            Err(e) => return Err(format!("Failed to read directory entry: {}", e)),
        };

        let name = entry.file_name().to_string_lossy().into_owned();
        if name
            .to_ascii_lowercase()
            .contains(&search_query.to_ascii_lowercase())
        {
            let path = entry.path();
            let accessed: SystemTime = match entry.metadata() {
                Ok(metadata) => match metadata.accessed() {
                    Ok(last_accessed) => last_accessed,
                    Err(_) => SystemTime::now(),
                },
                Err(_) => SystemTime::now(),
            };

            let file_type = path
                .extension()
                .map(|ext| ext.to_string_lossy().into_owned());

            goodpaths.push(DirInfo {
                name: entry.file_name().to_string_lossy().into_owned(),
                path: path.to_path_buf(),
                is_dir: entry.file_type().is_dir(),
                last_accessed: accessed,
                file_type,
                size: entry.metadata().map(|m| m.len()).unwrap_or(0),
            });
        }
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
        // println!("Name: {:?}", path);

        let accessed: SystemTime = match path.metadata().unwrap().accessed() {
            Ok(last_accessed) => last_accessed,
            Err(_) => SystemTime::now(),
        };

        let file_type = Path::new(&path.file_name())
            .extension()
            .map(|ext| ext.to_string_lossy().into_owned());

        // print!("{:?}", typ);
        goodpaths.push(DirInfo {
            name: path.file_name().to_string_lossy().into_owned(),
            path: path.path(),
            is_dir: path.metadata().unwrap().is_dir(),
            last_accessed: accessed,
            file_type,
            size: path.metadata().unwrap().len(),
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
pub async fn get_download_path() -> Result<PathBuf, String> {
    let home_path: PathBuf = match download_dir() {
        Some(home_path) => home_path,
        None => return Err("Failed to load directory:".to_string()),
    };
    Ok(home_path)
}

#[tauri::command]
pub async fn get_document_path() -> Result<PathBuf, String> {
    let home_path: PathBuf = match document_dir() {
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
        // println!("Name: {:?}", path);
        let accessed: SystemTime = match path.metadata().unwrap().accessed() {
            Ok(last_accessed) => last_accessed,
            Err(_) => SystemTime::now(),
        };
        let file_type = Path::new(&path.file_name())
            .extension()
            .map(|ext| ext.to_string_lossy().into_owned());

        // print!("{:?}", typ);
        goodpaths.push(DirInfo {
            name: path.file_name().to_string_lossy().into_owned(),
            path: path.path(),
            is_dir: path.metadata().unwrap().is_dir(),
            last_accessed: accessed,
            file_type,
            size: path.metadata().unwrap().len(),
        });
    }
    Ok(goodpaths)
}

// #[tauri::command]
// async fn open_file() -> Result<(), String> {
//   Ok(())
// }
#[tauri::command]
pub async fn delete_file(custom_path: String) -> Result<String, String> {
    match fs::remove_file(custom_path) {
        Ok(_) => Ok("File deleted".to_string()),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
pub async fn delete_dir(custom_path: String) -> Result<String, String> {
    match fs::remove_dir_all(custom_path) {
        Ok(_) => Ok("Folder deleted".to_string()),
        Err(e) => Err(e.to_string()),
    }
}
