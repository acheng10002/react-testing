import React from "react";
import { describe, it, expect, test, SnapshotSerializer, vi } from "vitest";
// @testing-library/react gives me access to functions like render
// cleanup is way to get rid of the "garbage" react testing library creates when it tests
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { getByLabelText, getDefaultNormalizer } from "@testing-library/dom";
// import renderHTML from "react-render-html";
import userEvent from "@testing-library/user-event";
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
  Header,
} from "../App.jsx";

afterEach(cleanup);
/*
// describe is a test suite
describe("something truthy and falsy", () => {
  // it is a test case
  it("true to be true", () => {
    // expect is an assertion
    expect(true).toBe(true);
  });

  it("false to be false", () => {
    expect(false).toBe(false);
  });
});

describe("App", () => {
  it("renders headline", () => {
    render(<App title="REACT" />);

    // expect(true).toBe(true);
    // render(<App />);

    screen.debug();

    // check if App component renders headline
    expect(screen.getByText(/Vite \+ REACT/i)).toBeInTheDocument();
  });
});
*/

describe("App component", () => {
  it("renders correct heading", () => {
    // render the component
    render(<App />);
    /* API returns an object and I use destructuring syntax to obtain a subset 
    of the methods required 
    getByRole is one of a dozen query methods I could've used 
    queries - methods that Testing Library gives me to find elements on the page
    3 types of queries: getBy, queryBy, and findBy 
    after selecting an element, I can use the EventsAPI or user-event to fire events and simulate
    user interactions with the page or use Jest and jest-dom to make assertions about the element
    ByRole methods are favored methods for querying, especially when paired with the name option */
    expect(screen.getByRole("heading").textContent).toMatch(/my first test/i);
  });
});

/* ByRole methods are favored methods for querying, especially when paired with the name option 
queries done through ByRole ensure that my UI is accessible to everyone no matter what mode 
they use to navigate the webpage (i.e. mouse or assistive technologies) */
describe("App component", () => {
  it("renders correct heading", () => {
    render(<App />);
    // this query has improved specificity
    expect(screen.getByRole("heading", { name: "My First Test" }));
  });
});

/* helper methods that work with queries 
- async APIs like waitFor or findBy queries can be used to await the changes in the DOM as elements
  appear and disappear
- within, to find only elements that are children of a specific element
*/

test("should show login form", () => {
  render(<Login />);
  const input = screen.getByLabelText("Username");
  // events and assertions
});

/* types of queries
getBy... : for 0 matches - throw error
           for 1 match - return element
           for > 1 matches - throw error
           Retry (Async/Await) - no
queryBy... : for 0 matches - return null
           for 1 match - return element
           for > 1 matches - throw error 
           Retry (Async/Await) - no
findBy... : for 0 matches - throw error
           for 1 match - return element
           for > 1 matches - throw error
           Retry (Async/Await) - yes
getAllBy... : for 0 matches - throw error
           for 1 match - return array
           for > 1 matches - return array
           Retry (Async/Await) - no
queryAllBy... : for 0 matches - return []
           for 1 match - return array
           for > 1 matches - return array
           Retry (Async/Await) - no
findAllBy... : for 0 matches - throw error
           for 1 match - return array
           for > 1 matches - return array
           Retry (Async/Await) - yes

priority
1. Queries Accessible to Everyone
   - getByRole(ex. getByRole('button', {name: /submit/i}))
   - getByLabelText - good for form fields
   - getByPlaceholderText - *a placeholder is not a substitute for a label
   - getByText - for non-interactive elements (like di vs, spans, and paragraphs)
   - betByDisplayValue - current value of a form element
2. Semantic Queries - HTML5 and ARIA compliant selectors
   - getByAltText - if my element is one which supports alt text (img, area, input, custom element)
   - getByTitle - not consistenly read by screenreaders
3. Test IDs
   - getByTestId - only recommended for cases where I can't match by role or text or 
     it doesn't make sense

primary argument to a query can be a string, regex, or function
there are options to adjust how node text is parsed */

test("test query", () => {
  render(<Login />);
  // with screen
  const inputNode = screen.getByLabelText("Username");

  // without screen, I need to provide a container
  const container = document.querySelector("#app");
  const inputNode2 = getByLabelText(container, "Username");
});

render(
  <div>
    <label htmlFor="example">Example</label>
    <input id="example" />
  </div>
);

const exampleInput = screen.getByLabelText("Example");

render(<div>Hello World</div>);

// will find the div
// matching a string:
// full string match
screen.getByText("Hello World");
// substring match
/* queries that take a TextMatch also accept an object as a final 
argument that can contain options that affect the prevision of 
string matching 
exact - defaults to true, matches full strings, case sensitibve
        when false, matches substrings and is not case-sensitive
  - has no effect when used together with regex or fuction arg
  - using a regex combined with { exact: false } gives me more 
    control over fuzzing matching, so it should be preferred
normalizer - option that overrides normalization behavior */
screen.getByText("llo Worl", { exact: false });
// ignore case
screen.getByText("hello world", { exact: false });

/* DOM Testing Library automatically normalizes the text before
running any matching logic against it 
normalization trims whitespace from the start and end of text
and collapses multiple adjacent whitespace characters within 
the string into a single space 
I can provide a normalizer function in the options object 
  it will be given a string and it is expected to return a 
  normalized version of that string */

