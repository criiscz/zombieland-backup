use serde::{Deserialize, Serialize};

use super::{
    attack::{Attack, Bullet},
    player::Player,
};

#[derive(Serialize, Deserialize, Debug)]
pub struct InputMessage<T: Attack> {
    pub player: Player,
    pub attacks: Vec<T>,
}

impl InputMessage<Bullet> {
    pub fn autocomplete(&mut self) {
        self.attacks.iter_mut().for_each(|attack| {
            attack.position_y = self.player.position_y;
            attack.position_x = self.player.position_x;
            attack.player_id = self.player.id;
        });
    }
}
