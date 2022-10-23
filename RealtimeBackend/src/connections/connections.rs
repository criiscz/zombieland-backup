use futures_util::{SinkExt, StreamExt, TryStreamExt};
use std::{env, fmt::format};
use tokio::{
    net::{TcpListener, TcpStream},
    sync::broadcast::{channel, Receiver, Sender},
};
use tokio_tungstenite::{tungstenite::Message, WebSocketStream};

pub struct Connections {
    input_sender: Sender<String>,
    output_sender: Sender<String>,
}

impl Connections {
    pub fn new() -> Connections {
        let (input_tx, _input_rx) = channel::<String>(20);
        let (output_tx, _output_rx) = channel::<String>(20);
        Connections {
            input_sender: input_tx,
            output_sender: output_tx,
        }
    }

    pub fn get_channels(&self) -> (Sender<String>, Receiver<String>) {
        let receiver = self.input_sender.clone().subscribe();
        let sender = self.output_sender.clone();
        (sender, receiver)
    }

    pub async fn start(&self, server_address: String) {
        let address = env::args().nth(1).unwrap_or_else(|| server_address);
        let try_socket = TcpListener::bind(&address).await;
        let listener = try_socket.expect("Failed to bind");
        log::info!("Listening at {}", address);

        while let Ok((stream, _)) = listener.accept().await {
            let sender = self.input_sender.clone();
            let suscriber = self.output_sender.subscribe();
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
            .expect("Error websocket handshake");

        let (mut writer, mut reader) = ws_stream.split();
        log::trace!("New connection at {}", &address);
        loop {
            tokio::select! {
                result = reader.try_next() => {
                    let message = result.unwrap_or(None);
                    match message {
                        Some(value) => {
                            let input_addressed = format!("{}||{}", value, &address);
                            channel_sender.send(input_addressed).unwrap_or(0);
                        },
                        None => {
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
        channel_sender.send(format!("{}", &address)).unwrap_or(0);
        log::trace!("Disconnection at {}", &address);
    }
}