// performs a match against text without trimming
test("query with normalization", () => {
  render(<div>Hello World</div>);
  screen.getByText("Hello World", {
    normalizer: getDefaultNormalizer({ trim: false }),
  });
});

/* override normalization to remove some Unicode whilst keeping
some of the built-in normalization behavior */
test("query with normalization", () => {
  render(<div>Hello World</div>);
  screen.getByText("Hello World", {
    normalizer: (str) =>
      getDefaultNormalizer({ trim: false })(str).replace(
        /[\u200E-\u200F]*/g,
        ""
      ),
  });
});

// matching a regex:
// substring match
screen.getByText(/World/);
// substring match, ignore case
screen.getByText(/world/i);
// full string match, ignore case
screen.getByText(/^hello world$/i);
// substring match, ignore case, searches for "hello world" or "hello orld"
screen.getByText(/Hello W?oRlD/i);

// matching with a custom function
screen.getByText((content, element) => content.startsWith("Hello"));

/*
// will not find the div
// full string does not match
test("query that fails 1", () => {
  render(<div>Hello World</div>);
  screen.getByText("Goodbye World");
});

// case-sensitive regex with different case
test("query that fails 2", () => {
  render(<div>Hello World</div>);
  screen.getByText(/hello world/);
});

// function looking for a span when it's actually a div
test("query that fails 3", () => {
  render(<div>Hello World</div>);
  screen.getByText((content, element) => {
    return (
      element.tagName.toLowerCase() === "span" && content.startsWith("Hello")
    );
  });
});
*/

/* I can use the regular querySelector DOM API to query elements
this is an escape hatch to query by class or id and is not recommended */
const { container } = render(<MyComponent />);
const foo = container.querySelector('[data-foo="bar"]');

/* DOM API is provided by the browser and allows JS to interact with and
manipulate HTML and XML documents dynamically
escape hatch - workaround that allows dev to bypass a system's usual restrictions */

describe("App component", () => {
  // first test, utilize snapshots to check whether all nodes render as I expect them to
  /* snapshot testing - comparing my rendered component with an associated snapshot file 
  this is the snapshot file automatically generated after I run this test
  // Vitest Snapshot v1, https://vitest.dev/guide/snapshot.html

exports[`App component > renders magnificent monkeys 1`] = `
<div>
  <button
    type="button"
  >
    Click Me
  </button>
  <h1>
    Magnificent Monkeys
  </h1>
</div>
`;
  */
  it("renders magnificent monkeys", () => {
    /* since screen does not have the container property, I'll destructure render
    to obtain a container for this test 
    React Testing Library provides the screen object which has all the methods 
    for querying
    with screen, I don't have to worry about keeping render's destructuring up-to-date 
    it's better to use screen to access queries rather than to destructure render 
    toMatchSnapshot() spares me of asserting the existence of the button and the heading */
    const { container } = render(<App />);
    expect(container).toMatchSnapshot();
  });
});

test("updates heading to 'Radical Rhinos' after button click", () => {
  // Render the component
  render(<SimulateUserEvent />);

  // Ensure the initial heading is correct
  expect(screen.getByRole("heading").textContent).toBe("Magnificent Monkeys");

  // Find the button and simulate a click using fireEvent
  const button = screen.getByRole("button", { name: "Click Me" });
  fireEvent.click(button);

  // Verify that the heading text changes to 'Radical Rhinos'
  expect(screen.getByRole("heading").textContent).toBe("Radical Rhinos");
});

/* after every test, React Testing Library unmounts the rendered components,
why I render for each test
for a lot of tests for a component, the beforeEach Vitest function could be handy 

snapshot - HTML representation of the component
snapshot will be compared against the component in future snapshot assertions 
if the component changes even slightly, the test fails 
snapshots don't let unexpected changes creep into my code 
snapshots are very useful if I want to make sure the output of my functions does
not change unexpectedly 
1. Vitest takes a snapshot of a given value 
2. it compares it to a reference snapshot (the previous snapshot) file stored alongside the test
3. test will fail if the two snapshots do not match (either the change is unexpected or 
   reference snapshot needs to be updated to a new version of the result */

it("toUpperCase", () => {
  const string = "foobar";
  const result = string.toUpperCase();
  expect(result).toMatchSnapshot();
  /* first time this test is run, Vitest creates a snapshot file
  exports['toUpperCase 1'] = '"FOOBAR"' 
  the snapshot artifact should be committed alongside code changes, and 
  reviewed as part of my code review process */
});

/* toMatchInlineSnapshot() stores the snapshot inline within the test file
as an inline comment */
it("toUpperCase", () => {
  const string = "foobar";
  const result = string.toUpperCase();
  // Vitest will modify the test file directly to update the snapshot as a string
  expect(result).toMatchInlineSnapshot(`"FOOBAR"`);
});

/* when the received value doesn't match the snapshot, the test fails and show me
the difference between them
when the snapshot change is expected, I may want to update the snapshot from the current state 

toMatchFileSnapshot() explicitly matches against a file - allows me to assign any
file extension to the snapshot file, and makes them more readable */

/* it("render basic", async () => {
  const result = renderHTML(h("div", { class: "foo" }));
  await expect(result).toMatchFileSnapshot("./test/basic.output.html");
}); */

