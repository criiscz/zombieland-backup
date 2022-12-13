use std::f32::consts::PI;

use crate::domain::state_types::BulletsState;
use async_trait::async_trait;

use super::physic::Physic;

pub struct BulletsPhysics {
    bullets: BulletsState,
}

impl BulletsPhysics {
    pub fn new(bullets: BulletsState) -> Self {
        BulletsPhysics { bullets }
    }
}

#[async_trait]
impl Physic for BulletsPhysics {
    async fn run(&self) {
        self.bullets.lock().await.retain_mut(|bullet| {
            if bullet.position_x < 4100.0
                && bullet.position_y < 4100.0
                && bullet.position_x > -1.0
                && bullet.position_y > -1.0
            {
                let angle_const = bullet.angle * (PI / 180.0);
                bullet.position_x += angle_const.cos() * 10.0;
                bullet.position_y += angle_const.sin() * 10.0;
                return true;
            }
            return false;
        });
    }
}
