#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use pospos::TauriSql;
use tauri::Manager;

#[tauri::command]
async fn title_updater(app_handle: tauri::AppHandle, title: String) {
    let win = app_handle.get_window("main").unwrap();
    win.set_title(title.as_str()).unwrap();
}

fn main() {
    tauri::Builder::default()
        .plugin(TauriSql::default())
        .invoke_handler(tauri::generate_handler![title_updater])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
