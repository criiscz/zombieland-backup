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
