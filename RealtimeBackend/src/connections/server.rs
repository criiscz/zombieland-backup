use super::{connections::Connections, player_input::start_player_input_handler};
use tokio::sync::broadcast::{Receiver, Sender};

pub async fn start_server() {
    let server_address = "127.0.0.1:8080".to_string();
    let connections_handler = Connections::new();

    let (sender, receiver): (Sender<String>, Receiver<String>) = connections_handler.get_channels();
    start_player_input_handler(receiver);

    Connections::start(&connections_handler, server_address).await;
}
