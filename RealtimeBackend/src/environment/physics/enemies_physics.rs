use crate::domain::state_types::{EnemiesState, PlayersState};

pub async fn enemies_movement(enemies: EnemiesState, _players: PlayersState) {
    // Todo[Enemies physics]
    enemies.lock().await.iter_mut().for_each(|enemy| {
        enemy.position_x = enemy.position_x - 1.0;
        enemy.position_y = enemy.position_y - 1.0;
    });
}
