// State
let isLiked = false;
let isSaved = false;
let likesCount = 19432;

// Elements
const likeBtn = document.getElementById('like-btn');
const saveBtn = document.getElementById('save-btn');
const likesCountEl = document.getElementById('likes-count');
const commentInput = document.getElementById('comment-input');
const commentsList = document.getElementById('comments-list');
const heartOverlay = document.querySelector('.heart-overlay');
const shareModal = document.getElementById('share-modal');

// Functions

function toggleLike() {
    isLiked = !isLiked;
    const outline = likeBtn.querySelector('.outline');
    const filled = likeBtn.querySelector('.filled');

    if (isLiked) {
        outline.style.display = 'none';
        filled.style.display = 'block';
        likesCount++;
        // Optional: Vibration for mobile feel
        if (navigator.vibrate) navigator.vibrate(50);
    } else {
        outline.style.display = 'block';
        filled.style.display = 'none';
        likesCount--;
    }
    updateLikesText();
}

function updateLikesText() {
    likesCountEl.innerText = `${likesCount.toLocaleString()} likes`;
}

function toggleSave() {
    isSaved = !isSaved;
    const outline = saveBtn.querySelector('.outline');
    const filled = saveBtn.querySelector('.filled');

    if (isSaved) {
        outline.style.display = 'none';
        filled.style.display = 'block';
    } else {
        outline.style.display = 'block';
        filled.style.display = 'none';
    }
}

function handleDoubleClick() {
    // Show overlay animation
    heartOverlay.classList.remove('active');
    void heartOverlay.offsetWidth; // Trigger reflow
    heartOverlay.classList.add('active');

    // Like if not already liked
    if (!isLiked) {
        toggleLike();
    }
}

function addComment() {
    commentInput.focus();
}

function postComment() {
    const text = commentInput.value.trim();
    if (text) {
        const commentDiv = document.createElement('div');
        commentDiv.classList.add('comment');
        
        // Simulating current user ("you")
        commentDiv.innerHTML = `
            <span class="comment-user">you</span>
            <span class="comment-text">${escapeHtml(text)}</span>
        `;
        
        commentsList.appendChild(commentDiv);
        commentInput.value = '';
        commentsList.scrollTop = commentsList.scrollHeight; // Scroll to bottom
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
}

// Enter key to submit comment
commentInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        postComment();
    }
});

function sharePost() {
    // Check if Web Share API is available (usually mobile only)
    if (navigator.share) {
        navigator.share({
            title: 'Instagram Card',
            text: 'Check out this cool post!',
            url: window.location.href,
        }).catch(console.error);
    } else {
        // Fallback to modal
        shareModal.style.display = "flex";
    }
}

function closeModal() {
    shareModal.style.display = "none";
}

function copyLink() {
    // Dummy link copy
    const dummyLink = "https://instagram.com/p/B8pE8z/";
    navigator.clipboard.writeText(dummyLink).then(() => {
        alert("Link copied to clipboard!");
        closeModal();
    }).catch(() => {
        alert("Failed to copy link.");
    });
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target == shareModal) {
        closeModal();
    }
}
