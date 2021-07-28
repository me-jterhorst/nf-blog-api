const express = require("express");
const db = require("./lib/db");

/*
  We create an express app calling
  the express function.
*/
const app = express();

/*
  We setup middleware to:
  - parse the body of the request to json for us
  https://expressjs.com/en/guide/using-middleware.html
*/
app.use(express.json());

/*
  Endpoint to handle GET requests to the root URI "/"
*/
app.get("/", (req, res) => {
  res.json({
    "/articles": "read and create new articles",
    "/articles/:id": "read, update and delete an individual article",
  });
});

app.get("/articles", (req, res) => {
  db.findAll()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((error) => res.status(500).send(error));
});

app.get("/articles/:articleId", (req, res) => {
  const id = req.params.articleId;
  db.findById(id)
    .then((data) => {
      if (data) {
        res.status(200).send(data);
      } else {
        res.status(404).end();
        return;
      }
    })
    .catch(() => res.status(500).end());
});

// ========================================  POST
app.post("/", (req, res) => {
  res.send("Hello");
});

app.post("/articles", (req, res) => {
  db.insert({ title: "A Title", body: "some content" })
    .then((newPost) => {
      if (newPost) {
        if (typeof newPost === "object") {
          res.status(201).send(newPost);
        } else {
          res.status(406).send("The submission should only contain objects");
        }
      } else {
        res.status(406).send("No empty submissions");
      }
    })
    .catch((error) => {
      console.error(error);
    });
});

// ========================================  PATCH

app.patch("/articles/:articleId", (req, res) => {
  const id = req.params.articleId;
  const content = req.body;

  db.updateById(id, content)
    .then((data) => {
      if (data) {
        res.status(200).send(data);
      } else {
        throw new Error("missing");
      }
    })
    .catch(() => res.status(500).end());
});

// ======================================== DELETE

app.delete("/articles/:articleId", (req, res) => {
  const id = req.params.articleId;
  db.deleteById(id)
    .then(() => res.status(204).end())
    .catch(() => {
      res.status(500).end();
    });
});
/*
  We have to start the server. We make it listen on the port 4000

*/
app.listen(4000, () => {
  console.log("Listening on http://localhost:4000");
});
