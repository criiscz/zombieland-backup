use crate::domain::{
    attack::Bullet,
    enemy::{self, Enemy},
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
}

fn has_collision(enemy: &mut Enemy, bullet: &Bullet) -> bool {
    let space = 50.0;
    let range_x = (enemy.position_x - space)..(enemy.position_x + space);
    let range_y = (enemy.position_y - space)..(enemy.position_y + space);
    if bullet.position_y > range_y.start
        && bullet.position_y < range_y.end
        && bullet.position_x > range_x.start
        && bullet.position_x < range_x.end
    {
        return false;
    }
    return true;
}

#[async_trait]
impl Interaction for DamageToEnemiesByBullets {
    async fn run(&self) {
        match tokio::join!(self.enemies.lock(), self.bullets.lock()) {
            (mut enemies, bullets) => {
                bullets.iter().for_each(|bullet| {
                    enemies.retain_mut(|enemy| return has_collision(enemy, bullet))
                });
            }
        };
    }
}
