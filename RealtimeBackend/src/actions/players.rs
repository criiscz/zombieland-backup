use crate::domain::{player::Player, state_types::PlayersState};

pub async fn handle_player_update(mut input: Player, players_state: PlayersState) {
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

pub async fn handle_player_disconnection(player_address: String, players_state: PlayersState) {
    (*players_state)
        .lock()
        .await
        .retain(|player| player.connection_address != player_address)
}
