use serde::{Deserialize, Serialize};

use super::{attack::Bullet, enemy::Enemy, player::Player, state_types::GameState};

#[derive(Serialize, Deserialize)]
pub struct OutputMessage {
    players: Vec<Player>,
    enemies: Vec<Enemy>,
    bullets: Vec<Bullet>,
}

impl OutputMessage {
    pub async fn from(game_state: GameState) -> Self {
        OutputMessage {
            players: game_state.players.lock().await.to_owned(),
            enemies: game_state.enemies.lock().await.to_owned(),
            bullets: game_state.bullets.lock().await.to_owned(),
        }
    }
}
