use std::sync::Arc;

use tokio::sync::Mutex;

use super::{attack::Bullet, enemy::Enemy, player::Player};

pub type PlayersState = Arc<Mutex<Vec<Player>>>;
pub type EnemiesState = Arc<Mutex<Vec<Enemy>>>;
pub type BulletsState = Arc<Mutex<Vec<Bullet>>>;

#[derive(Clone)]
pub struct GameState {
    pub players: PlayersState,
    pub enemies: EnemiesState,
    pub bullets: BulletsState,
}
