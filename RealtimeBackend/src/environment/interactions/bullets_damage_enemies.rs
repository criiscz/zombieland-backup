use crate::domain::{
    attack::Bullet,
    enemy::Enemy,
    state_types::{BulletsState, EnemiesState},
};
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

    pub async fn run_interaction(&self, enemies: Vec<Enemy>, mut bullets: Vec<Bullet>) {
        enemies.iter().for_each(|enemy| {
            bullets.retain_mut(|bullet| {
                if enemy.position_y == bullet.position_y && enemy.position_x == bullet.position_x {
                    return false;
                }
                return true;
            })
        });
    }
}

#[async_trait]
impl Interaction for DamageToEnemiesByBullets {
    async fn run(&self) {
        match tokio::join!(self.enemies.lock(), self.bullets.lock()) {
            (enemies, bullets) => {
                self.run_interaction(enemies.to_owned(), bullets.to_owned())
                    .await;
            }
        };
    }
}
