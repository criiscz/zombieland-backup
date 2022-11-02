mod bullets_physics;
mod enemies_physics;
mod physic;

use self::{bullets_physics::BulletsPhysics, enemies_physics::EnemiesPhysics, physic::Physic};
use crate::domain::state_types::{BulletsState, EnemiesState, PlayersState};
use futures_util::{future::join_all, stream::FuturesUnordered};

pub struct PhysicsModule {
    physics: Vec<Box<dyn Physic + Sync + Send>>,
}

impl PhysicsModule {
    pub fn new(players: PlayersState, enemies: EnemiesState, bullets: BulletsState) -> Self {
        let physics: Vec<Box<dyn Physic + Sync + Send>> = vec![
            Box::new(BulletsPhysics::new(bullets)),
            Box::new(EnemiesPhysics::new(enemies, players)),
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
