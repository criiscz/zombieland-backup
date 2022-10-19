use futures_util::StreamExt;
use redis_async::{client, resp::FromResp};
use tokio::sync::broadcast::Sender;

pub fn start_player_output_handler(sender: Sender<String>) {
    tokio::spawn(async move {
        let pubsub_connection = client::pubsub_connect("127.0.0.1:6379")
            .await
            .expect("Can't connect with Dragonflydb");
        let mut pubsub = pubsub_connection
            .psubscribe("channel1")
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
