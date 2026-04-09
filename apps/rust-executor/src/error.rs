use thiserror::Error;

#[derive(Debug, Error)]
pub enum AppError {
    #[error("io error: {0}")]
    Io(#[from] std::io::Error),

    #[error("mongodb error: {0}")]
    Mongo(#[from] mongodb::error::Error),

    #[error("redis error: {0}")]
    Redis(#[from] redis::RedisError),

}
