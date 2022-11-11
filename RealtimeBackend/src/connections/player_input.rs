use serde_json::Result;
use tokio::sync::broadcast::Receiver;

use crate::{
    actions::{
        attacks::handle_attacks,
        players::{handle_player_disconnection, handle_player_update},
    },
    domain::{
        attack::Bullet,
        input_message::InputMessage,
        state_types::{BulletsState, PlayersState},
    },
};

pub fn start_player_input_handler(
    mut receiver: Receiver<String>,
    players_state: PlayersState,
    attacks_state: BulletsState,
) {
    tokio::spawn(async move {
        while let Ok(msg) = receiver.recv().await {
            if msg.is_empty() {
                log::trace!("Empty message message received");
            } else {
                handle_input(msg, players_state.clone(), attacks_state.clone()).await;
            }
        }
    });
}

async fn handle_input(
    connector_message: String,
    players_state: PlayersState,
    attacks_state: BulletsState,
) {
    if !connector_message.contains("||") {
        return handle_disconnection(connector_message, players_state).await;
    }
    let input_slices = connector_message.split("||").collect::<Vec<&str>>();
    let actions_information: &str = *input_slices.first().unwrap();
    let address: &str = *input_slices.last().unwrap();

    let input_converted: Result<InputMessage<Bullet>> = serde_json::from_str(actions_information);
    match input_converted {
        Ok(mut input_message) => {
            input_message.complete_information(address);
            let attacks_task = handle_attacks(input_message.attacks, attacks_state);
            let events_task = handle_player_update(input_message.player, players_state);
            _ = tokio::join!(tokio::spawn(attacks_task,), tokio::spawn(events_task));
        }
        Err(error) => {
            log::warn!("Can't deserialize the input! {}", error)
        }
    }
}
async fn handle_disconnection(address: String, players_state: PlayersState) {
    handle_player_disconnection(address, players_state).await
}
