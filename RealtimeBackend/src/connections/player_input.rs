use serde_json::Result;
use tokio::sync::broadcast::Receiver;

use crate::{
    actions::{attacks::handle_attacks, players::handle_player},
    domain::{attack::Bullet, input_message::InputMessage},
    environment::environment::{BulletsState, PlayersState},
};

pub fn start_player_input_handler(
    mut receiver: Receiver<String>,
    players_state: PlayersState,
    attacks_state: BulletsState,
) {
    tokio::spawn(async move {
        while let Ok(msg) = receiver.recv().await {
            if msg.is_empty() {
                return log::trace!("Empty message message received");
            }
            handle_input(msg, players_state.clone(), attacks_state.clone()).await;
        }
    });
}

async fn handle_input(input: String, players_state: PlayersState, attacks_state: BulletsState) {
    let input_converted: Result<InputMessage<Bullet>> = serde_json::from_str(&input);
    match input_converted {
        Ok(mut input_message) => {
            input_message.autocomplete();
            let attacks_task = handle_attacks(input_message.attacks, attacks_state);
            let events_task = handle_player(input_message.player, players_state);
            tokio::join!(attacks_task, events_task);
        }
        Err(error) => log::warn!("Can't deserialize the input! {}", error),
    }
}
