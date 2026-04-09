use wasmtime::{Engine, Module};

#[derive(Clone)]
pub struct WasmRuntime {
    engine: Engine,
}

impl WasmRuntime {
    pub fn new() -> Self {
        Self {
            engine: Engine::default(),
        }
    }

    pub fn validate_module(&self, wasm_bytes: &[u8]) -> Result<(), String> {
        Module::from_binary(&self.engine, wasm_bytes)
            .map(|_| ())
            .map_err(|err| format!("invalid wasm module: {err}"))
    }

    pub fn readiness(&self) -> &'static str {
        "ready"
    }
}
