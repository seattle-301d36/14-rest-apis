'use strict';

var app = app || {};

(function(module) {
  function errorCallback(err) {
    console.error(err);
    module.errorView.initErrorPage(err);
  }

  function Book(rawBookObj) {
    Object.keys(rawBookObj).forEach(key => this[key] = rawBookObj[key]);
  }

  Book.prototype.toHtml = function() {
    return app.render('book-list-template', this);
  }

  Book.all = [];
  
  Book.loadAll = rows => Book.all = rows.sort((a, b) => b.title - a.title).map(book => new Book(book));
  
  Book.fetchAll = callback =>
    $.get(`${app.ENVIRONMENT.apiUrl}/api/v1/books`)
      .then(Book.loadAll)
      .then(callback)
      .catch(errorCallback);

  Book.fetchOne = (ctx, callback) =>
    $.get(`${app.ENVIRONMENT.apiUrl}/api/v1/books/${ctx.params.book_id}`)
      .then(results => ctx.book = results[0])
      .then(callback)
      .catch(errorCallback);

  Book.create = book =>
    $.post(`${app.ENVIRONMENT.apiUrl}/api/v1/books`, book)
      .then(() => page('/'))
      .catch(errorCallback);

  Book.update = (book, bookId) =>
    $.ajax({
      url: `${app.ENVIRONMENT.apiUrl}/api/v1/books/${bookId}`,
      method: 'PUT',
      data: book,
    })
      .then(() => page(`/books/${bookId}`))
      .catch(errorCallback)

  Book.destroy = id =>
    $.ajax({
      url: `${app.ENVIRONMENT.apiUrl}/api/v1/books/${id}`,
      method: 'DELETE',
    })
      .then(() => page('/'))
      .catch(errorCallback)

  // COMMENT: Where is this method invoked? What is passed in as the 'book' argument when invoked? What callback will be invoked after Book.loadAll is invoked?
  // This method is being invoked in the the bookView function. The argument passed into book is a string, which is passed as a query on the server side. The callback that is invoked after Book.loadAll is bookView.initSearchPage, which shows the search results.
  Book.find = (book, callback) =>
    $.get(`${app.ENVIRONMENT.apiUrl}/api/v1/books/find`, book)
      .then(Book.loadAll)
      .then(callback)
      .catch(errorCallback)

  // COMMENT: Where is this method invoked? How does it differ from the Book.find method, above?
  // This method is invoked inside the bookView.initSearchPage. After searching for a book, the user will see a list of possible results. Clicking on one will run this function (thanks to an event handler). The server will then return the detail for that specific book.
  Book.findOne = isbn =>
    $.get(`${app.ENVIRONMENT.apiUrl}/api/v1/books/find/${isbn}`)
      .then(Book.create)
      .catch(errorCallback)

  module.Book = Book;
})(app)
