'use strict';

function Article (rawDataObj) {
  this.author = rawDataObj.author;
  this.authorUrl = rawDataObj.authorUrl;
  this.title = rawDataObj.title;
  this.category = rawDataObj.category;
  this.body = rawDataObj.body;
  this.publishedOn = rawDataObj.publishedOn;
}

// DONE: Instead of a global `articles = []` array, let's attach this list of all articles directly to the constructor function. Note: it is NOT on the prototype. In JavaScript, functions are themselves objects, which means we can add properties/values to them at any time. In this case, the array relates to ALL of the Article objects, so it does not belong on the prototype, as that would only be relevant to a single instantiated Article.
Article.all = [];

// DONE: Why isn't this method written as an arrow function?
// Because it's a prototype, and arrow functions don't work on prototypes. Also it references 'this', which arrows don't like.
Article.prototype.toHtml = function() {
  let template = Handlebars.compile($('#article-template').text());

  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);

  // DONE: What is going on in the line below? What do the question mark and colon represent? How have we seen this same logic represented previously?
  // This is a ternary operator, it's basically a shortened version of an if/else statement, where the first value after the ? is evaluated as 'true', and the value after the : will run on an 'else'.
  this.publishStatus = this.publishedOn ? `published ${this.daysAgo} days ago` : '(draft)';
  this.body = marked(this.body);

  return template(this);
};

// DONE: There are some other functions that also relate to all articles across the board, rather than just single instances. Object-oriented programming would call these "class-level" functions, that are relevant to the entire "class" of objects that are Articles.

// DONE: This function will take the rawData, however it is provided, and use it to instantiate all the articles. This code is moved from elsewhere, and encapsulated in a simply-named function for clarity.

// DONE: Where is this function called? What does 'rawData' represent now? How is this different from previous labs?
// rawData represents our local storage data. This is different because before we didn't have local storage/persistence. loadAll is called in fetchAll, because we need to verify if local storage exists before we can render.
Article.loadAll = articleData => {
  articleData.sort((a,b) => (new Date(b.publishedOn)) - (new Date(a.publishedOn)))

  articleData.forEach(articleObject => Article.all.push(new Article(articleObject)))
}

// DONE: This function will retrieve the data from either a local or remote source, and process it, then hand off control to the View.
Article.fetchAll = () => {
  // DONE: What is this 'if' statement checking for? Where was the rawData set to local storage?
  if (localStorage.rawData) {
    let retrievedData = localStorage.getItem('rawData');
    Article.all = [];
    Article.loadAll(JSON.parse(retrievedData));
    articleView.initIndexPage();
  } else {
    $.getJSON('/data/hackerIpsum.json', data => {
      Article.all=[];
      Article.loadAll(data);
      localStorage.setItem('rawData', JSON.stringify(data));
      articleView.initIndexPage();
    });
  }
}