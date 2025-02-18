// client/src/pages/SearchBooks.jsx
import { useState, useEffect } from "react";
import { Container, Col, Form, Button, Card, Row } from "react-bootstrap";

import Auth from "../utils/auth";
import { saveBook, searchGoogleBooks } from "../utils/API";
import { saveBookIds, getSavedBookIds } from "../utils/localStorage";

const SearchBooks = () => {
    // Create state for holding returned Google API data
    const [searchedBooks, setSearchedBooks] = useState([]);
    // Create state for holding our search field data
    const [searchInput, setSearchInput] = useState("");

    // Create state to hold saved bookId values
    const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

    // Set up useEffect hook to save `savedBookIds` list to localStorage when component unmounts
    useEffect(() => {
        return () => saveBookIds(savedBookIds);
    });

    // Create method to search for books and set state on form submit
    const handleFormSubmit = async (event) => {
        event.preventDefault();

        if (!searchInput) {
            return false;
        }

        try {
            const response = await searchGoogleBooks(searchInput);

            if (!response.ok) {
                throw new Error("Something went wrong!");
            }

            const { items } = await response.json();

            const bookData = items.map((book) => ({
                bookId: book.id,
                authors: book.volumeInfo.authors || ["No author to display"],
                title: book.volumeInfo.title,
                description:
                    book.volumeInfo.description || "No description available",
                image: book.volumeInfo.imageLinks?.thumbnail || "",
            }));

            setSearchedBooks(bookData);
            setSearchInput("");
        } catch (err) {
            console.error(err);
        }
    };

    // Create function to handle saving a book to our database
    const handleSaveBook = async (bookId) => {
        // Find the book in `searchedBooks` state by the matching id
        const bookToSave = searchedBooks.find((book) => book.bookId === bookId);

        // Get token
        const token = Auth.loggedIn() ? Auth.getToken() : null;

        if (!token) {
            return false;
        }

        try {
            const response = await saveBook(bookToSave, token);

            if (!response.ok) {
                throw new Error("Something went wrong!");
            }

            // If book successfully saves to user's account, save book id to state
            setSavedBookIds([...savedBookIds, bookToSave.bookId]);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <div className="text-light bg-dark p-5">
                <Container>
                    <h1>Search for Books!</h1>
                    <Form onSubmit={handleFormSubmit}>
                        <Row>
                            <Col xs={12} md={8}>
                                <Form.Control
                                    name="searchInput"
                                    value={searchInput}
                                    onChange={(e) =>
                                        setSearchInput(e.target.value)
                                    }
                                    type="text"
                                    size="lg"
                                    placeholder="Search for a book"
                                />
                            </Col>
                            <Col xs={12} md={4}>
                                <Button
                                    type="submit"
                                    variant="success"
                                    size="lg"
                                >
                                    Submit Search
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Container>
            </div>

            <Container>
                <h2 className="pt-5">
                    {searchedBooks.length
                        ? `Viewing ${searchedBooks.length} results:`
                        : "Search for a book to begin"}
                </h2>
                <Row>
                    {searchedBooks.map((book) => {
                        return (
                            <Col md="4" key={book.bookId}>
                                <Card border="dark" className="mb-3">
                                    {book.image ? (
                                        <Card.Img
                                            src={book.image}
                                            alt={`The cover for ${book.title}`}
                                            variant="top"
                                        />
                                    ) : null}
                                    <Card.Body>
                                        <Card.Title>{book.title}</Card.Title>
                                        <p className="small">
                                            Authors: {book.authors.join(", ")}
                                        </p>
                                        <Card.Text>
                                            {book.description}
                                        </Card.Text>
                                        {Auth.loggedIn() && (
                                            <Button
                                                disabled={savedBookIds?.some(
                                                    (savedBookId) =>
                                                        savedBookId ===
                                                        book.bookId
                                                )}
                                                className="btn-block btn-info"
                                                onClick={() =>
                                                    handleSaveBook(book.bookId)
                                                }
                                            >
                                                {savedBookIds?.some(
                                                    (savedBookId) =>
                                                        savedBookId ===
                                                        book.bookId
                                                )
                                                    ? "This book has already been saved!"
                                                    : "Save this Book!"}
                                            </Button>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            </Container>
        </>
    );
};

export default SearchBooks;
