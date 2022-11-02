mod bullets_physics;
mod enemies_physics;

use crate::{
    domain::state_types::{BulletsState, EnemiesState, PlayersState},
    environment::physics::{bullets_physics::bullets_movement, enemies_physics::enemies_movement},
};

pub async fn run_physics(players: PlayersState, enemies: EnemiesState, bullets: BulletsState) {
    tokio::join!(
        bullets_movement(bullets.clone()),
        enemies_movement(enemies.clone(), players.clone())
    );
}
