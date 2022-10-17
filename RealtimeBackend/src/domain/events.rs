use serde::{Deserialize, Serialize};

pub trait Event {
    fn get_angle(self) -> f32;
    fn get_type(self) -> String;
}

impl Event for Bullet {
    fn get_angle(self) -> f32 {
        self.angle
    }

    fn get_type(self) -> String {
        self.event_type
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Bullet {
    event_type: String,
    angle: f32,
}
