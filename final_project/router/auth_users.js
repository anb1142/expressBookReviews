const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
	// Check if the username is valid
	const user = users.find((user) => user.username === username);
	return user !== undefined;
};

const authenticatedUser = (username, password) => {
	const user = users.find((user) => user.username === username);

	if (!user || user.password !== password) {
		return false; // Authentication failed
	}
	return true; // Authentication succeeded
};

//only registered users can login
regd_users.post("/login", (req, res) => {
	const { username, password } = req.body;

	if (!isValid(username)) {
		return res.status(401).json({ message: "Invalid username" });
	}

	if (!authenticatedUser(username, password)) {
		return res.status(401).json({ message: "Invalid credentials" });
	}

	const token = jwt.sign({ username }, "secret_key");
	req.session.token = token;
	return res.status(200).json({ message: "Customer Succesfully logged in" });
	// return res.status(200).json({ token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
	const { isbn } = req.params;
	const { review } = req.query;
	const { username } = req.user; //
	// Check if the book with the given ISBN exists

	const book = books[isbn];
	if (!book) {
		return res.status(404).json({ message: "Book not found" });
	}

	// Update or insert the review
	book.reviews[username] = review;
	console.log(book);
	return res.status(200).json({ message: "Review updated/inserted successfully" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
	const { isbn } = req.params;
	const { username } = req.user; //
	// Check if the book with the given ISBN exists

	const book = books[isbn];
	if (!book) {
		return res.status(404).json({ message: "Book not found" });
	}

	// Update or insert the review
	delete book.reviews[username];
	console.log(book);
	return res.status(200).json({ message: "Review deleted" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