/* also possible to snapshot images 
test("image snapshot", () => {
  expect(readFileSync("./test/stubs/input-image.png")).toMatchImageSnapshot();
});

I can add my own logic to alter how my snapshots are serialized */
expect.addSnapshotSerializer({
  serialize(val, config, indentation, depth, refs, printer) {
    // `printer` is a function that serializes a value using existing plugins.
    return `Pretty foo: ${printer(val.foo, config, indentation, depth, refs)}`;
  },
  test(val) {
    return val && Object.prototype.hasOwnProperty.call(val, "foo");
  },
});

/* I can add custom serializers
export default {
  serialize(val, config, indentation, depth, refs, printer) {
    // `printer` is a function that serializes a value using existing plugins.
    return `Pretty foo: ${printer(
      val.foo,
      config,
      indentation,
      depth,
      refs,
    )}`
  },
  test(val) {
    return val && Object.prototype.hasOwnProperty.call(val, 'foo')
  },
} satisfies SnapshotSerializer; 
*/

/* user-event - library library for RTC that simulates user interactions by
                dispatching events that would happen if the interaction took
                place in a browser 

fireEvent - dispatches DOM events whereas user-event simulates full interactions

*/

test("setOpenIndex sets the open index state properly", async () => {
  // render the Accordion with an initial item
  render(
    <Accordion
      items={[
        { title: "Title 1", contents: "Contents 1" },
        { title: "Title 2", contents: "Contents 2" },
      ]}
    />
  );

  // checking state with assertions on output
  // check that only the first item's content is displayed initially
  expect(screen.getByText("Contents 1")).toBeInTheDocument();
  expect(screen.queryByText("Contents 2")).not.toBeInTheDocument();

  // click the second button to change the open index
  const secondButton = screen.getByText("Title 2");

  fireEvent.click(secondButton);

  /* userEvent.setup() can be invoked using a setup function
  function setup(jsx) {
    return {
      user: userEvent.setup(),
      ...render(jsx),
    }
  }
  test('render with a setup function', async () => {
    const {user} = setup(<MyComponent />)
  }) */

  // verify that the second item's content is now displayed
  expect(screen.getByText("Contents 2")).toBeInTheDocument();
  expect(screen.queryByText("Contents 1")).not.toBeInTheDocument();
});

/* React Testing Library makes it very difficult to include implementation 
details in my tests 
I give it my own React element of the Accordion component with my fake props, 
and then I interact with the rendered output by querying the output for the 
contents that will be displayed to the user (or ensuring that it won't be
displayed) and clicking the buttons that are rendered */
test("can open accordion items to see the contents", async () => {
  const hats = { title: "Favorite Hats", contents: "Fedoras are classy" };
  const footwear = {
    title: "Favorite Footwear",
    contents: "Flipflops are the best",
  };

  render(<Accordion items={[hats, footwear]} />);

  // checking state with assertions on output
  // check that the first item's content is rendered by default
  expect(screen.getByText(hats.contents)).toBeInTheDocument();

  // verify that the second item's content is not yet displayed
  expect(screen.queryByText(footwear.contents)).not.toBeInTheDocument();

  // simulate user interaction
  // click on the second button to display the second item's contents
  await userEvent.click(screen.getByText(footwear.title));

  // check if the second content is rendered after clicking
  expect(screen.getByText(footwear.contents)).toBeInTheDocument();
});

/* tests which test implementation details can give me a false negative 
when I factor my code, this leads to brittle and frustrating tests */

/*
getByTestId(
  // If you're using `screen`, then skip the container argument:
  container: HTMLElement,
  text: TextMatch,
  options?: {
    exact?: boolean = true,
    normalizer?: NormalizerFn,
  }): HTMLElement
*/

/* Mock the Clipboard API with Vitest, navigator.clipboard.writeText
to avoid requiring real clipboard access */
Object.defineProperty(navigator, "clipboard", {
  value: {
    writeText: vi.fn().mockResolvedValue("Clipboard text"),
  },
});

describe("OptionsComponent", () => {
  test("sets input value on button click", () => {
    // 1. renders the component
    render(<OptionsComponent />);

    // checks if button click sets input to "Clicked"
    const button = screen.getByTestId("click-button");
    const input = screen.getByTestId("text-input");

    // 2. finds and clicks the button
    fireEvent.click(button);
    // 3. verifies input has the value "Clicked"
    expect(input).toHaveValue("Clicked");
  });

  test("uploads a valid PNG file", () => {
    // 1. renders the component
    render(<OptionsComponent />);

    // checks file upload behavior with an accepted PNG file
    const fileInput = screen.getByTestId("file-input");
    const validFile = new File(["image"], "sample.png", { type: "image/png" });

    // 2. simulates uploading a valid PNG file
    fireEvent.change(fileInput, { target: { files: [validFile] } });
    const fileOutput = screen.getByTestId("file-output");

    // 3. verifies file-output displays "sample.png"
    expect(fileOutput).toHaveTextContent("sample.png");
  });

  test("ignores an invalid file type", () => {
    // 1.
    render(<OptionsComponent />);

    // verifies that invalid file types are ignored
    // 2. file upload with a non-PNG file
    const fileInput = screen.getByTestId("file-input");
    const invalidFile = new File(["sample"], "sample.txt", {
      type: "text/plain",
    });

    fireEvent.change(fileInput, { target: { files: [invalidFile] } });
    const fileOutput = screen.getByTestId("file-output");

    // 3. confirms no output for invalid file type
    expect(fileOutput).toHaveTextContent("");
  });

  test("copies text to clipboard and displays it", async () => {
    // 1. spy on the clipboard API's writeText function
    const writeTextSpy = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValueOnce();

    // 2.
    render(<OptionsComponent />);

    // simulate clipboard copy action
    const clipboardTarget = screen.getByTestId("clipboard-target");
    fireEvent.click(clipboardTarget);

    // 3. verify clipboard interaction; confirm that writeText was called with "Clipboard text"
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      "Clipboard text"
    );

    const clipboardOutput = await screen.findByText("Clipboard text");
    // 4. checks that "Clipboard text" appears in clipboard-output
    expect(clipboardOutput).toBeInTheDocument();
  });
});

