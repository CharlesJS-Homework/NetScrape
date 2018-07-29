/* eslint-env es6, browser, jquery */

function addComment(event) {
  event.preventDefault();

  const articleID = $(this).closest('article').attr('article_id');
  const username = $(this).find('[name="username"]').val();
  const body = $(this).find('[name="comment"]').val();
  console.log('okay wtffff');
  $.ajax({
    method: 'POST',
    url: '/api/comment',
    data: { id: articleID, user: username, body },
    complete: () => {
      window.location.reload();
    },
  });
}

function deleteComment(event) {
  event.preventDefault();

  const commentID = $(this).attr('comment_id');
  const articleID = $(this).closest('article').attr('article_id');

  $.ajax({
    method: 'DELETE',
    url: '/api/comment',
    data: { articleID, commentID },
    complete: () => {
      window.location.reload();
    },
  });
}

$(document).ready(() => {
  console.log('get here?');
  $('.comment-form').submit(addComment);
  $('.comment-delete').click(deleteComment);
});
