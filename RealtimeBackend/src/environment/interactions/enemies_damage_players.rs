use crate::domain::{
    enemy::Enemy,
    player::Player,
    state_types::{EnemiesState, PlayersState},
};
use async_trait::async_trait;

use super::interaction::Interaction;

pub struct DamageToPlayersByEnemies {
    players: PlayersState,
    enemies: EnemiesState,
}

impl DamageToPlayersByEnemies {
    pub fn new(players: PlayersState, enemies: EnemiesState) -> DamageToPlayersByEnemies {
        DamageToPlayersByEnemies { players, enemies }
    }

    pub async fn run_interaction(&self, enemies: Vec<Enemy>, mut players: Vec<Player>) {
        enemies.iter().for_each(|enemy| {
            players.retain_mut(|player| {
                if enemy.position_y == player.position_y && enemy.position_x == player.position_x {
                    player.health = player.health - 1;
                    if player.health == 0 {
                        return false;
                    }
                }
                return true;
            });
        });
    }
}

#[async_trait]
impl Interaction for DamageToPlayersByEnemies {
    async fn run(&self) {
        match tokio::join!(self.enemies.lock(), self.players.lock()) {
            (enemies, players) => {
                self.run_interaction(enemies.to_owned(), players.to_owned())
                    .await;
            }
        }
    }
}