describe("PointerComponent", () => {
  test("performs mouse left button press and release actions", async () => {
    render(<PointerComponent />);
    // locates the button to test mouse interactions
    const mousePressButton = screen.getByTestId("mouse-press");

    const user = userEvent.setup();
    // simulates a left mouse button press on mousePressButton
    await user.pointer({ keys: "[MouseLeft>]", target: mousePressButton });
    // expect status to display "Mouse Left Button Pressed"
    expect(screen.getByTestId("status")).toHaveTextContent(
      "Mouse Left Button Pressed"
    );

    // simulates releasing the left mouse button
    await user.pointer({ keys: "[/MouseLeft]", target: mousePressButton });
    // expect status to display "Mouse Left Button Released"
    expect(screen.getByTestId("status")).toHaveTextContent(
      "Mouse Left Button Released"
    );
  });

  test("selects text with pointer at a specific offset", async () => {
    // 1.
    render(<PointerComponent />);
    // 2. locates the div for selecting text
    const selectableText = screen.getByTestId("selectable-text");

    // 3. initializes user interaction utilities, here for pointer events
    const user = userEvent.setup();

    /* confirms that clicking on a specific offset within the selectableText
    element correctly triggers text selection 
    simulates a pointer event */
    await user.pointer({
      // target is the div that can be selected
      target: selectableText,
      // click is slightly offset within the text
      offset: 2,
      // indicates a left-click action
      keys: "[MouseLeft]",
    });
    /* checks that the selection state is updated to display "Text Selected" 
    after the pointer event */
    expect(screen.getByTestId("selection")).toHaveTextContent("Text Selected");
  });

  test("selects text with a specific node and offset", async () => {
    // 1.
    render(<PointerComponent />);
    // 2. locates the div for selecting text
    const selectableText = screen.getByTestId("selectable-text");

    // 3. initializes user interaction utilities, here for pointer interactions
    const user = userEvent.setup();
    await user.pointer({
      // specifies selectable-text div as the element being clicked
      target: selectableText,
      // confirms that the pointer event targets this specific DOM node
      node: selectableText,
      // click is slightly offset within the text
      offset: 1,
      // indicates a left-click action
      keys: "[MouseLeft]",
    });
    /* checks that the selection state reflects "Text Selected" in 
    data-testid="selection", confirming the selection occurred */
    expect(screen.getByTestId("selection")).toHaveTextContent("Text Selected");
  });
});

/* fireEvent - lightweight wrapper around browser's low-level dispatchEvent API,
                allows devs to trigger any event on any element 
problem is that the browser usually does more than just trigger one event for 
one interaction 
ex. when a user types into a text box, the element has to be focused, keyboard and
input events are fired, and the selection and value on the element are manipulated
as the user types 

user-event allows me to describe a user interaction instead of a concrete event 
it adds visibility and interactivity checks along the way and manipulates the DOM
just like a user interaction in the browser would 

some user interactions or aspects aren't yet implemented and thus can't yet be 
described with user-event, then I can use fireEvent to dispatch the concrete
events that my software relies on 

when users interact in the browser, they interact with a UI layer the browser shows
browser interprets the input, possibly alters the underlying DOM accordingly, and
dispatches trusted events
user-event mocks the UI layer to simulate user interactions, like they would
happen in the browser 

userEvent.setup() allows me to configure an instance of user-event 
methods on this instance share one input device state, e.g. which keys are pressed

allows me to write multiple consecutive interactions that behave just like the
described interactions by a real user */

// const user = userEvent.setup();

// press shift (without releasing it)
// await user.keyboard("[ShiftLeft>]");

// perform a click with `shiftKey: true`
// await user.click(element);

/* there are two types of pointer action: press and move 
press action - if it defines a key to be pressed, to be released, or both */
// pointer({ keys: "[MouseLeft]" });

// I can declare multiple press actions on the same position
// pointer({ keys: "[MouseLeft][MouseRight]" });

// press a button without releasing it, button name is suffixed with >
// pointer("[MouseLeft>]");
// release the left mouse button
// pointer("[/MouseLeft]");

