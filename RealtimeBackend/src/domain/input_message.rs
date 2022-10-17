use serde::{Deserialize, Serialize};

use super::{events::Event, player::Player};

#[derive(Serialize, Deserialize, Debug)]
pub struct InputMessage<T: Event> {
    player: Player,
    events: Vec<T>,
}
