use crate::environment::environment::Environment;

use super::{
    connections::Connections, player_input::start_player_input_handler,
    player_output::start_player_output_handler,
};
use tokio::sync::broadcast::{Receiver, Sender};

pub async fn start_server(server_address: String) {
    let connections_handler = Connections::new();
    let environment = Environment::new();

    let (sender, receiver): (Sender<String>, Receiver<String>) = connections_handler.get_channels();

    let attacks_state = environment.get_attacks_state();
    let players_state = environment.get_players_state();

    Environment::start(&environment);

    start_player_input_handler(receiver, players_state, attacks_state);
    start_player_output_handler(sender);

    Connections::start(&connections_handler, server_address).await;
}