/* pointer move action - declare which pointer is moved per pointerName 
property, this defaults to mouse 
mouse pointer (pointerId: 1) is the only pointer that always exists and
has a position 
touch pointer only exists while the screen is touched and receives a new
pointerId every time 
for these pointers, I use the "button" name from the press action as pointerName */
/* pointer([
  // touch the screen at element1
  { keys: "[TouchA>]", target: element1 },
  // move the touch pointer to element2
  { pointerName: "TouchA", target: element2 },
  // release the touch pointer at the last position (element2)
  { keys: "[/TouchA]" },
]);

/* PointerTarget props allows to describe the position of the pointer on the document
pointer actions can alter the selection in the document
in the browser, every pointer position corresponds with a DOM position
- the DOM position is a DOM node and a DOM offset which usually is the character 
  closest to the pointer position 
- all characters in a no-layout environment are in the same layout position, I assume
  a pointer position to be closest to the alst descendant of the pointer target */

/* element: <div><span>foo</span><span>bar</span></div>
/ marking the cursor
[] marking a selection */

// pointer({ target: element, offset: 2, keys: "[MouseLeft]" });
// => <div><span>fo/o</span><span>bar</span></div>

// pointer({ target: element, offset: 2, keys: "[MouseLeft>]" }, { offset: 5 });
// => <div><span>fo[o</span><span>ba]r</span></div>

// spointer({ target: element, node: element, offset: 1, keys: "[MouseLeft]" });
// => <div><span>foo</span>/<span>bar</span></div>

/* keyboard API allows to simulate interactions with a keyboard, it accepts
a string describing the key actions */
// per printable character; ex. f, o, o
// keyboard("foo");
// { and [ are special characters and can be referenced by doubling them; ex. {, a, [
// keyboard("{{a[[");
/* per KeyboardEvent.key; ex. Shift, f, o, o; doesn't keep any key pressed, so Shift 
will be lifted before pressing f */
// keyboard("{Shift}{f}{o}{o}");
/* characters with special meaning inside the key descriptor can be escaped by 
prefixing them with a blackslash \ */
// keyboard("{\\}}");
// per KeyboardEvent.code; ex. Shift, f, o, o
// keyboard("[ShiftLeft][KeyF][KeyO][KeyO]");
// press a without releasing it
// keyboard("{a>}");
// press a without releasing it, and trigger 5 keydown
// keyboard("{a>5");
// press a without releasing, trigger 5 keydown, then release it
// keyboard("{a>5/}");
// release a previously pressed a
// keyboard("{/a}");
// Shift(down), A, Shift(up)
// keyboard("{Shift>}A{/Shift}");

describe("KeyboardComponent", () => {
  test("appends text for each typed character", async () => {
    render(<KeyboardComponent />);
    // stores div element for typing
    const keyboardInput = screen.getByTestId("keyboard-input");

    const user = userEvent.setup();
    await user.click(keyboardInput);
    // simulates typing foo into the div
    await user.keyboard("foo");

    // expects text-output to contain "Text: foo"
    expect(screen.getByTestId("text-output")).toHaveTextContent("Text: foo");
  });

  test("displays Shift + A combination correctly", async () => {
    render(<KeyboardComponent />);
    const keyboardInput = screen.getByTestId("keyboard-input");

    const user = userEvent.setup();
    await user.click(keyboardInput);
    // simulates pressing and holding Shift, pressing A, then releasing Shift
    await user.keyboard("{Shift>}A{/Shift}");

    // expects combination-out to display "Shift + A pressed"
    expect(screen.getByTestId("combination-output")).toHaveTextContent(
      "Shift + A pressed"
    );
  });

  test("escapes special characters with brackets and braces", async () => {
    render(<KeyboardComponent />);
    const keyboardInput = screen.getByTestId("keyboard-input");

    const user = userEvent.setup();
    await user.click(keyboardInput);
    // simulates typing {{[[a[[ which shoule be processed to {[a[ based on the escape logic
    await user.keyboard("{{[[a[[");

    // verifies text-output contains "Text: {[a["
    expect(screen.getByTestId("text-output")).toHaveTextContent("Text: {[a[");
  });

  test("handles holding down and releasing Shift", async () => {
    render(<KeyboardComponent />);
    const keyboardInput = screen.getByTestId("keyboard-input");

    const user = userEvent.setup();
    await user.click(keyboardInput);
    // simulates pressing and holding Shift for 5 repetitions
    await user.keyboard("{Shift>5}");

    // heldKeyStatus should show "Shift key held"
    expect(screen.getByTestId("held-key-output")).toHaveTextContent(
      "Shift key held"
    );

    // release Shift key
    await user.keyboard("{/Shift}");
    // after releasing Shift, expects held-key-output to contain "Shift key released"
    expect(screen.getByTestId("held-key-output")).toHaveTextContent(
      "Shift key released"
    );
  });

  test("handles pressing and releasing special characters", async () => {
    render(<KeyboardComponent />);
    const keyboardInput = screen.getByTestId("keyboard-input");

    const user = userEvent.setup();
    await user.click(keyboardInput);
    // simulates typing a single closing bracket "}"
    await user.keyboard("{\\}}");

    // verifies text-output to have "Text: }"
    expect(screen.getByTestId("text-output")).toHaveTextContent("Text: }");
  });

  test("appends text for each typed character including Key codes", async () => {
    render(<KeyboardComponent />);
    const keyboardInput = screen.getByTestId("keyboard-input");

    const user = userEvent.setup();
    await user.click(keyboardInput);
    // simulates typeing 'foo' using key codes
    await user.keyboard("[KeyF][KeyO][KeyO]");
    // expects text-output to contain "Text: foo"
    expect(screen.getByTestId("text-output")).toHaveTextContent("Text: foo");
  });
});

