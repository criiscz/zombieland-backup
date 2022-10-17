use serde::{Deserialize, Serialize};

use super::{event::Event, player::Player};

#[derive(Serialize, Deserialize, Debug)]
pub struct InputMessage<T: Event> {
    player: Player,
    events: Vec<T>,
}
