use async_trait::async_trait;

#[async_trait]
pub trait Interaction {
    async fn run(&self);
}
