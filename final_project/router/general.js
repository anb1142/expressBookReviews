const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
	const { username, password } = req.body;

	if (isValid(username)) {
		return res.status(400).json({ message: "Username already exists" });
	}
	users.push({ username: username, password: password });
	return res.status(200).json({ message: "Registration successful" });
});

// Get the book list available in the shop
public_users.get("/", async (req, res) => {
	return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async (req, res) => {
	const isbn = req.params.isbn;
	const book = books[isbn];
	if (book) {
		return res.status(200).json(book);
	} else {
		return res.status(404).json({ message: "Book not found" });
	}
});

// Get book details based on author
public_users.get("/author/:author", async (req, res) => {
	const author = req.params.author;
	const filteredBooks = Object.values(books).filter((book) =>
		book.author.toLowerCase().includes(author.toLowerCase())
	);
	return res.status(200).json({
		booksbyauthor: filteredBooks,
	});
});

// Get all books based on title
public_users.get("/title/:title", async (req, res) => {
	const title = req.params.title;
	const filteredBooks = Object.values(books).filter((book) =>
		book.title.toLowerCase().includes(title.toLowerCase())
	);

	return res.status(200).json({
		booksbytitle: filteredBooks,
	});
});

//  Get book review
public_users.get("/review/:isbn", async (req, res) => {
	const isbn = req.params.isbn;
	const book = books[isbn];
	if (book) {
		return res.status(200).json(book.reviews);
	} else {
		return res.status(404).json({ message: "Book not found" });
	}
});

module.exports.general = public_users;
