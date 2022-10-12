use futures_channel::mpsc::{unbounded, UnboundedSender};
use futures_util::{future, pin_mut, StreamExt, TryStreamExt};
use std::{env, io::Error, net::SocketAddr, sync::Arc, sync::Mutex, time::Duration};
use tokio::{
    net::{TcpListener, TcpStream},
    time::sleep,
};
use tokio_tungstenite::tungstenite::Message;

type Sender = UnboundedSender<Message>;
type PlayersConnections = Arc<Mutex<Vec<Player>>>;

struct Player {
    name: String,
    address: SocketAddr,
    sender: Sender,
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    let addr = env::args()
        .nth(1)
        .unwrap_or_else(|| "127.0.0.1:8080".to_string());
    let try_socket = TcpListener::bind(&addr).await;
    let listener = try_socket.expect("Failed to bind");
    println!("Listening in: {}", addr);

    let players_connections: PlayersConnections = Arc::new(Mutex::new(Vec::new()));

    let ref_connections = Arc::clone(&players_connections);
    tokio::spawn(send_greetings(ref_connections));

    while let Ok((stream, _)) = listener.accept().await {
        let ref_connections = Arc::clone(&players_connections);
        tokio::spawn(accept_connection(stream, ref_connections));
    }

    Ok(())
}

async fn send_greetings(players_connections: PlayersConnections) {
    loop {
        sleep(Duration::from_secs(2)).await;
        let connections = players_connections.lock().unwrap();
        let broadcast_recipients = connections.iter().map(|player| &player.sender);
        for recp in broadcast_recipients {
            recp.unbounded_send(Message::from("You are connected!").clone())
                .unwrap();
        }
    }
}

async fn accept_connection(stream: TcpStream, players_connections: PlayersConnections) {
    let address = stream
        .peer_addr()
        .expect("connected streams should have a peer address");
    println!("Peer address: {}", address);

    let ws_stream = tokio_tungstenite::accept_async(stream)
        .await
        .expect("Error during the websocket handshake occurred");

    let (sender, receiver) = unbounded();
    let player = Player {
        name: "Pepe".to_owned(),
        address,
        sender,
    };
    players_connections.lock().unwrap().push(player);

    let (writer, reader) = ws_stream.split();
    println!("New WebSocket connection: {}", address);

    let incomming_broadcast = reader.try_for_each(|msg| {
        let peers = players_connections.lock().unwrap();
        let broadcast_recipients = peers
            .iter()
            .filter(|player| &&player.address != &&address)
            .map(|player| &player.sender);

        for recp in broadcast_recipients {
            recp.unbounded_send(msg.clone()).unwrap();
        }

        future::ok(())
    });

    let receive_others = receiver.map(Ok).forward(writer);
    pin_mut!(incomming_broadcast, receive_others);
    future::select(incomming_broadcast, receive_others).await;

    println!("{} disconnected", &address);
    let index = players_connections
        .lock()
        .unwrap()
        .iter()
        .position(|element| element.address.clone() == address.clone())
        .unwrap();
    players_connections.lock().unwrap().remove(index);
}
