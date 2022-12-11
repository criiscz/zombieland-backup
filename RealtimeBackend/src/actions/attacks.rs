use crate::domain::{attack::Bullet, state_types::BulletsState};

pub async fn handle_attacks(input: Vec<Bullet>, bullets: BulletsState) {
    match (*bullets).lock().await {
        mut bullets_lock => {
            input
                .into_iter()
                .for_each(|bullet| bullets_lock.push(bullet));
        }
    }
}
