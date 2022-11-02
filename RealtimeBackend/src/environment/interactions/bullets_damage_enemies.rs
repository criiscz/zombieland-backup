use crate::domain::state_types::{BulletsState, EnemiesState};
use async_trait::async_trait;

use super::interaction::Interaction;

pub struct DamageToEnemiesByBullets {
    bullets: BulletsState,
    enemies: EnemiesState,
}

impl DamageToEnemiesByBullets {
    pub fn new(enemies: EnemiesState, bullets: BulletsState) -> DamageToEnemiesByBullets {
        DamageToEnemiesByBullets { bullets, enemies }
    }
}

#[async_trait]
impl Interaction for DamageToEnemiesByBullets {
    async fn run(&self) {
        match tokio::join!((*self.bullets).lock(), (*self.enemies).lock()) {
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
}