describe("ClipboardComponent", () => {
  beforeEach(() => {
    // mock clipboard writeText and readText functions to control clipboard behaviors
    vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
    vi.spyOn(navigator.clipboard, "readText").mockResolvedValue(
      "Sample text for Clipboard operations"
    );
  });

  afterEach(() => {
    // restore the original clipboard functions after each test
    vi.restoreAllMocks();
  });

  test("copy text", async () => {
    const user = userEvent.setup();
    render(<ClipboardComponent />);

    const textarea = screen.getByTestId("clipboard-textarea");
    // click the textarea and perform a copy action
    await user.click(textarea);
    await user.copy();

    const clipboardText = await navigator.clipboard.readText();
    // verifies the copied content matches the textarea value
    expect(clipboardText).toBe(textarea.value);
  });

  test("cut text", async () => {
    const user = userEvent.setup();
    render(<ClipboardComponent />);

    const textarea = screen.getByTestId("clipboard-textarea");

    // click the textarea and the cut button
    await user.click(textarea);
    await user.click(screen.getByTestId("cut-button"));

    // ensures writeText was called with the expected text
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      "Sample text for Clipboard operations"
    );
    // confirm text area is cleared after cut
    expect(textarea).toHaveValue("");
  });

  test("paste text", async () => {
    const user = userEvent.setup();
    render(<ClipboardComponent />);

    const textarea = screen.getByTestId("clipboard-textarea");

    // prepare clipboard with a specific value to be pasted
    vi.spyOn(navigator.clipboard, "readText").mockResolvedValueOnce(
      " - Pasted Text"
    );
    await user.click(screen.getByTestId("paste-button"));

    // confirm textarea shows original text and pasted content
    expect(textarea).toHaveValue(
      "Sample text for Clipboard operations - Pasted Text"
    );
  });
});

/* clear() API clears an editable element
1. focus element
2. select all contents as per browser menu
3. delete contents as per browser menu 

the promise is rejected if the element can not be focused or contents can
not be selected */
test("clear", async () => {
  const user = userEvent.setup();
  render(<UtilityAPIsComponent />);

  const textarea = screen.getByTestId("textarea");
  // clears the textarea content
  await user.clear(textarea);
  // checks that the textarea value is now empty
  expect(textarea).toHaveValue("");
});

test("clear", async () => {
  const user = userEvent.setup();

  render(<textarea defaultValue="Hello, World!" />);

  await user.clear(screen.getByRole("textbox"));

  expect(screen.getByRole("textbox")).toHaveValue("");
});

// selecting options in a select element
test("selectOptions", async () => {
  const user = userEvent.setup();
  render(<UtilityAPIsComponent />);

  const select = screen.getByTestId("select-multiple");
  // simulates option selection, selecting options A and B in the select element
  await user.selectOptions(select, ["1", "2"]);

  // confirms options A and C are selected, while B is not
  expect(screen.getByRole("option", { name: "A" }).selected).toBe(true);
  expect(screen.getByRole("option", { name: "B" }).selected).toBe(true);
  expect(screen.getByRole("option", { name: "C" }).selected).toBe(false);
});

test("selectOptions", async () => {
  const user = userEvent.setup();

  render(
    // selecting or deselectingh multiple options is only possible if multiple is specified
    <select multiple>
      {/* value parameter refers to an option per its value, 
      HTML content, or just provide the element */}
      <option value="1">A</option>
      <option value="2">B</option>
      <option value="3">C</option>
    </select>
  );

  await user.selectOptions(screen.getByRole("listbox"), ["1", "C"]);

  expect(screen.getByRole("option", { name: "A" }).selected).toBe(true);
  expect(screen.getByRole("option", { name: "B" }).selected).toBe(false);
  expect(screen.getByRole("option", { name: "C" }).selected).toBe(true);
});

// deselecting options in a select element
test("deselectOptions", async () => {
  const user = userEvent.setup();
  render(<UtilityAPIsComponent />);

  const select = screen.getByTestId("select-multiple");
  // simulates option deselection, deselecting option B in the select element
  await user.deselectOptions(select, "2");

  // confirms none of the options are selected
  expect(screen.getByRole("option", { name: "A" }).selected).toBe(false);
  expect(screen.getByRole("option", { name: "B" }).selected).toBe(false);
  expect(screen.getByRole("option", { name: "C" }).selected).toBe(false);
});

test("deselectOptions", async () => {
  const user = userEvent.setup();

  render(
    <select multiple>
      <option value="1">A</option>
      <option value="2" selected>
        B
      </option>
      <option value="3">C</option>
    </select>
  );

  await user.deselectOptions(screen.getByRole("listbox"), "2");

  expect(screen.getByText("B").selected).toBe(false);
});

// typing text into an input field
test("type into an input field", async () => {
  const user = userEvent.setup();
  render(<UtilityAPIsComponent />);

  const input = screen.getByTestId("input-text");
  // types "World!" into the text input field
  await user.type(input, " World!");

  // confirms the text input value is "Hello, World!"
  expect(input).toHaveValue("Hello, World!");
});

