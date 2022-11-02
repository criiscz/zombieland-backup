mod bullets_interactions;
mod players_interactions;

use crate::{
    domain::state_types::{BulletsState, EnemiesState, PlayersState},
    environment::interactions::{
        bullets_interactions::enemies_bullets_interactions,
        players_interactions::enemies_players_interactions,
    },
};

pub async fn run_interactions(players: PlayersState, enemies: EnemiesState, bullets: BulletsState) {
    tokio::join!(
        enemies_bullets_interactions(bullets, enemies.clone()),
        enemies_players_interactions(players, enemies.clone())
    );
}
