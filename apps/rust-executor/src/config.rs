#[derive(Debug, Clone)]
pub struct AppConfig {
    pub service_name: String,
    pub port: u16,
    pub mongodb_url: String,
    pub mongodb_database: String,
    pub redis_url: String,
    pub crypto_hmac_secret: String,
}

impl AppConfig {
    pub fn from_env() -> Self {
        Self {
            service_name: env_or("SERVICE_NAME", "rust-executor"),
            port: env_or("PORT", "4003").parse::<u16>().unwrap_or(4003),
            mongodb_url: env_or("FORGE_DATABASE_URL", "mongodb://localhost:27017"),
            mongodb_database: env_or("FORGE_DATABASE_NAME", "forgeai"),
            redis_url: env_or("FORGE_REDIS_URL", "redis://localhost:6379"),
            crypto_hmac_secret: env_or("FORGE_CRYPTO_HMAC_SECRET", "dev-secret"),
        }
    }
}

fn env_or(key: &str, fallback: &str) -> String {
    std::env::var(key).unwrap_or_else(|_| fallback.to_string())
}
