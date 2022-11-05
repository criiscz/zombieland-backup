use async_trait::async_trait;

use crate::domain::{
    enemy::Enemy,
    state_types::{EnemiesState, PlayersState},
};

use super::spawn::Spawn;

pub struct EnemiesSpawns {
    enemies: EnemiesState,
    players: PlayersState,
}

impl EnemiesSpawns {
    pub fn new(enemies: EnemiesState, players: PlayersState) -> Self {
        EnemiesSpawns { enemies, players }
    }
}

#[async_trait]
impl Spawn for EnemiesSpawns {
    async fn run(&self) {
        match tokio::join!(self.enemies.lock(), self.players.lock()) {
            (mut enemies, players) => {
                let amount = players.len() - enemies.len();
                if amount > 0 {
                    enemies.push(Enemy::new());
                }
            }
        };
    }
}
