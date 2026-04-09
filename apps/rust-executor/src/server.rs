use std::sync::Arc;

use axum::{
    extract::State,
    routing::{get, post},
    Json, Router,
};
use base64::Engine;
use serde::{Deserialize, Serialize};

use crate::{crypto, state::AppState};

pub fn router(state: Arc<AppState>) -> Router {
    Router::new()
        .route("/health", get(health))
        .route("/execute", post(execute))
        .route("/execute/wasm/validate", post(validate_wasm))
        .with_state(state)
}

#[derive(Serialize)]
struct HealthResponse {
    ok: bool,
    service: String,
    wasm: String,
    mongo_db: String,
    redis_configured: bool,
}

async fn health(State(state): State<Arc<AppState>>) -> Json<HealthResponse> {
    Json(HealthResponse {
        ok: true,
        service: state.config.service_name.clone(),
        wasm: state.wasm_runtime.readiness().to_string(),
        mongo_db: state.db.mongo.name().to_string(),
        redis_configured: true,
    })
}

#[derive(Debug, Deserialize)]
struct ExecuteRequest {
    task: String,
    payload: serde_json::Value,
}

#[derive(Serialize)]
struct ExecuteResponse {
    ok: bool,
    task: String,
    payload_hash: String,
    execution_id: String,
    signature: String,
}

async fn execute(
    State(state): State<Arc<AppState>>,
    Json(request): Json<ExecuteRequest>,
) -> Json<ExecuteResponse> {
    let payload_string = request.payload.to_string();
    let payload_hash = crypto::sha256_hex(&payload_string);
    let execution_id = crypto::random_token(8);
    let signature = crypto::hmac_sha256_base64(&state.config.crypto_hmac_secret, &payload_string);

    Json(ExecuteResponse {
        ok: true,
        task: request.task,
        payload_hash,
        execution_id,
        signature,
    })
}

#[derive(Debug, Deserialize)]
struct ValidateWasmRequest {
    #[serde(default)]
    wasm_base64: String,
}

#[derive(Serialize)]
struct ValidateWasmResponse {
    ok: bool,
    valid: bool,
    message: String,
}

async fn validate_wasm(
    State(state): State<Arc<AppState>>,
    Json(request): Json<ValidateWasmRequest>,
) -> Json<ValidateWasmResponse> {
    let bytes = match base64::engine::general_purpose::STANDARD.decode(request.wasm_base64) {
        Ok(bytes) => bytes,
        Err(err) => {
            return Json(ValidateWasmResponse {
                ok: false,
                valid: false,
                message: format!("invalid base64: {err}"),
            })
        }
    };

    match state.wasm_runtime.validate_module(&bytes) {
        Ok(()) => Json(ValidateWasmResponse {
            ok: true,
            valid: true,
            message: "WASM module is valid and executable-ready".to_string(),
        }),
        Err(err) => Json(ValidateWasmResponse {
            ok: false,
            valid: false,
            message: err,
        }),
    }
}
