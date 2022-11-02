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

pub async fn run_interactions(players: PlayersState, enemies: EnemiesState, bullets: BulletsState) {
    let interactions: Vec<Box<dyn Interaction + Sync + Send>> = vec![
        Box::new(DamageToPlayersByEnemies::new(players, enemies.clone())),
        Box::new(DamageToEnemiesByBullets::new(enemies, bullets)),
    ];

    let tasks = interactions
        .into_iter()
        .map(|interaction| tokio::spawn(async move { interaction.run().await }))
        .collect::<FuturesUnordered<_>>();
    join_all(tasks).await;
}
