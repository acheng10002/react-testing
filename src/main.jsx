import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  App,
  Login,
  MyComponent,
  SimulateUserEvent,
  Accordion,
  OptionsComponent,
  PointerComponent,
  KeyboardComponent,
  ClipboardComponent,
  UtilityAPIsComponent,
} from "./App.jsx";

const items = [
  {
    title: "Section 1",
    contents: "This is the content for section 1.",
  },
  {
    title: "Section 2",
    contents: "This is the content for section 2.",
  },
  {
    title: "Section 3",
    contents: "This is the content for section 3.",
  },
];

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <Login />
    <MyComponent />
    <SimulateUserEvent />
    <Accordion items={items} />
    <OptionsComponent />
    <PointerComponent />
    <KeyboardComponent />
    <ClipboardComponent />
    <UtilityAPIsComponent />
  </StrictMode>
);

/* useEffect - for simpler, combined logic in function components, 
               especially when I want fine-grained control over
               dependencies or need to clean up resources
examples:
1. if I need to fetch data on mount, update the component when
   dependencies change, and clean up a subscription on unmount
2. when I am running an API call only when certain props change,
   rather than re-running on every render
3. side effects -logging, data fetching, updating document titles,
   can all be managed with useEffect, making function components
   simpler and easier to test
4. closing WebSocket connections, unsubscribing from services, or
   clearing intervals can all be done in one place within the 
   useEffect return function
5. re-fetching data only when a specific prop or state variable 
   changes, like a filter or a search term 
lifecycle methods - in class components, can be better for more
                    predictable timing, avoid dependency arrays,
                    or when specific lifecycle phases and error 
                    boundaries are essential 
examples: 
1. when I need to execute code only after the component has fully
   mounted, componentDidMount ensures it runs strictly after the
   initial render
2. for modals and tooltips, componentDidMount can ensure measure-
   ments are ready before any updates are shown on screen
3. complex state calculations or subscriptions may be easier to
    manage in lifecycle methods, avoiding the need to include a
    long list of dependencies
4. shouldComponentUpdate can be used to conditionally prevent 
   updates based on complex logic
5. if I need a component to handle and recover from error, components
   with lifecycle methods like componentDidCatch are required 
   
   pub/sub system 
   OAuth 2.0
   SMTP and POP 
   ORMs 
   spaghetti code 
   P95 duration 


What is Snapshot Testing? 
- unit and functional tests make assertions about the correct behavior of
  an app, snapshot tests only assert that the output now is the same as the
  output before
- front-end tests typically focus on two things: data (serializable JS values
  and images)
- snapshot tests work for serializable JS values, but are most commonly applied
  to the DOM-based render trees of React components

How Snapshot Testing Works 
- first time a test is run, the .toMatchSnapshot expectation saves the data it 
receives to a file, ex. a serialized render tree
- later test runs, current value of data is compared to the stored "good" one
- snapshots will eventually get out of sync with the components they represent
  and will have to get updated

The Benefits of Snapshot Testing
- snapshot tests are typically much shorter and easier to write
- they're also easy to keep up to date as developers generally just need to run
  a single command to get the testing system to record new snapshots

Tools for Snapshot Testing 

The Drawbacks of Snapshot Testing
- since snapshot tests are too tightly coupled to an application's output, they are
  very fragile 
- snapshot tests aren't inherently well suited to dynamic content
  Jest does have "asymmetric matchers" that can be used when creating snapshots to
  identify elements with properties that may vary from test session to test session
- snapshot tests have storage requirements
  they're typically checked into the project repository  
  
React Testing Library, works alongside Jest and Vite, alternative to Enzyme 
React Context
React Redux
React Router
React Router 
React Fetch 

first use npm to add react-testing-library 
also add jest-dom package, to get expect assertions 
ex. expect the component to have this text content
    expect the h2 tag to have a certain class or attribute */
