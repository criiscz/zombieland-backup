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

impl Clone for Player {
    fn clone(&self) -> Self {
        Player {
            id: self.id.clone(),
            name: self.name.clone(),
            health: self.health.clone(),
            position_y: self.position_y.clone(),
            position_x: self.position_x.clone(),
            skin: self.skin.clone(),
            axis: self.axis.clone(),
        }
    }
}

impl Player {
    pub fn update(&mut self, updated: Player) {
        self.position_y = updated.position_y;
        self.position_x = updated.position_x;
        self.axis = updated.axis;
    }

    pub fn first_enter(&mut self) {
        self.health = 3
    }
}
