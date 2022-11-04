mod bullets_physics;
mod enemies_physics;
mod physic;
mod test;

use self::{bullets_physics::BulletsPhysics, enemies_physics::EnemiesPhysics, physic::Physic};
use crate::domain::state_types::GameState;
use futures_util::{future::join_all, stream::FuturesUnordered};

pub struct PhysicsModule {
    physics: Vec<Box<dyn Physic + Sync + Send>>,
}

impl PhysicsModule {
    pub fn new(game_state: GameState) -> Self {
        let physics: Vec<Box<dyn Physic + Sync + Send>> = vec![
            Box::new(BulletsPhysics::new(game_state.bullets)),
            Box::new(EnemiesPhysics::new(game_state.enemies, game_state.players)),
        ];
        PhysicsModule { physics }
    }

    pub async fn run(&self) {
        let tasks = self
            .physics
            .iter()
            .map(|physic| physic.run())
            .collect::<FuturesUnordered<_>>();
        join_all(tasks).await;
    }
}
