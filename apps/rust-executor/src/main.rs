mod config;
mod crypto;
mod db;
mod error;
mod server;
mod state;
mod wasm_runtime;

use std::{net::SocketAddr, sync::Arc};

use axum::serve;
use tokio::net::TcpListener;
use tracing::info;

use crate::{config::AppConfig, db::DbClients, state::AppState};

#[tokio::main]
async fn main() -> Result<(), error::AppError> {
    dotenvy::dotenv().ok();
    init_tracing();

    let config = AppConfig::from_env();
    let clients = DbClients::connect(&config).await?;
    let wasm_runtime = wasm_runtime::WasmRuntime::new();

    let state = Arc::new(AppState {
        config: config.clone(),
        db: clients,
        wasm_runtime,
    });

    let app = server::router(state);
    let addr = SocketAddr::from(([0, 0, 0, 0], config.port));
    let listener = TcpListener::bind(addr).await?;

    info!("rust-executor listening on {}", addr);
    serve(listener, app).await?;
    Ok(())
}

fn init_tracing() {
    tracing_subscriber::fmt()
        .with_env_filter(
            std::env::var("RUST_LOG").unwrap_or_else(|_| "rust_executor=debug,axum=info".to_string()),
        )
        .compact()
        .init();
}
