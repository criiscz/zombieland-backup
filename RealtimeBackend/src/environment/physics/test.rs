#[cfg(test)]
mod tests {
    use std::time::Duration;

    use crate::{
        environment::physics::physic::Physic,
        test::{fake_enemies, fake_players},
    };
    use tokio::time::Instant;

    #[tokio::test]
    async fn enemies_path_find_performance() {
        use crate::environment::physics::enemies_physics::EnemiesPhysics;
        let fake_enemies = fake_enemies(80);
        let fake_players = fake_players(40);
        let environment = EnemiesPhysics::new(fake_enemies, fake_players);
        let start = Instant::now();
        environment.run().await;
        assert_eq!(true, start.elapsed() <= Duration::from_millis(2))
    }
}
