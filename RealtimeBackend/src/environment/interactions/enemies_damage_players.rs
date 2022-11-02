use crate::domain::state_types::{EnemiesState, PlayersState};
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
}

#[async_trait]
impl Interaction for DamageToPlayersByEnemies {
    async fn run(&self) {
        match tokio::join!((*self.players).lock(), (*self.enemies).lock()) {
            (mut players_lock, enemies_lock) => {
                let mut players_to_remove: Vec<usize> = Vec::new();
                players_lock
                    .iter_mut()
                    .enumerate()
                    .for_each(|(player_index, player)| {
                        enemies_lock.iter().for_each(|enemy| {
                            if enemy.position_y == player.position_y
                                && enemy.position_x == player.position_x
                            {
                                player.health = player.health - 1;
                                if player.health == 0 {
                                    players_to_remove.push(player_index);
                                }
                            }
                        });
                    });
                players_to_remove.into_iter().for_each(|index| {
                    players_lock.remove(index);
                });
            }
        };
    }
}
