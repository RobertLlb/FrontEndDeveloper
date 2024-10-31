
document.addEventListener('DOMContentLoaded', () => {
    // Like button functionality
    const likeButtons = document.querySelectorAll('.like-btn');
    likeButtons.forEach(button => {
      button.addEventListener('click', () => {
        button.classList.toggle('liked');
        const currentLikes = parseInt(button.textContent.split(' ')[1]);
        const isLiked = button.classList.contains('liked');
        button.textContent = `❤️ ${isLiked ? currentLikes + 1 : currentLikes - 1}`;
      });
    });

    // Post form functionality
    const postForm = document.querySelector('.post-form');
    const postInput = document.querySelector('.post-input');
    const postButton = postForm.querySelector('.btn-primary');

    postButton.addEventListener('click', () => {
      const content = postInput.value.trim();
      if (content) {
        const newPost = createPost({
          username: 'John Doe',
          handle: '@johndoe',
          content: content,
          timeAgo: 'just now'
        });

        document.querySelector('.posts').prepend(newPost);
        postInput.value = '';
      }
    });

    function createPost(postData) {
      const post = document.createElement('div');
      post.className = 'post';
      post.innerHTML = `
    <div class="post-header">
      <div class="post-avatar"></div>
      <div>
        <div><strong>${postData.username}</strong></div>
        <div class="post-meta">${postData.handle} · ${postData.timeAgo}</div>
      </div>
    </div>
    <div class="post-content">
      ${postData.content}
    </div>
    <div class="post-actions">
      <button class="like-btn">❤️ 0</button>
      <button>💬 0</button>
      <button>🔄 0</button>
    </div>
  `;

      const likeBtn = post.querySelector('.like-btn');
      likeBtn.addEventListener('click', () => {
        likeBtn.classList.toggle('liked');
        const currentLikes = parseInt(likeBtn.textContent.split(' ')[1]);
        const isLiked = likeBtn.classList.contains('liked');
        likeBtn.textContent = `❤️ ${isLiked ? currentLikes + 1 : currentLikes - 1}`;
      });

      return post;
    }

    // Hashtag system
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('hashtag')) {
        const tag = e.target.textContent.substring(1);
        alert(`Exploring posts tagged with ${tag}`);
      }
    });
  });
