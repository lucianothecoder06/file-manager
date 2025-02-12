use std::{fs, path::PathBuf};


#[tauri::command]
pub async fn get_download_dirs() -> Result<Vec<PathBuf>, String> {
    let paths: fs::ReadDir = match fs::read_dir("C:\\") {
        Ok(paths) => paths,
        Err(e) => return Err(format!("Failed to read directory: {}", e)),
    };
    let mut goodpaths: Vec<PathBuf> = Vec::new();
    for path in paths.flatten() {
        println!("Name: {}", path.path().display());
        goodpaths.push(path.path());
    }

    Ok(goodpaths)
}
