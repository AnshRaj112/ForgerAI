use crate::{config::AppConfig, db::DbClients, wasm_runtime::WasmRuntime};

#[derive(Clone)]
pub struct AppState {
    pub config: AppConfig,
    pub db: DbClients,
    pub wasm_runtime: WasmRuntime,
}
