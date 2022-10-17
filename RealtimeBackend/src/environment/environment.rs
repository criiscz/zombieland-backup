use futures_util::{future, pin_mut, StreamExt, TryStreamExt};
use std::{env, io::Error, net::SocketAddr, sync::Arc, sync::Mutex, time::Duration};
use tokio::{
    net::{TcpListener, TcpStream},
    time::sleep,
};

use crate::domain::{attack::Attack, enemy::Enemy, player::Player};

type Players = Arc<Mutex<Vec<Player>>>;
type Enemies = Arc<Mutex<Vec<Enemy>>>;
type Attacks = Arc<Mutex<Vec<Attack>>>;

pub struct Environment {
    players: Players,
    enemies: Enemies,
    attacks: Attacks,
}

impl Environment {
    pub fn new() -> Environment {
        Environment {
            players: Arc::new(Mutex::new(Vec::new())),
            enemies: Arc::new(Mutex::new(Vec::new())),
            attacks: Arc::new(Mutex::new(Vec::new())),
        }
    }

    pub fn start() {
        todo!("Make the start code!")
    }
}
