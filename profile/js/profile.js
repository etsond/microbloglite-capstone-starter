"use strict";

window.onload = function () {
    // DOM elements related to the post form
    const postForm = document.getElementById("postForm");
    const postContent = document.getElementById("postContent");
    const postsContainer = document.getElementById("postsContainer");

    // Dom Elements to the profile and logout
    const logoutButton = document.getElementById("logoutButton");
    const usernameElement = document.getElementById("username");
    const fullnameElement = document.getElementById("fullname");
    const profileBioElement = document.getElementById("profileBio");
    const editProfileButton = document.getElementById("editProfileButton");
    const sortOrderSelect = document.getElementById("sortOrder");
    const profileImage = document.getElementById("profileImage");

    // DOM elements for editing the form
    const editProfileForm = document.getElementById("editProfileForm");
    const editFullname = document.getElementById("editFullname");
    const editBio = document.getElementById("editBio");
    // DOM Elemetn to loading screen and main content
    const mainContent = document.getElementById("mainContent");
    const loadingScreen = document.getElementById("loadingScreen");

    // grab the login data from local Storage
    const loginData = getLoginData();

    // redirect to the login page if the user is not logged in
    if (!isLoggedIn()) {
        window.location.href = "../index.html";
        return;
    }

    // Hide loading screen and show main content
    loadingScreen.style.display = "none";
    mainContent.style.display = "block";

    // This function is for fetching the user profile from the api
    // api/users
    function fetchUserProfile() {
        fetch(`${apiBaseURL}/api/users/${loginData.username}`, {
            headers: {
                Authorization: `Bearer ${loginData.token}`
            }
        })
            .then(response => response.json())
            .then(user => {
                // update profile info on the page
                usernameElement.textContent = user.username;
                fullnameElement.textContent = user.fullName;
                profileBioElement.textContent = user.bio;
                profileImage.src = `https://picsum.photos/seed/${user.username}/100`;
                editFullname.value = user.fullName;
                editBio.value = user.bio;
            })
            .catch(error => console.error("Error fetching user profile:", error));
    }

    // function to fetch the user's post from the API
    //api/posts/{postId}

    function fetchUserPosts() {
        fetch(`${apiBaseURL}/api/posts?username=${loginData.username}`, {
            headers: {
                Authorization: `Bearer ${loginData.token}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch user posts.");
                }
                return response.json();
            })
            .then(posts => {
                // sort posts based on the selected order
                const sortOrder = sortOrderSelect.value;
                if (sortOrder === "oldest") {
                    posts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                } else {
                    posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                }
                displayPosts(posts);
            })
            .catch(error => console.error("Error fetching user posts:", error));
    }

    // function to display the user's post on the page
    function displayPosts(posts) {
        postsContainer.innerHTML = "";
        if (posts.length === 0) {
            postsContainer.innerHTML = "<p>No posts to display.</p>";
        } else {
            posts.forEach(post => {
                const postElement = document.createElement("div");
                postElement.className = "post";

                const userLike = post.likes.find(like => like.username === loginData.username);

                // <div class="post">
                //     <div class="d-flex align-items-center mb-2">
                //         <img src="" alt="Profile Picture" class="profile-img">
                //             <div>
                //                 <p><strong>@${post.username}</strong> - ${}</p>
                //             </div>
                //     </div>
                //     <p></p>
                //     <div>
                // sloppy need to make better later

                let postHTML = `
            <div class="d-flex align-items-center mb-2"> <!-- flex container to align the items -->
                <img src="https://picsum.photos/seed/@${post.username}/50" alt="Profile Picture" class="profile-img"> <!--  generate user profile picture-->
                <div>
                <!-- container for username and timeStamo -->
                    <p><strong>@${post.username}</strong> - ${new Date(post.createdAt).toLocaleString()}</p>
                    <!-- show the username and post creating -->
                </div>
            </div>
            <p>${post.text}</p> <!-- display the post content -->
            <div>`;
                // has the current user liked the post

                // <button class="like-button btn btn-outline-primary btn-sm liked" data-id="" data-like-id="">Unlike</button>
                if (userLike) {
                    // add the unlike button if the user has sliked the post
                    postHTML += `<button class="like-button btn btn-outline-primary btn-sm liked" data-id="${post._id}" data-like-id="${userLike._id}">Unlike</button>`;
                } else {
                    //add the like button  if the user has not liked the post

                    // <button class="like-button btn btn-outline-primary btn-sm" data-id="" data-like-id="">Like</button>
                    postHTML += `<button class="like-button btn btn-outline-primary btn-sm" data-id="${post._id}" data-like-id="">Like</button>`;
                }
                // add the remove button to the post
                // <button class="remove-button btn btn-outline-danger btn-sm" data-id="">Remove</button>
                postHTML += `<button class="remove-button btn btn-outline-danger btn-sm" data-id="${post._id}">Remove</button>`;
                // close the buttons container and the post container
                postHTML += `</div></div>`;

                postElement.innerHTML = postHTML;
                postsContainer.appendChild(postElement);
            });
        }
        addPostEventListeners();

    }

    function addPostEventListeners() {
        const likeButtons = document.querySelectorAll(".like-button");
        const removeButtons = document.querySelectorAll(".remove-button");

        likeButtons.forEach(button => button.onclick = handleLikePost);
        removeButtons.forEach(button => button.onclick = handleRemovePost);
    }

    function handleLikePost(event) {
        const button = event.target;
        const postId = button.dataset.id;
        const likeId = button.dataset.likeId;

        button.disabled = true; //disable the button to stop from a lot of clicks

        if (button.classList.contains('liked')) {
            fetch(`${apiBaseURL}/api/likes/${likeId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${loginData.token}`
                }
            })
                .then(() => fetchUserPosts())
                .catch(error => console.error("Error unliking post:", error))
                .finally(() => button.disabled = false); // re-enable the button after request
        } else {
            fetch(`${apiBaseURL}/api/likes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${loginData.token}`
                },
                body: JSON.stringify({ postId })
            })
                .then(response => response.json())
                .then(() => fetchUserPosts())
                .catch(error => console.error("Error liking post:", error))
                .finally(() => button.disabled = false);
        }
    }

    function handleRemovePost(event) {
        const postId = event.target.dataset.id;
        fetch(`${apiBaseURL}/api/posts/${postId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${loginData.token}`
            }
        })
            .then(() => fetchUserPosts())
            .catch(error => console.error("Error removing post:", error));
    }

    postForm.onsubmit = function (event) {
        event.preventDefault();

        const postData = {
            text: postContent.value
        };

        fetch(`${apiBaseURL}/api/posts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${loginData.token}`
            },
            body: JSON.stringify(postData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error(data.error);
                } else {
                    postContent.value = "";
                    fetchUserPosts();
                }
            })
            .catch(error => console.error("Error creating post:", error));
    };

    logoutButton.addEventListener("click", logout);

    editProfileButton.onclick = function () {
        const modal = new bootstrap.Modal(document.getElementById('editProfileModal'), {});
        modal.show();
    }

    sortOrderSelect.addEventListener("change", fetchUserPosts);

    editProfileForm.onsubmit = function (event) {
        event.preventDefault();

        const updatedProfile = {
            fullName: editFullname.value,
            bio: editBio.value
        };

        fetch(`${apiBaseURL}/api/users/${loginData.username}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${loginData.token}`
            },
            body: JSON.stringify(updatedProfile)
        })
            .then(response => response.json())
            .then(user => {
                if (user.error) {
                    console.error(user.error);
                } else {
                    fullnameElement.textContent = user.fullName;
                    profileBioElement.textContent = user.bio;
                    profileImage.src = `https://picsum.photos/seed/${user.username}/100`;
                    const modal = bootstrap.Modal.getInstance(document.getElementById('editProfileModal'));
                    modal.hide();
                }
            })
            .catch(error => console.error("Error updating profile:", error));
    };

    fetchUserProfile();
    fetchUserPosts();
};