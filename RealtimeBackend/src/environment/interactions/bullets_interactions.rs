use crate::domain::state_types::{BulletsState, EnemiesState};

/// [Core Function]
/// One of the core functions, checks if an enemy and a bullet are in the same place
/// and remove them from their respective entities list
/// This will block the enemies and bullets Arcs (BulletsState and EnemiesState) for a time!
pub async fn enemies_bullets_interactions(bullets: BulletsState, enemies: EnemiesState) {
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
