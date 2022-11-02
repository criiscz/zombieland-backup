use crate::domain::state_types::BulletsState;
use async_trait::async_trait;

use super::physic::Physic;

pub struct BulletsPhysics {
    bullets: BulletsState,
}

impl BulletsPhysics {
    pub fn new(bullets: BulletsState) -> BulletsPhysics {
        BulletsPhysics { bullets }
    }
}

#[async_trait]
impl Physic for BulletsPhysics {
    async fn run(&self) {
        self.bullets.lock().await.retain_mut(|bullet| {
            if bullet.position_x < 1000.0 && bullet.position_y < 1000.0 {
                bullet.position_x = bullet.position_x + 1.0;
                bullet.position_y = bullet.position_y + 1.0;
                return true;
            }
            return false;
        });
    }
}
