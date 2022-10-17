use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct Player {
    id: u16,
    name: String,
    position_y: f32,
    position_x: f32,
    skin: u8,
    axis: u8,
}
