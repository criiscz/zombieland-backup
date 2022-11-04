use redis::{Commands, Connection};
use std::{env, sync::Arc, time::Duration};
use tokio::{sync::Mutex, time::sleep};

use super::{interactions::InteractionsModule, physics::PhysicsModule};
use crate::domain::{
    output_message::OutputMessage,
    state_types::{BulletsState, EnemiesState, GameState, PlayersState},
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
        let game_state = GameState {
            bullets: Arc::clone(&self.attacks),
            players: Arc::clone(&self.players),
            enemies: Arc::clone(&self.enemies),
        };

        let cache_address = env::var("CACHE_ADDRESS").unwrap_or("127.0.0.1:6379".to_string());
        let events_channel = redis::Client::open(String::from("redis://") + &cache_address)
            .unwrap()
            .get_connection()
            .expect(
                "Can't find an active connection to Pub/Sub channel, is the DragonglyDB running?",
            );

        tokio::spawn(async move { Environment::game_loop(game_state, events_channel).await });
    }

    async fn game_loop(game_state: GameState, mut events_channel: Connection) {
        loop {
            sleep(Duration::from_millis(10)).await;
            let state = game_state.clone();
            let other_state = game_state.clone();
            _ = tokio::join!(
                tokio::spawn(async move {
                    let interactions = InteractionsModule::new(state.clone());
                    interactions.run().await;
                }),
                tokio::spawn(async move {
                    let physics = PhysicsModule::new(other_state.clone());
                    physics.run().await;
                })
            );

            Environment::send_state_to_channel(game_state.clone(), &mut events_channel).await;
        }
    }

    async fn send_state_to_channel(game_state: GameState, events_channel: &mut Connection) {
        let output_message = OutputMessage::from(game_state.to_owned()).await;
        events_channel
            .publish::<String, String, bool>(
                "zombieland_channel".to_owned(),
                serde_json::to_string(&output_message).unwrap(),
            )
            .unwrap();
    }
}
