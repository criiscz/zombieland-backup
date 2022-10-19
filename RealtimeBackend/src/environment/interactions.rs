use super::environment::{BulletsState, EnemiesState, PlayersState};

pub async fn run_interactions(players: PlayersState, enemies: EnemiesState, bullets: BulletsState) {
    tokio::join!(
        enemies_bullets_interactions(bullets, enemies.clone()),
        enemies_players_interactions(players, enemies.clone())
    );
}

/// [Core Function]
/// One of the core functions, checks if an enemy and a bullet are in the same place
/// and remove them from their respective entities list
/// This will block the enemies and bullets Arcs (BulletsState and EnemiesState) for a time!
async fn enemies_bullets_interactions(bullets: BulletsState, enemies: EnemiesState) {
    match tokio::join!((*bullets).lock(), (*enemies).lock()) {
        (mut bullets_lock, mut enemies_lock) => {
            let mut entities_to_remove: Vec<(usize, usize)> = Vec::new();
            bullets_lock
                .iter_mut()
                .enumerate()
                .for_each(|(bullet_index, bullet)| {
                    enemies_lock
                        .iter_mut()
                        .enumerate()
                        .for_each(|(enemy_index, enemy)| {
                            if enemy.position_y == bullet.position_y
                                && enemy.position_x == bullet.position_x
                            {
                                entities_to_remove.push((bullet_index, enemy_index));
                            }
                        });
                });
            entities_to_remove
                .into_iter()
                .for_each(|(bullet_index, enemy_index)| {
                    bullets_lock.remove(bullet_index);
                    enemies_lock.remove(enemy_index);
                });
        }
    }
}

/// [Core Function]
/// Checks if an enemy has hit a player and reduce the player health, then if the player health is 0,
/// he will be removed from the current players.
async fn enemies_players_interactions(players: PlayersState, enemies: EnemiesState) {
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
