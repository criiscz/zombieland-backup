use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct Player {
    pub id: u16,
    pub name: String,
    #[serde(default)]
    pub health: u8,
    pub position_y: f32,
    pub position_x: f32,
    pub skin: u8,
    pub axis: u8,
}
