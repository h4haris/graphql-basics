const express = require("express");
const { buildSchema } = require("graphql")
const { graphqlHTTP } = require("express-graphql");
const axios = require("axios");

const app = express();

/*
*Basic Types Supported
! ID
! String
! Int
! Float
! Boolean
! List - [String] , [User]
*/

let message = "This is a message";

// * Schema
const schema = buildSchema(`
    type Post{
        userId: Int
        id: Int
        title: String
        body: String
    }

    type User{
        name: String
        age: Int
        college: String
    }

    input UserInput{
        name: String!
        age: Int!
        college: String!
    }

    type Query{
        hello: String!
        welcomeMessage(name: String, dayOfWeek: String!): String
        getUser: User
        getUsers: [User]
        getPostsFromExternalAPI: [Post]
        message: String
    }

    type Mutation{
        setMessage(newMessage: String!): String
        createUser(user: UserInput): User
    }
`);
// createUser(name: String!, age: Int!, college: String!): User


//* resolver
const root = {
    hello: () => {
        // return null;
        return 'Hello World!';
    },
    welcomeMessage: (args) => {
        console.log(args)
        return `Hey ${args.name}! Hows life, today is ${args.dayOfWeek}`;
    },
    getUser: () => {
        const user = {
            name: 'Haris',
            age: 26,
            college: 'ABC'
        }
        return user;
    },
    getUsers: () => {
        const users = [{
                name: 'Haris',
                age: 26,
                college: 'ABC'
            },
            {
                name: 'John',
                age: 30,
                college: 'XYZ'
            }
        ]
        return users;
    },
    getPostsFromExternalAPI: async() => {
        //* Without asycn await
        // return axios.get('http://jsonplaceholder.typicode.com/posts').then(result => result.data);

        //* With asycn await
        const result = await axios.get('http://jsonplaceholder.typicode.com/posts');
        return result.data;
    },
    setMessage: ({ newMessage }) => {
        message = newMessage;
        return message;
    },
    message: () => message,
    //* Without Input Type
    // createUser: ({ name, age, college }) => {
    //     //create a new user inside db or external api or even firestore
    //     return { name, age, college };
    // },
    //* With Input Type
    createUser: (args) => {
        console.log(args);
        //create a new user inside db or external api or even firestore
        return args.user;
    }
}

app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema: schema,
    rootValue: root
}));

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`)
})