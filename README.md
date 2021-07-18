# GitScraping 1.0
## This project is a web scraping that scrape a project in GitHub and return the number of files per extension and total lines of each extension and the total bytes
<p align="center">The easier API to get GitHub content, I'll show you!!</p>
<h4 align="center"> 
🚀 Let's start!!
</h4>
<h4>To get the data about the file information, amount of each type of extension, lines an bytes of each then, just do a GET request to this API /Name of Git Author/Project Name</h4>
<h4>Example:

- To get the response about my example project: https://github.com/kelvinludwig/OnePiece

- send a get request with Api Link/kelvinludwig/OnePiece and get what you need!!

Very simple, isn't??

</h4>

### Data
- [x] Extension
- [x] Count
- [x] Lines
- [x] Bytes


### Dev Infos

Before we start you will need to have in your envioroment the following tools:
[Git](https://git-scm.com), [Node.js](https://nodejs.org/en/). 
Furthermore it's nice to have a good code editor: [VSCode](https://code.visualstudio.com/).
This project use just the axios like dependencie, I tried to make it cleanest as possible!
I could have used the [Express](https://expressjs.com/pt-br/) to build the server, or [Mocha](https://mochajs.org/) to build test, or [Cheerion](https://www.npmjs.com/package/cheerio) to build the scraper, but the intent of this project was to be the most clean as possible using Node.Js, even so I used the [Axios](https://www.npmjs.com/package/axios) to do my requests because they have a treatment better than the native Http from Node.js.

### 🎲 Starting the server

```bash
# Clone este repositório
$ git clone <https://github.com/kelvinludwig/gitscraping.git>

# Go to project folder
$ cd gitscraping

# Install the dependencies
$ npm install
or
$ yarn

# Start the server
$ yarn start
or
$ npm start

# The server will be available in port :8080 - acesse <http://localhost:8080>
```
