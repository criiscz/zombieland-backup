use super::connections::Connections;

pub async fn start_server() {
    start_connections().await;
}

async fn start_connections() {
    let server_address = "127.0.0.1:8080".to_string();
    let connections_handler: Connections = Connections::new();
    Connections::start(&connections_handler, server_address).await;
}
