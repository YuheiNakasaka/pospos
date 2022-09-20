use tauri::Manager;

#[tauri::command]
pub async fn title_updater(app_handle: tauri::AppHandle, title: String) {
    let win = app_handle.get_window("main").unwrap();
    win.set_title(title.as_str()).unwrap();
}