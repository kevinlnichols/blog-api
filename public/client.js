var blogTemplate = (
    '<li class="js-blog-item">' +
        '<p><span class="blog-item js-blog-item-name"></span></p>' +
        '<div class="blog-item-controls">' +
            '<button class="js-blog-item-toggle">' +
                '<span class="button-label">update</span>' +
            '</button>' +
            '<button class="js-blog-item-delete">' +
                '<span class="button-label">delete</span>' +
            '</button>' +
        '</div>' +
    '</li>'
);

var BLOG_URL = '/blog-posts';

function displayBlogPosts () {
    $.getJSON(BLOG_URL, function(blogPosts) {
        var blogElement = blogPosts.map(function(blogPosts) {
            var element = $(blogTemplate);
            element.attr('id', post.id);
            var postTitle = element.find('.js-blog-item-name');
            postTitle.text(post.Title);
            element.attr('data-checked', post.checked);
            if (post.checked) {
                postTitle.addClass('blog-item_checked');
            }
            return element;
        });
        $('.js-blog-list').html(blogElement);
    });
}

function addBlogPost(post) {
    console.log('Adding blog post: ' + post);
    $.ajax({
      method: 'POST',
      url: BLOG_URL,
      data: JSON.stringify(post),
      success: function(data) {
        displayBlogPosts();
      },
      dataType: 'json',
      contentType: 'application/json'
    });
  }

function deleteBlogPost(id) {
    console.log('Deleting blog post `' + id + '`');
    $.ajax({
        url: BLOG_URL + '/' + id,
        method: 'DELETE',
        success: displayBlogPosts
    });
}

function updateBlogPost(post) {
    console.log('Updating blog post `' + post.id + '`');
    $.ajax({
      url: BLOG_URL + '/' + post.id,
      method: 'PUT',
      data: JSON.stringify(post),
      success: function(data) {
        displayBlogPosts()
      },
      dataType: 'json',
      contentType: 'application/json'
    });
}

  function handleBlogPostAdd() { 
    $('#blog-entry-form').submit(function(e) {
    e.preventDefault();
    addBlogPost({
        title: $(e.currentTarget).find('#title').val(),
        content:  $(e.currentTarget).find('#content').val(),
        author: $(e.currentTarget).find('#author').val(),
    });
    });
}

function handleBlogDelete() {
    $('.js-blog-list').on('click', '.js-blog-item-delete', function(e) {
      e.preventDefault();
      deleteBlogPost(
        $(e.currentTarget).closest('.js-blog-item').attr('id'));
    });
  }


  $(function() {
    addBlogPost();
    displayBlogPosts();
    handleBlogPostAdd();
    handleBlogDelete();
  });