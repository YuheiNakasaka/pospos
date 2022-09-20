#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use pospos::handler::*;
use pospos::TauriSql;

fn main() {
    tauri::Builder::default()
        .plugin(TauriSql::default())
        .invoke_handler(tauri::generate_handler![title_updater])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