// uploading single file
test("upload file", async () => {
  const user = userEvent.setup();
  render(<UtilityAPIsComponent />);

  const file = new File(["hello"], "hello.png", { type: "image/png" });
  const input = screen.getByTestId("file-input");

  // simulates single file upload, uploads a single PNG file named "hello.png"
  await user.upload(input, file);

  // checks that the file is in the input's file list
  expect(input.files[0]).toBe(file);
  expect(input.files).toHaveLength(1);
  // checks that the file is displayed in the uploaded-files div
  expect(screen.getByTestId("uploaded-files")).toHaveTextContent("hello.png");
});

test("upload file", async () => {
  const user = userEvent.setup();

  render(
    <div>
      <label htmlFor="file-uploader">Upload file:</label>
      <input id="file-uploader" type="file" />
    </div>
  );
  const file = new File(["hello"], "hello.png", { type: "image/png" });
  const input = screen.getByLabelText(/upload file/i);

  await user.upload(input, file);

  expect(input.files[0]).toBe(file);
  expect(input.files.item(0)).toBe(file);
  expect(input.files).toHaveLength(1);
});

test("upload multiple files", async () => {
  const user = userEvent.setup();

  render(
    <div>
      <label htmlFor="file-uploader">Upload file:</label>
      <input id="file-uploader" type="file" multiple />
    </div>
  );
  const files = [
    new File(["hello"], "hello.png", { type: "image/png" }),
    new File(["there"], "there.png", { type: "image/png" }),
  ];
  const input = screen.getByLabelText(/upload file/i);

  await user.upload(input, files);

  expect(input.files).toHaveLength(2);
  expect(input.files[0]).toBe(files[0]);
  expect(input.files[1]).toBe(files[1]);
});

// uploading multiple files
test("upload multiple files", async () => {
  const user = userEvent.setup();
  render(<UtilityAPIsComponent />);

  const files = [
    new File(["hello"], "hello.png", { type: "image/png" }),
    new File(["world"], "world.png", { type: "image/png" }),
  ];
  const input = screen.getByTestId("file-input");

  // simulates multiple file upload, uploads two files
  await user.upload(input, files);

  /* checks that both files are in the input's file list and that their names
  are displayed in the uploaded-files div */
  expect(input.files).toHaveLength(2);
  expect(input.files[0]).toBe(files[0]);
  expect(input.files[1]).toBe(files[1]);
  expect(screen.getByTestId("uploaded-files")).toHaveTextContent("hello.png");
  expect(screen.getByTestId("uploaded-files")).toHaveTextContent("world.png");
});

test("click", async () => {
  // create a mock function to track calls
  const onChange = vi.fn();
  const user = userEvent.setup();

  // render a checkbox with the mock function as its onChange handler
  render(<input type="checkbox" onChange={onChange} />);

  // select the checkbox element
  const checkbox = screen.getByRole("checkbox");

  // simulate a click on the checkbox
  await user.click(checkbox);

  // assert that the onChange handler was called once
  expect(onChange).toHaveBeenCalledTimes(1);

  // verify the checkbox is checked after the click
  expect(checkbox).toBeChecked();
});

test("double click", async () => {
  const onChange = vi.fn();
  const user = userEvent.setup();

  // render the checkbox with an onChange handler
  render(<input type="checkbox" onChange={onChange} />);

  const checkbox = screen.getByRole("checkbox");

  // simulate a double-click on the checkbox
  await user.dblClick(checkbox);

  // assert that the onChange handler was called twice
  expect(onChange).toHaveBeenCalledTimes(2);
  // verify the checkbox is unchecked after the double-click (toggles twice)
  expect(checkbox).not.toBeChecked();
});

test("triple click", async () => {
  const onChange = vi.fn();
  const user = userEvent.setup();

  // render the checkbox with an onChange handler
  render(<input type="checkbox" onChange={onChange} />);

  const checkbox = screen.getByRole("checkbox");

  // simulate a triple-click on the checkbox
  await user.tripleClick(checkbox);

  // assert that the onChange handler was called three times
  expect(onChange).toHaveBeenCalledTimes(3);
  // verify the checkbox is checked after the triple-click (toggle leaves it checked)
  expect(checkbox).toBeChecked();
});

test("hover/unhover", async () => {
  const user = userEvent.setup();
  // render a div with text "Hover"
  render(<div>Hover</div>);

  const hoverBox = screen.getByText("Hover");
  // variable to track hover state
  let isHover = false;

  // when mouseover, change hover state
  hoverBox.addEventListener("mouseover", () => {
    isHover = true;
  });

  // when mouseout, change hover state
  hoverBox.addEventListener("mouseout", () => {
    isHover = false;
  });

  // verify the element is not hovered initially
  expect(isHover).toBeFalsy();

  // simulate a hover action on the element
  await user.hover(hoverBox);

  // verify the element is now hovered
  expect(isHover).toBeTruthy();

  // simulate unhover action
  await user.unhover(hoverBox);

  // verify the element is not hovered anymore
  expect(isHover).toBeFalsy();
});

