use crate::domain::player::Player;
use futures_util::{SinkExt, StreamExt, TryStreamExt};
use std::{env, sync::Arc, sync::Mutex};
use tokio::{
    net::{TcpListener, TcpStream},
    sync::broadcast::{channel, Receiver, Sender},
};
use tokio_tungstenite::{tungstenite::Message, WebSocketStream};

type PlayersConnections = Arc<Mutex<Vec<Player>>>;

pub struct Connections {
    pub connections: PlayersConnections,
    pub channel_sender: Sender<String>,
    pub channel_receiver: Receiver<String>,
}

impl Connections {
    pub fn new() -> Connections {
        let (tx, rx) = channel::<String>(20);
        Connections {
            connections: Arc::new(Mutex::new(Vec::new())),
            channel_sender: tx,
            channel_receiver: rx,
        }
    }

    pub async fn start(&self, server_address: String) {
        let address = env::args().nth(1).unwrap_or_else(|| server_address);
        let try_socket = TcpListener::bind(&address).await;
        let listener = try_socket.expect("Failed to bind");
        log::info!("Listening at {}", address);

        while let Ok((stream, _)) = listener.accept().await {
            let sender = self.channel_sender.clone();
            let suscriber = sender.subscribe();
            tokio::spawn(Connections::accept_connection(stream, sender, suscriber));
        }
    }

    async fn accept_connection(
        stream: TcpStream,
        channel_sender: Sender<String>,
        mut channel_suscriber: Receiver<String>,
    ) {
        let address = stream
            .peer_addr()
            .expect("connected streams should have a peer address");
        let ws_stream: WebSocketStream<TcpStream> = tokio_tungstenite::accept_async(stream)
            .await
            .expect("Error during the websocket handshake occurred");

        let (mut writer, mut reader) = ws_stream.split();
        log::trace!("New player connection: {}", &address);
        loop {
            tokio::select! {
                result = reader.try_next() => {
                    let message = result.unwrap_or(None);
                    match message {
                        Some(value) => {
                            log::trace!("Message {}", value);
                            channel_sender.send(value.to_string()).unwrap();
                        },
                        None => {
                            log::trace!("Interrumped");
                            break;
                        }
                    };
                }
                result = channel_suscriber.recv() => {
                    let message = result.unwrap_or(String::new());
                    writer.send(Message::from(message)).await.unwrap();
                }
            }
        }
    }
}
