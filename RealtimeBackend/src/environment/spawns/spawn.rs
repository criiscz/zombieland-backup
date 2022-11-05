use async_trait::async_trait;

#[async_trait]
pub trait Spawn {
    async fn run(&self);
}
