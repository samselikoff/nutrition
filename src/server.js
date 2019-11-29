import { Server, Model } from "miragejs";
import { buildSchema, graphql } from "graphql";

let graphqlSchema = buildSchema(`
  type Query {
    meals: [Meal]
  }

  type Meal {
    id: ID!
    item: String!
    good: Boolean!
    date: String!
  }
`);

export function makeServer({ environment = "development" } = {}) {
  let server = new Server({
    environment,
    timing: 1000,

    models: {
      meal: Model
    },

    seeds(server) {
      server.create("meal", {
        item: "toast with peanut butter",
        good: true,
        date: "2019-11-17"
      });
      server.create("meal", {
        item: "bacon egg wrap",
        good: true,
        date: "2019-11-17"
      });
      server.create("meal", {
        item: "pad thai",
        good: false,
        date: "2019-11-17"
      });
      server.create("meal", {
        item: "drinks",
        good: false,
        date: "2019-11-17"
      });
      server.create("meal", {
        item: "chicken steak eggs",
        good: true,
        date: "2019-11-16"
      });
      server.create("meal", {
        item: "soup, bread",
        good: true,
        date: "2019-11-16"
      });
      server.create("meal", {
        item: "drinks",
        good: false,
        date: "2019-11-16"
      });
      server.create("meal", {
        item: "chicken pasta",
        good: true,
        date: "2019-11-16"
      });
      server.create("meal", {
        item: "baklava",
        good: false,
        date: "2019-11-16"
      });
    },

    routes() {
      this.post("/graphql", (schema, request) => {
        let requestJson = JSON.parse(request.requestBody);
        let query = requestJson.query;
        let variables = requestJson.variables;

        let resolver = {
          meals() {
            return schema.db.meals;
          }
        };

        return graphql(graphqlSchema, query, resolver, null, variables).then(
          response => {
            return response;
          }
        );
      });
    }
  });

  return server;
}
