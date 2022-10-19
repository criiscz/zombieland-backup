use std::{sync::Arc, time::Duration};
use tokio::{sync::Mutex, time::sleep};

use crate::domain::{attack::Bullet, enemy::Enemy, player::Player};

use super::{interactions::run_interactions, physics::run_physics};

pub type PlayersState = Arc<Mutex<Vec<Player>>>;
pub type EnemiesState = Arc<Mutex<Vec<Enemy>>>;
pub type BulletsState = Arc<Mutex<Vec<Bullet>>>;

pub struct Environment {
    players: PlayersState,
    enemies: EnemiesState,
    attacks: BulletsState,
}

impl Environment {
    pub fn new() -> Environment {
        Environment {
            players: Arc::new(Mutex::new(Vec::new())),
            enemies: Arc::new(Mutex::new(Vec::new())),
            attacks: Arc::new(Mutex::new(Vec::new())),
        }
    }

    pub fn get_attacks_state(&self) -> BulletsState {
        self.attacks.clone()
    }

    pub fn get_players_state(&self) -> PlayersState {
        self.players.clone()
    }

    pub fn start(&self) {
        let bullets = Arc::clone(&self.attacks);
        let players = Arc::clone(&self.players);
        let enemies = Arc::clone(&self.enemies);

        tokio::spawn(async move {
            loop {
                sleep(Duration::from_millis(10)).await;
                run_interactions(players.clone(), enemies.clone(), bullets.clone()).await;
                run_physics(players.clone(), enemies.clone(), bullets.clone()).await;
            }
        });
    }
}
