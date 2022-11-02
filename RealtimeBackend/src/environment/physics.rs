mod bullets_physics;
mod enemies_physics;
mod physic;

use futures_util::{future::join_all, stream::FuturesUnordered};

use crate::domain::state_types::{BulletsState, EnemiesState, PlayersState};

use self::{bullets_physics::BulletsPhysics, enemies_physics::EnemiesPhysics, physic::Physic};

pub async fn run_physics(players: PlayersState, enemies: EnemiesState, bullets: BulletsState) {
    let physics: Vec<Box<dyn Physic + Sync + Send>> = vec![
        Box::new(BulletsPhysics::new(bullets)),
        Box::new(EnemiesPhysics::new(enemies, players)),
    ];

    let tasks = physics
        .into_iter()
        .map(|physic| tokio::spawn(async move { physic.run().await }))
        .collect::<FuturesUnordered<_>>();
    join_all(tasks).await;
}
