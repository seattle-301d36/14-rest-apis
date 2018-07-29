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
// TYLER: The below method reveals the search page and on submit of the form creates a book object based on user input and passes that into the Book.find function along with initSearchResultsPage.
  bookView.initSearchFormPage = () => {
    app.showOnly('.search-view');

    $('#search-form').on('submit', function(event) {
      // COMMENT: What default behavior is being prevented here?
      // TYLER: This is to prevent the browser from reloading on click/submit event
      event.preventDefault();

      // COMMENT: What is the event.target, below? What will happen if the user does not provide the information needed for the title, author, or isbn properties?
      // TYLER: Event.target is getting the value from the title, author, and isbn inputs. If there is no input, it will have an empty string.
      let book = {
        title: event.target.title.value || '',
        author: event.target.author.value || '',
        isbn: event.target.isbn.value || '',
      };

      module.Book.find(book, bookView.initSearchResultsPage);

      // COMMENT: Why are these values set to an empty string?
      // TYLER: So that the input values are reset after the search has run and results are shown.
      event.target.title.value = '';
      event.target.author.value = '';
      event.target.isbn.value = '';
    })
  }

  // COMMENT: What is the purpose of this method?
  // TYLER: This method is meant to reveal search results returned in the Book.find method above.
  bookView.initSearchResultsPage = () => {
    app.showOnly('.search-results');
    $('#search-list').empty();

    // COMMENT: Explain how the .forEach() method is being used below.
    // TYLER: This is looping through the array of Book objects; for each book we're rendering it with the toHtml method (handlebars) and appending it to the search-list id. Then the detail button is filled in and a click event for it is registered that runs the findOne method in order to view book details (this happens for every book in the array).
    module.Book.all.forEach(book => $('#search-list').append(book.toHtml()));
    $('.detail-button a').text('Add to list').attr('href', '/');
    $('.detail-button').on('click', () => {
      // COMMENT: Explain the following line of code.
      // TYLER: This is invoking the findOne method and the argument passed in finds the 3rd level parent element (which is the li tag with the bookid data attribute) and passes that data value as the argument.
      module.Book.findOne($(this).parent().parent().parent().data('bookid'))
    });
  }

  module.bookView = bookView;
})(app)

