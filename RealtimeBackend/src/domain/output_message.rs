use serde::{Deserialize, Serialize};

use super::{attack::Bullet, enemy::Enemy, player::Player};

#[derive(Serialize, Deserialize)]
pub struct OutputMessage {
    pub players: Vec<Player>,
    pub enemies: Vec<Enemy>,
    pub bullets: Vec<Bullet>,
}
