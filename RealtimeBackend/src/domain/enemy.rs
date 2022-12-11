use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct Enemy {
    pub position_y: f32,
    pub position_x: f32,
    pub skin: u8,
    pub axis: u8,
}

impl Clone for Enemy {
    fn clone(&self) -> Self {
        Enemy {
            position_x: self.position_x.clone(),
            position_y: self.position_y.clone(),
            skin: self.skin.clone(),
            axis: self.axis.clone(),
        }
    }
}

impl Enemy {
    pub fn new() -> Enemy {
        Enemy {
            position_y: 100.0,
            position_x: 100.0,
            skin: 0,
            axis: 0,
        }
    }
}
