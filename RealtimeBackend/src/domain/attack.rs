use std::fmt::Display;

use serde::{Deserialize, Serialize};

pub trait Attack {
    fn get_angle(self) -> f32;
    fn get_type(self) -> String;
    fn get_position(self) -> (f32, f32);
}

impl Attack for Bullet {
    fn get_angle(self) -> f32 {
        self.angle
    }

    fn get_type(self) -> String {
        self.attack_type
    }

    fn get_position(self) -> (f32, f32) {
        (self.position_x, self.position_y)
    }
}

impl Display for Bullet {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(
            f,
            "Bullet x:{} y:{} uid:{}",
            self.position_x, self.position_y, self.player_id
        )
    }
}

impl Clone for Bullet {
    fn clone(&self) -> Self {
        Bullet {
            attack_type: self.attack_type.clone(),
            angle: self.angle.clone(),
            position_y: self.position_y.clone(),
            position_x: self.position_x.clone(),
            player_id: self.player_id.clone(),
        }
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Bullet {
    pub attack_type: String,
    pub angle: f32,
    #[serde(default)]
    pub position_y: f32,
    #[serde(default)]
    pub position_x: f32,
    #[serde(default)]
    pub player_id: u16,
}
