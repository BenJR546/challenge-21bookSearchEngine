// client/src/utils/API.js

// Route to get logged in user's info (needs the token)
export const getMe = (token) => {
    return fetch("/api/users/me", {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
};

export const createUser = (userData) => {
    return fetch("/api/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });
};

export const loginUser = (userData) => {
    return fetch("/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });
};

// Save book data for a logged in user
export const saveBook = (bookData, token) => {
    return fetch("/api/users", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookData),
    });
};

// Remove saved book data for a logged in user
export const deleteBook = (bookId, token) => {
    return fetch(`/api/users/books/${bookId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

// Make a search to Google Books API
// client/src/utils/API.js

export const searchGoogleBooks = (query) => {
    const apiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;

    return fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
            query
        )}&key=${apiKey}`
    );
};
