pub fn distance_between(first: (f32, f32), second: (f32, f32)) -> f32 {
    let difference = (first.0 - second.0).powi(2) + (first.1 - second.1).powi(2);
    difference.sqrt()
}
