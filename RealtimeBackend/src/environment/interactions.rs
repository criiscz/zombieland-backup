mod bullets_damage_enemies;
mod enemies_damage_players;
mod interaction;

use self::bullets_damage_enemies::DamageToEnemiesByBullets;
use crate::{
    domain::state_types::{BulletsState, EnemiesState, PlayersState},
    environment::interactions::{
        enemies_damage_players::DamageToPlayersByEnemies, interaction::Interaction,
    },
};
use futures_util::{future::join_all, stream::FuturesUnordered};

pub struct InteractionsModule {
    interactions: Vec<Box<dyn Interaction + Sync + Send>>,
}

impl InteractionsModule {
    pub fn new(players: PlayersState, enemies: EnemiesState, bullets: BulletsState) -> Self {
        InteractionsModule {
            interactions: vec![
                Box::new(DamageToPlayersByEnemies::new(players, enemies.clone())),
                Box::new(DamageToEnemiesByBullets::new(enemies, bullets)),
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
