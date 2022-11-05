#[cfg(test)]
mod tests {
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

        let mut max = 0;
        let mut min = 99999;
        for _ in 0..100 {
            let start = Instant::now();
            for _ in 0..100 {
                environment.run().await;
            }

            let elapsed = start.elapsed().as_micros();
            if elapsed > max {
                max = elapsed
            }
            if elapsed < min {
                min = elapsed
            }
        }
        assert!((max - min / 2) < 50000)
    }
}
