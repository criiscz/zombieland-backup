use crate::domain::state_types::{EnemiesState, PlayersState};

/// [Core Function]
/// Checks if an enemy has hit a player and reduce the player health, then if the player health is 0,
/// he will be removed from the current players.
pub async fn enemies_players_interactions(players: PlayersState, enemies: EnemiesState) {
    match tokio::join!((*players).lock(), (*enemies).lock()) {
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
