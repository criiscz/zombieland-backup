use crate::domain::{
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

    pub async fn run_interaction(&self, enemy: &Enemy) {
        self.bullets.lock().await.retain_mut(|bullet| {
            if enemy.position_y == bullet.position_y && enemy.position_x == bullet.position_x {
                return false;
            }
            return true;
        });
    }
}

#[async_trait]
impl Interaction for DamageToEnemiesByBullets {
    async fn run(&self) {
        for enemy in self.enemies.lock().await.iter() {
            Self::run_interaction(&self, enemy).await;
        }
    }
}
