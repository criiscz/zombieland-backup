use crate::domain::{
    attack::Bullet,
    enemy::Enemy,
    player::Player,
    state_types::{EnemiesState, PlayersState},
};
use std::sync::Arc;
use tokio::sync::Mutex;

#[test]
fn point_distance() {
    use crate::utils::distance_between;
    let first: (f32, f32) = (3.0, 2.0);
    let second: (f32, f32) = (9.0, 7.0);
    let expected: f32 = 7.81025;
    assert_eq!(expected, distance_between(first, second))
}

#[allow(dead_code)]
pub fn fake_players(amount: u16) -> PlayersState {
    let mut list = vec![];
    for index in 0..amount {
        list.push(fake_player(index));
    }
    Arc::new(Mutex::new(list))
}

#[allow(dead_code)]
pub fn fake_player(index: u16) -> Player {
    Player {
        id: index,
        name: String::from(format! {"Bot #{}", index}),
        health: 3,
        position_y: index as f32,
        position_x: index as f32,
        skin: 0,
        axis: 0,
        connection_address: String::from("WS::5335"),
    }
}

#[allow(dead_code)]
pub fn fake_enemies(amount: u16) -> EnemiesState {
    let mut list = vec![];
    for index in 0..amount {
        list.push(fake_enemy(index));
    }
    Arc::new(Mutex::new(list))
}

#[allow(dead_code)]
pub fn fake_enemy(index: u16) -> Enemy {
    Enemy {
        position_y: 100.0 + index as f32,
        position_x: 100.0 + index as f32,
        skin: 0,
        axis: 0,
    }
}

#[allow(dead_code)]
pub fn fake_bullet() -> Bullet {
    Bullet {
        attack_type: "bullet".to_owned(),
        angle: 30.5,
        position_y: 300.0,
        position_x: 100.0,
        player_id: 1,
    }
}
