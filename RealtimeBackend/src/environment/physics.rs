use super::environment::{BulletsState, EnemiesState, PlayersState};

pub async fn run_physics(players: PlayersState, enemies: EnemiesState, bullets: BulletsState) {
    tokio::join!(
        bullets_movement(bullets.clone()),
        enemies_movement(enemies.clone(), players.clone())
    );
}

async fn bullets_movement(bullets: BulletsState) {
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

async fn enemies_movement(enemies: EnemiesState, _players: PlayersState) {
    // Todo[Enemies physics]
    enemies.lock().await.iter_mut().for_each(|enemy| {
        enemy.position_x = enemy.position_x - 1.0;
        enemy.position_y = enemy.position_y - 1.0;
    });
}
