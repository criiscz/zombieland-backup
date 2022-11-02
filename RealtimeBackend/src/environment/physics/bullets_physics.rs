use crate::domain::state_types::BulletsState;

pub async fn bullets_movement(bullets: BulletsState) {
    // Todo[Bullet physics]
    bullets.lock().await.retain_mut(|bullet| {
        if bullet.position_x < 1000.0 && bullet.position_y < 1000.0 {
            bullet.position_x = bullet.position_x + 1.0;
            bullet.position_y = bullet.position_y + 1.0;
            return true;
        }
        return false;
    });
}
