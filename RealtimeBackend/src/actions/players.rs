use crate::{domain::player::Player, environment::environment::PlayersState};

pub async fn handle_player(input: Player, players_state: PlayersState) {
    match (*players_state).lock().await {
        mut x => {
            x.retain(|player| (*player).id != input.id);
            x.push(input)
        }
    }
}
