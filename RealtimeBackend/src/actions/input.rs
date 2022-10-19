use futures_util::{future, pin_mut, StreamExt, TryStreamExt};
use serde_json::Result;
use std::{env, io::Error, net::SocketAddr, sync::Arc, sync::Mutex, time::Duration};
use tokio::sync::broadcast::Receiver;

use crate::domain::{attack::Attack, enemy::Enemy, player::Player};
use crate::{
    actions::{attacks::handle_attacks, players::handle_events},
    domain::{event::Bullet, input_message::InputMessage},
};

pub async fn handle_input(input: String) {
    let input_converted: Result<InputMessage<Bullet>> = serde_json::from_str(&input);
    match input_converted {
        Ok(input_message) => {
            log::trace!("Input message received");
            let attacks_task = handle_attacks(&input_message);
            let events_task = handle_events(&input_message);
            tokio::join!(attacks_task, events_task);
        }
        Err(error) => log::warn!("Can't deserialize the input! {}", error),
    }
}
