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

    async fn get_spawn_amount(&self) -> u8 {
        let enemies_amount = self.enemies.lock().await.len();
        let players_amount = self.players.lock().await.len();
        let spawn_amount = players_amount * 3 - enemies_amount;
        spawn_amount as u8
    }
}

#[async_trait]
impl Spawn for EnemiesSpawns {
    async fn run(&self) {
        let should_spawn = self.get_spawn_amount().await;
        if should_spawn > 0 {
            self.spawn_enemies(should_spawn).await;
        }
    }

    async fn spawn_enemies(&self, amount: u8) {
        for _ in 0..amount {
            self.enemies.lock().await.push(Enemy::new())
        }
    }
}
