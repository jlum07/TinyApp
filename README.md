# TinyApp Project

TinyApp is a web project URL shortener built with Node and Express.

## Final Product
- Need to upload screenshots

## Dependancies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Install all dependancies (using 'npm install' command).
- Run the development web server using the 'node express_server.js' command.

## Todo List

- Look into using hash for short URL instead of random string generator. That way all URLs the same website will show the same short URL. Also look into whether 6 character base62 is enought to avoid collisions.
- Probably should remove ability to edit links to short URLs. This ability could definitly be abused.
- An actual DB of some sort? One day I'm sure...
- Implement tracking of unique visitor count. So far have the ground work done with cookies but need to work on the display output.
- Possibly get rid of copy to clipboard alert. It's kind of annoying.
- More styling... always more styling :(
