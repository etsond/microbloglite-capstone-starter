// /* Posts Page JavaScript */
"use strict";

window.onload = function () {

    // DOM Elements
    const containerForPost = document.getElementById("containerForPost");
    const loginOutBtn = document.getElementById("logoutButton");
    const sortOrderSelect = document.getElementById("sortOrderSelect");
    // Character limit for displaying post text (some users can enter a post longer than next)
    const CHAR_LIMIT = 100;
    const mainContent = document.getElementById("mainContent");
    const loadingScreen = document.getElementById("loadingScreen");

    // getting the login data from localStorage
    const loginData = getLoginData();

    // Redirect to the login page if the user is not logged in
    if (!isLoggedIn()) {
        window.location.href = "/";
        return;
    }

    // Function to fetch posts from the API
    function fetchPosts() {
        const options = {
            headers: {
                Authorization: "Bearer " + loginData.token
            }
        };
        fetch(apiBaseURL + "/api/posts", options)
            .then(function (response) {
                return response.json();
            })
            .then(function (posts) {
                // sort post based on the selected order
                const sortOrder = sortOrderSelect.value;
                if (sortOrder === "oldest") {
                    posts.sort(function (a, b) {
                        return new Date(a.createdAt) - new Date(b.createdAt);
                    });
                } else {
                    posts.sort(function (a, b) {
                        return new Date(b.createdAt) - new Date(a.createdAt);
                    });
                }
                displayPosts(posts);
                // Hide loading screen and show main content after posts are fetched
                loadingScreen.style.display = "none";
                mainContent.style.display = "block";
            })
            .catch(function (error) {
                console.error("Error fetching posts:", error);
            });
    }

    // Function to display posts on the page
    function displayPosts(posts) {
        // clear container for posts
        containerForPost.innerHTML = "";

        // if there are any post to show
        if (posts.length === 0) {
            containerForPost.innerHTML = "<p>No posts to display.</p>";
        } else {
            // loop through each post and create html elemetns fro them
            posts.forEach(function (post) {
                // check if the current user has liked a post
                let userLike = null;
                for (let i = 0; i < post.likes.length; i++) {
                    if (post.likes[i].username === loginData.username) {
                        userLike = post.likes[i];
                        break;
                    }
                }

                // col - 12 col - md - 6 col - lg - 4
                // creating a new post element  ----- need to go add in html page
                const postElement = document.createElement("div");
                postElement.className = "col-12 col-md-6 col-lg-4";

                // this is sloppy
                //need to come back to refactor


                // constructing the post HTML
                let postHTML = `
                    <div class="post">
                        <div class="d-flex align-items-center mb-2">
                            <img src="https://picsum.photos/seed/${post.username}/50" alt="Profile Picture" class="profile-img">
                            <div>
                                <p><strong>@${post.username}</strong> - ${new Date(post.createdAt).toLocaleString()}</p>
                            </div>
                        </div>`;

                // checking if the post has suprase the char limit
                if (post.text.length > CHAR_LIMIT) {
                    const shortText = post.text.substring(0, CHAR_LIMIT) + "...";
                    postHTML += `<p class="post-text">${shortText} <span class="see-more" style="color: blue; cursor: pointer;">See More</span></p>`;
                    postHTML += `<p class="full-text" style="display: none;">${post.text} <span class="see-less" style="color: blue; cursor: pointer;">See Less</span></p>`;
                } else {
                    postHTML += `<p>${post.text}</p>`;
                }

                // adding like and remove buttons to the post
                postHTML += `<div>
                                <button class="like-button btn btn-outline-primary btn-sm`;
                if (userLike) {
                    postHTML += ` liked" data-id="${post._id}" data-like-id="${userLike._id}">Unlike`;
                } else {
                    postHTML += `" data-id="${post._id}" data-like-id="">Like`;
                }
                postHTML += `</button>
                                <button class="remove-button btn btn-outline-danger btn-sm" data-id="${post._id}">Remove</button>
                            </div>
                        </div>`;
                postElement.innerHTML = postHTML;
                containerForPost.appendChild(postElement);
            });
        }
        addPostEventListeners();
    }

    // Function to add event listeners to the dynamically created buttons
    function addPostEventListeners() {
        // select all like, remove, see more and see less buttons
        const likeButtons = document.querySelectorAll(".like-button");
        const removeButtons = document.querySelectorAll(".remove-button");
        const seeMoreButtons = document.querySelectorAll(".see-more");
        const seeLessButtons = document.querySelectorAll(".see-less");

        // TODO add event listerner for like btn
        // like button event listener
        likeButtons.forEach(function (button) {
            button.addEventListener("click", handleLikePost);
        });

        // TODO add event listerner for remove btn

        removeButtons.forEach(function (button) {
            button.addEventListener("click", handleRemovePost);
        });
        // TODO add event listener for see more
        seeMoreButtons.forEach(function (button) {
            button.addEventListener("click", handleSeeMore);
        });

        seeLessButtons.forEach(function (button) {
            button.addEventListener("click", handleSeeLess);
        });
    }

    // Function to handle the like/unlike functionality
    function handleLikePost(event) {
        const button = event.target;
        const postId = button.getAttribute("data-id");
        const likeId = button.getAttribute("data-like-id");

        if (button.classList.contains('liked')) {
            fetch(apiBaseURL + "/api/likes/" + likeId, {
                method: "DELETE",
                headers: {
                    Authorization: "Bearer " + loginData.token
                }
            })
                .then(function () {
                    fetchPosts();
                })
                .catch(function (error) {
                    console.error("Error unliking post:", error);
                });
        } else {
            fetch(apiBaseURL + "/api/likes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + loginData.token
                },
                body: JSON.stringify({ postId: postId })
            })
                .then(function (response) {
                    return response.json();
                })
                .then(function () {
                    fetchPosts();
                })
                .catch(function (error) {
                    console.error("Error liking post:", error);
                });
        }
    }

    // Function to handle the removal of a post
    function handleRemovePost(event) {
        const postId = event.target.getAttribute("data-id");

        fetch(apiBaseURL + "/api/posts/" + postId, {
            method: "DELETE",
            headers: {
                Authorization: "Bearer " + loginData.token
            }
        })
            .then(function () {
                fetchPosts();
            })
            .catch(function (error) {
                console.error("Error removing post:", error);
            });
    }

    // Show the full post text when "See More" is clicked
    function handleSeeMore(event) {
        const seeMore = event.target;
        const fullText = seeMore.parentElement.nextElementSibling;
        const postText = seeMore.parentElement;

        postText.style.display = "none";
        fullText.style.display = "block";
    }

    // Show the truncated post text when "See Less" is clicked
    function handleSeeLess(event) {
        const seeLess = event.target;
        const postText = seeLess.parentElement.previousElementSibling;
        const fullText = seeLess.parentElement;

        fullText.style.display = "none";
        postText.style.display = "block";
    }

    // Log out the user and redirect to the login page
    loginOutBtn.addEventListener("click", logout);

    // Fetch posts when the sort order changes
    sortOrderSelect.addEventListener("change", fetchPosts);

    // Initial fetch of posts
    fetchPosts();
};