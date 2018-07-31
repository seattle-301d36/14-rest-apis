'use strict';
var app = app || {};

(function(module) {
  $('.icon-menu').on('click', () => {
    $('.nav-menu').slideToggle(350);
  })

  const bookView = {};

  bookView.initIndexPage = (ctx, next) => {
    $('#book-list').empty();
    app.showOnly('.book-view');
    module.Book.all.forEach(book => $('#book-list').append(book.toHtml()));
    next();
  }

  bookView.initDetailPage = (ctx, next) => {
    $('.book-detail').empty();
    app.showOnly('.detail-view');

    $('.book-detail').append(app.render('book-detail-template', ctx.book));

    $('#update-btn').on('click', () => {
      page(`/books/${$(this).data('id')}/update`);
    });

    $('#delete-btn').on('click', () => {
      module.Book.destroy($(this).data('id'));
    });
    next();
  }

  bookView.initCreateFormPage = () => {
    app.showOnly('.create-view');

    $('#create-form').on('submit', (event) => {
      event.preventDefault();

      let book = {
        title: event.target.title.value,
        author: event.target.author.value,
        isbn: event.target.isbn.value,
        image_url: event.target.image_url.value,
        description: event.target.description.value,
      };

      module.Book.create(book);
    })
  }

  bookView.initUpdateFormPage = function(ctx) {
    app.showOnly('.update-view');

    $('#update-form input[name="title"]').val(ctx.book.title);
    $('#update-form input[name="author"]').val(ctx.book.author);
    $('#update-form input[name="isbn"]').val(ctx.book.isbn);
    $('#update-form input[name="image_url"]').val(ctx.book.image_url);
    $('#update-form textarea[name="description"]').val(ctx.book.description);

    $('#update-form').on('submit', function(event) {
      event.preventDefault();

      let book = {
        book_id: ctx.book.book_id,
        title: event.target.title.value,
        author: event.target.author.value,
        isbn: event.target.isbn.value,
        image_url: event.target.image_url.value,
        description: event.target.description.value,
      };

      module.Book.update(book, book.book_id);
    })
  };

// COMMENT: What is the purpose of this method?
  // ANS: This responds to routing which is setup in the route.js, after the user selects 'search g-books' from the
  // nav menu. It will show the book search container with class '.search-view'. It also sets up an event handler
  // for when the user clicks the submit button.
  bookView.initSearchFormPage = () => {
    app.showOnly('.search-view');

    $('#search-form').on('submit', function(event) {
      // COMMENT: What default behavior is being prevented here?
      // ANS: It prevents the page from reloading.
      event.preventDefault();

      // COMMENT: What is the event.target, below? What will happen if the user does not provide the information needed for the title, author, or isbn properties?
      // ANS: The target is the DOM element that is the subject of the event.
      let book = {
        title: event.target.title.value || '',
        author: event.target.author.value || '',
        isbn: event.target.isbn.value || '',
      };

      module.Book.find(book, bookView.initSearchResultsPage);

      // COMMENT: Why are these values set to an empty string?
      // ANS: I think this will clear the search fields.
      event.target.title.value = '';
      event.target.author.value = '';
      event.target.isbn.value = '';
    })
  }

  // COMMENT: What is the purpose of this method?
  // ANS: This shows the HTML container of the search results. It's displaying the book search results.
  bookView.initSearchResultsPage = () => {
    app.showOnly('.search-results');
    $('#search-list').empty();

    // COMMENT: Explain how the .forEach() method is being used below.
    // ANS: It's being used to loop through a set of Book objects. It's rendering the html and appending it to the
    // search list container.
    module.Book.all.forEach(book => $('#search-list').append(book.toHtml()));
    $('.detail-button a').text('Add to list').attr('href', '/');
    $('.detail-button').on('click', () => {
      // COMMENT: Explain the following line of code.
      // ANS: It's invoking the Book function 'findOne', with the isdn number as the arguement. It's retrieving
      // it by navigating up several levels in the DOM to the book container, and grabbing a data attribute value
      // for key 'bookid'. It's basically a retrieve with unique key, as opposed to the other find function, which
      // is more of a search feature based on author or title.
      module.Book.findOne($(this).parent().parent().parent().data('bookid'))
    });
  }

  module.bookView = bookView;
})(app)