test("tab", async () => {
  const user = userEvent.setup();
  render(
    <div>
      <input type="checkbox" />
      <input type="radio" />
      <input type="number" />
    </div>
  );

  const checkbox = screen.getByRole("checkbox");
  const radio = screen.getByRole("radio");
  const number = screen.getByRole("spinbutton");

  // verify the document body has focus initially
  expect(document.body).toHaveFocus();

  // tab to the first input
  await user.tab();

  // verify focus on the checkbox
  expect(checkbox).toHaveFocus();

  // tab to the next input
  await user.tab();

  // verify focus on the radio button
  expect(radio).toHaveFocus();

  // tab to the next input
  await user.tab();

  // verify focus on the number input
  expect(number).toHaveFocus();

  // tab again; should cycle focus back to the body
  await user.tab();
  expect(document.body).toHaveFocus();

  // tab again to cycle focus back to the first input
  await user.tab();
  expect(checkbox).toHaveFocus();
});

/* snapshot testing - Jest provides a snapshot mechanism which allows me to
create a node or component's tree, and store it in a specialized file
on every run, a tree generated by Jest is compared to the one which is stored
in the latest snapshot

Advantages of using Jest snapshot testing
1. Jest Snapshot test can be written faster than traditional ones
- because I neither have to look for the elements in a tree nor
  check the amount of elements with expected number
- with a snapshot test, I receive exactly the same tree which is
  rendered in my application, and I can check if the output matches
  the expected result
2. Jest Snapshot tests check if my component behaves correctly
- I don't have to change my test when I update the component
  Jest updates the snapshot for me once I agree to that
- I can check how my component behaves once I pass various combinations
  of props to it
  Snapshot helps check if the passed data is properly reflected in the
  component or node tree, and I can check if the values are correct
- I can combine elements from the traditional way of testing, like 
  mocking functions which are passed as props
- I can check if my component calls mocking functions as I expect
3. Jest snapshot allows conditional rendering tests
- after receiving backend data, sometimes I need to check if a key 
  value is present, it can be checked with snapshots

Disadvantages of using Jest snapshot testing
1. there are some problems with larger snapshots
- it's not easy to check large snapshot files for what has been changed
  in comparison to the previous version
- use the eslint plugin, "no-large-snapshots"
  lets me set the limit of lines in the snapshot files
- I should check if the props (if required) are passed properly to the 
  component that I used
  mock the component or use shallow render
2. sometimes there are issues with translations
*/

/*
import React from "react";
import { mount } from "enzyme";

import { UsersComponent } from "./users.component";

const data = [
  {
    id: "5c76f0b7bb5c210da0f8554a",
    firstName: "Florine",
    lastName: "Russell",
    email: "florine.russell$email..org",
  },
];

describe("Users component", () => {
  //Snapshot way
  /* in a snapshot I know exactly what is in the header, in the button, and
  in the list, with no need to check it manually step by step
  it("renders list with one row", async () => {
    const fetchUsersList = jest.fn(
      () => new Promise((resolve) => resolve(data))
    );
    const wrapper = mount(<UsersComponent fetchUsersList={fetchUsersList} />);

    /* check whether the component called the fetch function properly
    will render information about fetching data from the API 
    await expect(fetchUsersList).toHaveBeenCalled();

    wrapper.update();

    expect(wrapper).toMatchSnapshot();
  });

  //Traditional way
  it("renders list with one row without snapshot", async () => {
    const fetchUsersList = jest.fn(
      () => new Promise((resolve) => resolve(data))
    );
    const wrapper = mount(<UsersComponent fetchUsersList={fetchUsersList} />);

    wrapper.update();

    expect(wrapper.find("h1").length).toBe(1);
    expect(wrapper.find("h1").text()).toBe("List of 8 users");

    expect(wrapper.find("button").length).toBe(1);
    expect(wrapper.find("button").text()).toBe("add new user");

    expect(wrapper.find("ul").children().length).toBe(8);
    //...
  });

  describe('Users list row component', () => {
  // checks for full user data in the table row component
  it('renders row with full user data', () => {
    const wrapper = render(<UsersListRow user={data[0]} />);

    expect(wrapper).toMatchSnapshot();
  });

  // checks for no email field in the table row component
  it('renders row with placeholder for email', () => {
    const { email, ...user } = data[0];
    const wrapper = render(<UsersListRow user={user} />);

    expect(wrapper).toMatchSnapshot();
  });
});
});
*/
it("renders", () => {
  /* render returns other functions that may be called specific to
  the component being tested 
  asFragment is the chunk of the HTML rendered */
  const { asFragment } = render(<Header text="Hello" />);
  /* _snapshots_ will be generated, containing the HTML that was rendered 
  this way, anytime I refactor, I can make sure my HTML is the same by
  comparing my current output with the snapshot 
  
  if the test then fails, I can press U to update the snapshot */
  expect(asFragment()).toMatchSnapshot();
});

it("inserts text in h2", () => {
  // functions returned by render to help me dind elements inside the rendered tree
  const { getByTestId, getByText } = render(<Header text="Hello!" />);

  // toHaveTextContent is ok with subsets of the same value
  expect(getByTestId("h2tag")).toHaveTextContent("Hello");
  // getByText expects exact same text
  expect(getByText("Hello!")).toHaveClass("fancy-h2");
});