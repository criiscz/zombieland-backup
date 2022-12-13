use super::physic::Physic;
use crate::{
    domain::{
        enemy::Enemy,
        state_types::{EnemiesState, PlayersState},
    },
    utils::distance_between,
};
use async_trait::async_trait;

pub struct EnemiesPhysics {
    enemies: EnemiesState,
    players: PlayersState,
}

impl EnemiesPhysics {
    pub fn new(enemies: EnemiesState, players: PlayersState) -> Self {
        EnemiesPhysics { enemies, players }
    }

    pub async fn search_for_player(players: PlayersState, enemy: &mut Enemy) {
        let nearest = Self::get_nearest_player(players, enemy).await;
        match nearest {
            Some(position) => Self::move_in_direction_to(enemy, position).await,
            None => {}
        }
    }

    async fn get_nearest_player(players: PlayersState, enemy: &Enemy) -> Option<(f32, f32)> {
        let distance_and_position = players
            .lock()
            .await
            .iter()
            .map(|player| {
                let distance = distance_between(
                    (player.position_x, player.position_y),
                    (enemy.position_x, enemy.position_y),
                );
                let player_position = (player.position_x, player.position_y);
                (distance, player_position)
            })
            .min_by(|x, y| x.0.partial_cmp(&y.0).unwrap());
        if distance_and_position.is_some() {
            Some(distance_and_position.unwrap().1)
        } else {
            None
        }
    }

    async fn move_in_direction_to(enemy: &mut Enemy, position: (f32, f32)) {
        const ENEMIES_SPEED: f32 = 1.0;
        if enemy.position_x > position.0 {
            enemy.position_x -= ENEMIES_SPEED;
        }
        if enemy.position_x < position.0 {
            enemy.position_x += ENEMIES_SPEED;
        }
        if enemy.position_y < position.1 {
            enemy.position_y += ENEMIES_SPEED;
        }
        if enemy.position_y > position.1 {
            enemy.position_y -= ENEMIES_SPEED;
        }
    }
}

#[async_trait]
impl Physic for EnemiesPhysics {
    async fn run(&self) {
        let mut enemies = self.enemies.lock().await;
        let tasks = enemies
            .iter_mut()
            .map(|enemy| EnemiesPhysics::search_for_player(self.players.clone(), enemy));
        for search in tasks {
            search.await
        }
    }
}
