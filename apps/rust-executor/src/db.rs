use mongodb::{options::ClientOptions, Client, Database};
use redis::Client as RedisClient;

use crate::{config::AppConfig, error::AppError};

#[derive(Clone)]
pub struct DbClients {
    pub mongo: Database,
    pub redis: RedisClient,
}

impl DbClients {
    pub async fn connect(config: &AppConfig) -> Result<Self, AppError> {
        let mut mongo_options = ClientOptions::parse(&config.mongodb_url).await?;
        mongo_options.app_name = Some(config.service_name.clone());
        let mongo_client = Client::with_options(mongo_options)?;
        let db = mongo_client.database(&config.mongodb_database);

        let redis = RedisClient::open(config.redis_url.clone())?;

        Ok(Self { mongo: db, redis })
    }
}
