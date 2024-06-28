# Enjoy the Microblog Project and the MicroblogLite API!

# Microblog Lite

Microblog Lite is a simple microblogging platform built with HTML, CSS, and JavaScript. It allows users to create posts, view profiles, and manage their content. The application interacts with a backend API for user authentication, post management, and profile updates.

## Features

- User Authentication (Login/Logout)
- View and Edit User Profile Full name and Bio
- Create, Like, and Remove Posts
- Sort Posts by Newest or Oldest
- Responsive Design with Bootstrap

## Technologies Used

- HTML
- CSS
- JavaScript
- Bootstrap 5
- Fetch API

## Getting Started

### Prerequisites

Make sure you have a modern web browser installed. No additional software is required.

### Installation

1.Don't forget to read the [*MicroblogLite* API docs](http://microbloglite.us-east-2.elasticbeanstalk.com/docs) and experiment with the API in *Postman!*

Practice and experimentation provide experience, and experience provides confidence.
2. Clone the repository:

    ```bash
    git clone [https://github.com/etsond/microbloglite-capstone-starter]
    cd microbloglite-capstone-starter
    ```

3. Open the `index.html` file in your web browser to start the application.


## Usage

### User Authentication

1. Navigate to the landing page (`index.html`).
2. Enter your username and password to log in.
3. If you don't have an account, click "Register" to register.

### Managing Profile

1. After logging in, navigate to the profile page (`./profile/index.html`).
2. View your profile information.
3. Click "Edit Profile" to update your full name and bio.

### Creating and Managing Posts

1. Navigate to the posts page (`./posts/index.html`).
3. View all posts on the page.
4. Like or Unlike posts using the like button.
5. Remove a posts using the remove button.
6. Sort posts by newest or oldest using the dropdown menu.

![Screenshot 2024-06-28 at 9 19 26 AM](https://github.com/etsond/microbloglite-capstone-starter/assets/35821623/a57a5236-4060-41f5-a365-d13cc20cbe79)

## API Reference

The application interacts with the backend API hosted at `http://microbloglite.us-east-2.elasticbeanstalk.com`. Key endpoints include:

- `POST /auth/login`: Authenticate a user.
- `GET /auth/logout`: Log out a user.
- `GET /api/users/:username`: Retrieve user profile information.
- `GET /api/posts?username=:username`: Retrieve posts for a user.
- `POST /api/posts`: Create a new post.
- `DELETE /api/posts/:postId`: Remove a post.
- `POST /api/likes`: Like a post.
- `DELETE /api/likes/:likeId`: Unlike a post.

## License

This project is licensed under the MIT License.

## Acknowledgements

- Thanks to the creators of Bootstrap for providing a responsive design framework.
- Thanks to the team behind the API for their support.

---

### Interesting Piece of Code

Here is an interesting piece of code from the project that handles creating sorting posts:

```javascript
 .then(posts => {
                const sortOrder = sortOrderSelect.value;
                if (sortOrder === "oldest") {
                    posts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                } else {
                    posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                }
                displayPosts(posts);
```

This part of the code allows users to choose how they want to see their posts, either from oldest to newest or newest to oldest, using a dropdown menu. It sorts the posts based on the selected option and then updates the page to display the posts in the chosen order. This make the user experience better by providing control over the display of content, making the app more user-friendly.

