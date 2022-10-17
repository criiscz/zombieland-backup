use super::connections::Connections;

pub async fn start_server() {
    let connections_handler = start_connections().await;
}

async fn start_connections() -> Connections {
    let server_address = "127.0.0.1:8080".to_string();
    let connections_handler: Connections = Connections::new();
    Connections::start(&connections_handler, server_address).await;
    connections_handler
}
