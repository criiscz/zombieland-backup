use connections::server::start_server;
use env_logger;
use std::io::Error;

mod actions;
mod connections;
mod domain;
mod environment;
mod test;
mod utils;

#[tokio::main]
async fn main() -> Result<(), Error> {
    env_logger::init();
    let server_address = "0.0.0.0:8090".to_string();
    start_server(server_address).await;
    Ok(())
}
