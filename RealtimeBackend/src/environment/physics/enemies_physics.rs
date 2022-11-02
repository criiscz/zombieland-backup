use crate::domain::state_types::{EnemiesState, PlayersState};
use async_trait::async_trait;

use super::physic::Physic;

pub struct EnemiesPhysics {
    enemies: EnemiesState,
    players: PlayersState,
}

impl EnemiesPhysics {
    pub fn new(enemies: EnemiesState, players: PlayersState) -> EnemiesPhysics {
        EnemiesPhysics { enemies, players }
    }
}

#[async_trait]
impl Physic for EnemiesPhysics {
    async fn run(&self) {
        // Todo[Enemies physics]
        self.enemies.lock().await.iter_mut().for_each(|enemy| {
            enemy.position_x = enemy.position_x - 1.0;
            enemy.position_y = enemy.position_y - 1.0;
        });
    }
}
