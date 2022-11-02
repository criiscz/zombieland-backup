use redis::{Commands, Connection};
use std::{env, sync::Arc, time::Duration};
use tokio::{sync::Mutex, time::sleep};

use super::{interactions::run_interactions, physics::run_physics};
use crate::domain::{
    output_message::OutputMessage,
    state_types::{BulletsState, EnemiesState, PlayersState},
};

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
        let cache_address = env::var("CACHE_ADDRESS").unwrap_or("127.0.0.1:6379".to_string());
        let events_channel = redis::Client::open(String::from("redis://") + &cache_address)
            .unwrap()
            .get_connection()
            .expect(
                "Can't find an active connection to Pub/Sub channel, is the DragonglyDB running?",
            );

        tokio::spawn(
            async move { Environment::game_loop(bullets, enemies, players, events_channel) },
        );
    }

    async fn game_loop(
        bullets: BulletsState,
        enemies: EnemiesState,
        players: PlayersState,
        mut events_channel: Connection,
    ) {
        loop {
            sleep(Duration::from_millis(10)).await;
            run_interactions(players.clone(), enemies.clone(), bullets.clone()).await;
            run_physics(players.clone(), enemies.clone(), bullets.clone()).await;

            let output_message = OutputMessage {
                players: players.lock().await.clone(),
                bullets: bullets.lock().await.clone(),
                enemies: enemies.lock().await.clone(),
            };
            events_channel
                .publish::<String, String, bool>(
                    "zombieland_channel".to_owned(),
                    serde_json::to_string(&output_message).unwrap(),
                )
                .unwrap();
        }
    }
}
