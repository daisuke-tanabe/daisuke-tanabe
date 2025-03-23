use pulldown_cmark::{Parser, Options};
use std::error::Error;
use std::fs;
use std::path;

pub fn read_dir(path: &str) -> Result<Vec<path::PathBuf>, Box<dyn Error>> {
    let dir = fs::read_dir(path)?;
    let mut files: Vec<path::PathBuf> = Vec::new();
    for item in dir.into_iter() {
        files.push(item?.path());
    }
    Ok(files)
}

fn main() {
    let files = read_dir("docs");

    for file in files.unwrap() {
        let content = fs::read_to_string(file).unwrap();

        let mut options = Options::empty();
        options.insert(Options::ENABLE_STRIKETHROUGH);
        let parser = Parser::new_ext(&content, options);

        // Write to String buffer.
        let mut html_output = String::new();
        pulldown_cmark::html::push_html(&mut html_output, parser);

        println!("{:?}", html_output);
    }
}
