mod bullets_damage_enemies;
mod enemies_damage_players;
mod interaction;

use self::bullets_damage_enemies::DamageToEnemiesByBullets;
use crate::{
    domain::state_types::GameState,
    environment::interactions::{
        enemies_damage_players::DamageToPlayersByEnemies, interaction::Interaction,
    },
};
use futures_util::{future::join_all, stream::FuturesUnordered};

pub struct InteractionsModule {
    interactions: Vec<Box<dyn Interaction + Sync + Send>>,
}

impl InteractionsModule {
    pub fn new(game_state: GameState) -> Self {
        InteractionsModule {
            interactions: vec![
                Box::new(DamageToPlayersByEnemies::new(
                    game_state.players,
                    game_state.enemies.clone(),
                )),
                Box::new(DamageToEnemiesByBullets::new(
                    game_state.enemies,
                    game_state.bullets,
                )),
            ],
        }
    }

    pub async fn run(&self) {
        let tasks = self
            .interactions
            .iter()
            .map(|interaction| interaction.run())
            .collect::<FuturesUnordered<_>>();
        join_all(tasks).await;
    }
}
