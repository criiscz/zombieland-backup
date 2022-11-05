use async_trait::async_trait;
#[async_trait]
pub trait Physic {
    async fn run(&self);
}
