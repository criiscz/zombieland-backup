use async_trait::async_trait;

#[async_trait]
pub trait Spawn {
    async fn run(&self);
    async fn spawn_enemies(&self, amount: usize);
}
