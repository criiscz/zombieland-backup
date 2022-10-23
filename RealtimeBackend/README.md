# Zombieland Game

## Getting started
The first thing you need to have is a Docker installation for run the tow containers of the project (DragonflyDB and Rust backend)
And for development you need to have the latest Rust installation

## Run DragonflyDB
If you already have executed the start.lua script, you **mustn't execute this**.
The first time you need to create the container with the following command:
```
docker run --network=host --ulimit memlock=-1 --name dragonfly docker.dragonflydb.io/dragonflydb/dragonfly
```
And then, you can manipulate the container as you want with these commands:
```
docker start dragonfly
docker stop dragonfly
```

## Integrate with your tools

- [ ] [Rust for VSCode](https://code.visualstudio.com/docs/languages/rust)

## Rust? WTF
Fast introduction to Rust for Java/Maven developers :D

### Files: 
- Cargo.toml -> This is like the pom.xml of Maven, all the dependencies go here.
- main.rs    -> Yeah, Rust also have a main method as entry point
- mod.rs    -> Java don't have this, but python do!, this is like the  `__init__.py` (In newer versions of Rust is optional)

### Commands: 
The commands are easier than the code!

`mvn build`
```
cargo build 
```

`mvn run`
```
cargo run 
```

### Code: 
Nice, this part is a little bit more difficult than the others.

- You can declare a constant (yes, with python-like snake_case) with:
```rust
let i_am_a_constant = "Hi mom!";
```
And yes, Rust is a language of semicolons and curly brackets :D

- The main function looks like this (like in Java, it doesn't have return)
```rust
fn main{
  println!("Hello World!");
}
```
- Important thing, Rust don't have garbage collector, and you don't need to manage the memory on your own, it has a new concept called borrow checking, where the pointers change the owner of each value, a basic pointer looks like this.
```rust
  let i_am_a_string: String = String::from("Soy un String");
  let i_am_a_pointer_to_string: &String = &i_am_a_string;
```

- Important thing, Rust **isn't a object oriented language** so **don't try to do objects**, the most similar thing that you can do here, is a structure with the keyword `struct`, the structures can't have methods inside.
```rust
struct IAmAStructure{
  field: String,
  otherField: usize
}
```

- If you want to create a method for a Structure (like a function inside a class) you need to create a `trait` and them, implement this trait for the structure, here is a example of trait
```rust
trait Imprimible {
    fn do_something(element: &Element) -> String;
}
```
For implementations in the structure, you can:
```rust
impl Imprimible for IAmAStructure {
    fn do_something(element: &IAmAStructure) -> String {
        String::from(element.field.clone())
    }
}
```
This means that you can do this, and the result will be the field of the structure
```rust
fn main() {
    let element = IAmAStructure {
        field: String::from("Esto es un mensaje"),
        otherField: 23,
    };
    let message: String = IAmAStructure::do_something(&element);
    println!("{}", message);
}
```

For more information, here is the [Rust Book](https://doc.rust-lang.org/book/).
Happy Hacking! Att: Orlando :D 


