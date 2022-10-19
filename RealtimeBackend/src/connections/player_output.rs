use tokio::sync::broadcast::Sender;

pub fn start_player_output_handler(sender: Sender<String>) {
    tokio::spawn(async move {
        let client = redis::Client::open("redis://127.0.0.1/").unwrap();
        let mut connection = client.get_connection().unwrap();
        let mut pubsub = connection.as_pubsub();
        pubsub.subscribe("channel1").unwrap();
        loop {
            let msg: String = pubsub.get_message().unwrap().get_payload().unwrap();
            match sender.send(msg) {
                Ok(_) => (),
                Err(_) => log::info!("There aren't players connected"),
            };
        }
    });
}
