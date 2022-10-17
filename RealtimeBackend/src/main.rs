use connections::server::start_server;
use env_logger;
use std::io::Error;

mod actions;
mod connections;
mod domain;

#[tokio::main]
async fn main() -> Result<(), Error> {
    env_logger::init();
    start_server().await;
    Ok(())
}
