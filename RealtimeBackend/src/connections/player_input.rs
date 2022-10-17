use serde_json::Result;
use tokio::sync::broadcast::Receiver;

use crate::{
    actions::{attacks::handle_attacks, players::handle_events},
    domain::{events::Bullet, input_message::InputMessage},
};

pub fn start_player_input_handler(mut receiver: Receiver<String>) {
    tokio::spawn(async move {
        while let Ok(msg) = receiver.recv().await {
            handle_input(msg).await;
        }
    });
}

async fn handle_input(input: String) {
    let input_converted: Result<InputMessage<Bullet>> = serde_json::from_str(&input);
    match input_converted {
        Ok(input_message) => {
            let attacks_task = handle_attacks(&input_message);
            let events_task = handle_events(&input_message);
            tokio::join!(attacks_task, events_task);
        }
        Err(error) => log::warn!("Can't deserialize the input! {}", error),
    }
}
