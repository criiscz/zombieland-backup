use std::env;

use futures_util::StreamExt;
use redis_async::{client, resp::FromResp};
use tokio::sync::broadcast::Sender;

pub fn start_player_output_handler(sender: Sender<String>) {
    let cache_address = env::var("CACHE_ADDRESS").unwrap_or("127.0.0.1:6379".to_string());
    tokio::spawn(async move {
        let pubsub_connection = client::pubsub_connect(cache_address)
            .await
            .expect("Can't connect with Dragonflydb");
        let mut pubsub = pubsub_connection
            .psubscribe("zombieland_channel")
            .await
            .expect("Can't subscribe to channel");
        while let Some(message) = pubsub.next().await {
            match message {
                Ok(response) => {
                    sender
                        .send(String::from_resp(response).unwrap())
                        .unwrap_or(0);
                }
                Err(_) => {
                    log::error!("Error in receiving pub/sub channel, can't continue working");
                    break;
                }
            }
        }
    });
}
