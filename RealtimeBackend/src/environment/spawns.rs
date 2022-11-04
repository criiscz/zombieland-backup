use futures_util::stream::FuturesUnordered;

use crate::domain::state_types::GameState;

use self::{enemies_spawns::EnemiesSpawns, spawn::Spawn};

mod enemies_spawns;
mod spawn;

pub struct SpawnsModule {
    spawns: Vec<Box<dyn Spawn + Sync + Send>>,
}

impl SpawnsModule {
    pub fn new(game_state: GameState) -> Self {
        let spawns: Vec<Box<dyn Spawn + Sync + Send>> = vec![Box::new(EnemiesSpawns::new(
            game_state.enemies,
            game_state.players,
        ))];
        SpawnsModule { spawns }
    }

    pub async fn run(&self) {
        let tasks = self
            .spawns
            .iter()
            .map(|spawn| spawn.run())
            .collect::<FuturesUnordered<_>>();
        for task in tasks {
            task.await
        }
        log::info!("Spawns Finished");
    }
}
