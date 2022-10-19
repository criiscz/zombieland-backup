use crate::{domain::player::Player, environment::environment::PlayersState};

pub async fn handle_player(mut input: Player, players_state: PlayersState) {
    match (*players_state).lock().await {
        mut x => {
            if let Some(player) = x.iter_mut().find(|player| player.id == input.id) {
                player.update(input)
            } else {
                input.first_enter();
                x.push(input);
            };
        }
    }
}
