import { useState, Component, Fragment } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import "./App.css";

/* function App({ title }) {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + {title}</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
} */
const App = () => <h1>My First Test</h1>;

function Login() {
  return (
    <form>
      <div id="app">
        <label htmlFor="username">Username</label>
        <input type="text" id="username" name="username" />
        <button type="submit">Login</button>
      </div>
    </form>
  );
}

/* use function if I want the component to be hoisted or might need its own
this context
use const with an arrow function, commonly used in React projects and keeps
this behavior consistent */
const MyComponent = () => {
  return <div>Hello World</div>;
};

// I can build confidence in my components through tests
const SimulateUserEvent = () => {
  const [heading, setHeading] = useState("Magnificent Monkeys");

  const clickHandler = () => {
    setHeading("Radical Rhinos");
  };

  return (
    <>
      {/* button that changes the heading of the SimulateUserEvent App */}
      <button type="button" onClick={clickHandler}>
        Click Me
      </button>
      <h1>{heading}</h1>
    </>
  );
};

/* AccordionContents receives its contents via children prop 
allowing it to render any content passed to it */
const AccordionContents = ({ children }) => {
  return <div className="accordion-contents">{children}</div>;
};

class Accordion extends Component {
  /* initializes a state variable called openIndex, with a default value of 0
  variable tracks the index of the currently opened accordion item */
  // state = { openIndex: 0 };
  // updates the component's state to set openIndex as the currently open item
  // setOpenIndex = (openIndex) => this.setState({ openIndex });
  // render automatically called every time the state or props change
  state = { openIndexes: [0] };
  setOpenIndex = (openIndex) => this.setState({ openIndexes: [openIndex] });
  render() {
    // destructures the openIndex, to access curently opened item's index
    // const { openIndex } = this.state;
    const { openIndexes } = this.state;
    return (
      <div>
        {/* iterates over each item in this.props.items where each item has
        a title and contents */}
        {this.props.items.map((item, index) => (
          <Fragment key={index}>
            {/* renders a button for each item with an onClick handler
            when clicked, calls setOpenIndex with the current index 

            this change leads to a false positive in the test because there was 
            no test to verify that the button was wired up to setOpenIndex correctly
            <button onClick={this.setOpenIndex(index)}>{item.title}</button>*/}
            <button onClick={() => this.setOpenIndex(index)}>
              {item.title}
            </button>
            {/* if the index matches openIndex, renders AccordionContents
            component, passing items.content as its children, otherwise render nothing 
            {index === openIndex ? ( */}
            {openIndexes.includes(index) ? (
              <AccordionContents>{item.contents}</AccordionContents>
            ) : null}
          </Fragment>
        ))}
      </div>
    );
  }
}

/* end-users and developers are the two "users" that my application code need to
consider 
the end user will see/interact with what I render in the render method
the developer will see/interact with the props they pass to the component 
my tests should typically only see/interact with the props that are passed,
and the rendered output 

mindset to have when testing to avoid implementation details
1. What part of my untested codebase would be really bad if it broke?
   - the checkout process
2. Narrow it down to a unit or a few units of code
   - checkout, when clicking the checkout button a request with the cart items
     is sent too
3. Consider who the users are
   - the developer rendering the checkout form
   - the end user clicking on the button 
4. Write down a list of instructions for the developers to manually test the 
   code to mke sure it's not broken
   - render the form with some fake data, click the checkout button, ensure
     the mocked/checkout API was called with the right data, respond with a 
     fake successful response, make sure the success message is displayed
5. Turn that list of instructions into an automated test */

const OptionsComponent = () => {
  const [inputValue, setInputValue] = useState("");
  // fileName sotres the name of a successfully uploaded PNG file
  const [fileName, setFileName] = useState("");
  // clipboardText stores the text copied to the clipboard
  const [clipboardText, setClipboardText] = useState("");

  const handleClipboardCopy = () => {
    const text = "Clipboard text";
    // copies text value to the clipboard
    navigator.clipboard.writeText(text).then(() => {
      // once the copy is successful, sets clipboardText to text value
      setClipboardText(text);
    });
  };

  const handleFileUpload = (event) => {
    // extracts the first file uploaded
    const file = event.target.files[0];
    // if the file is of type image/png, sets fileName to the file's name
    if (file && file.type === "image/png") {
      setFileName(file.name);
    }
  };

  return (
    <div>
      <input
        data-testid="text-input"
        type="text"
        placeholder="Type here..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      {/* when text changes, setInputValue updates inputValue with the new text 
      allows only .png files
      on file selection, handleFileUpload runs */}
      <input
        data-testid="file-input"
        type="file"
        accept=".png"
        onChange={handleFileUpload}
      />
      {/* sets inputValue to "Clicked" when clicked */}
      <button
        data-testid="click-button"
        onClick={() => setInputValue("Clicked")}
      >
        Click me
      </button>
      {/* disabled (pointerEvents: "none") so it does not react to clicks */}
      <button data-testid="pointer-button" style={{ pointerEvents: "none" }}>
        Pointer Button
      </button>
      {/* calls handleClipboardCopy to copy text to the clipboard when clicked */}
      <div data-testid="clipboard-target" onClick={handleClipboardCopy}>
        Copy to Clipboard
      </div>
      {/* display divs */}
      <div data-testid="clipboard-output">{clipboardText}</div>
      <div data-testid="file-output">{fileName}</div>
    </div>
  );
};

const PointerComponent = () => {
  // manages the current status of mouse or touch interactions
  const [status, setStatus] = useState("");
  // manages if text is selected
  const [selection, setSelection] = useState("");

  const handleMousePress = (event) => {
    if (event.buttons === 3) {
      // checks if both left and right buttons pressed, setting status to indicate so
      setStatus("Mouse Left and Right Buttons Pressed");
    } else if (event.button === 0) {
      // checks if only the left button is pressed, setting status to indicate so
      setStatus("Mouse Left Button Pressed");
    } else if (event.button === 2) {
      // checks if only the right button is pressed, setting status to indicate so
      setStatus("Mouse Right Button Pressed");
    }
  };

  const handleMouseRelease = (event) => {
    // tracks the release of left and right mouse buttons, updating status
    if (event.button === 0) {
      setStatus("Mouse Left Button Released");
    } else if (event.button === 2) {
      setStatus("Mouse Right Button Released");
    }
  };

  const handleTouchStart = () => {
    // sets status to indicate a touch has started
    setStatus("Touch Started");
  };

  const handleTouchEnd = () => {
    // sets status to indicate the touch has ended
    setStatus("Touch Ended");
  };

  const handleSelect = () => {
    // sets the selection state to indicate text selection
    setSelection("Text Selected");
  };

  return (
    <div>
      {/* button with onMouseDown and onMouseUp handlers to track mouse interactions */}
      <button
        data-testid="mouse-press"
        onMouseDown={handleMousePress}
        onMouseUp={handleMouseRelease}
      >
        Press Me
      </button>
      {/* div that listens for onTouchStart and onTouchEnd events, 
      updating the status state for touch interactions */}
      <div
        data-testid="touch-target"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        Touch Me
      </div>
      {/* div that triggers handleSelect when clicked, simulating text selection */}
      <div data-testid="selectable-text" onMouseDown={() => handleSelect()}>
        <span>foo</span>
        <span>bar</span>
      </div>
      {/* status and selection state displays */}
      <p data-testid="status">{status}</p>
      <p data-testid="selection">{selection}</p>
    </div>
  );
};

const KeyboardComponent = () => {
  const [text, setText] = useState("");
  const [keyCombination, setKeyCombination] = useState("");
  const [heldKeyStatus, setHeldKeyStatus] = useState("");

  // triggered on each key press
  const handleKeyDown = (event) => {
    // destructures key, code, and shiftKey from the event for easy reference
    const { key, code, shiftKey } = event;

    // detect Shift + A combination
    if (shiftKey && key === "A") {
      setKeyCombination("Shift + A pressed");
      // Exit early to prevent additional character appending
      return;
    }

    /* process special escaping for double curly braces {{ and square brackets [[
    removes the last character and appends { or [ to avoid duplication */
    if (key === "{" && text.endsWith("{")) {
      setText((prevText) => prevText.slice(0, -1) + "{");
    } else if (code === "BracketLeft" && text.endsWith("[")) {
      setText((prevText) => prevText.slice(0, -1) + "[");
    }
    // append any single character key to text
    else if (key.length === 1) {
      setText((prevText) => prevText + key);
    }

    // handle held Shift key status
    if (key === "Shift") {
      setHeldKeyStatus("Shift key held");
    }
  };

  // detects when Shift is released
  const handleKeyUp = (event) => {
    const { key } = event;

    if (key === "Shift") {
      setHeldKeyStatus("Shift key released");
    }
  };

  return (
    // renders a div that captures keyboard interactions
    <div
      // tabIndex="0" enables focus
      tabIndex="0"
      data-testid="keyboard-input"
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      style={{ outline: "none" }}
    >
      {/* display info from state */}
      <p data-testid="text-output">Text: {text}</p>
      <p data-testid="combination-output">{keyCombination}</p>
      <p data-testid="held-key-output">{heldKeyStatus}</p>
    </div>
  );
};

const ClipboardComponent = () => {
  // manages and updates text in the textarea
  const [text, setText] = useState("Sample text for Clipboard operations");

  // textarea allows testing of copy, cut, and paste interactions
  const handleCopy = async () => {
    const textArea = document.getElementById("clipboard-textarea");
    textArea.select();
    await navigator.clipboard.writeText(textArea.value);
  };

  const handleCut = async () => {
    const textArea = document.getElementById("clipboard-textarea");
    // selects the entire text in the textarea
    textArea.select();
    // copies the selected text to clipboard
    await navigator.clipboard.writeText(textArea.value);
    // clears the textarea, simulating a cut action
    setText("");
  };

  const handlePaste = async () => {
    // retrieves text from the clipboard
    const clipboardText = await navigator.clipboard.readText();
    // appends the pasted text to the existing text value
    setText((prevText) => prevText + clipboardText);
  };

  // textarea allows for text selection
  return (
    <div>
      {/* displays the current text value */}
      <textarea
        id="clipboard-textarea"
        value={text}
        // when changed, updates text with the new value
        onChange={(e) => setText(e.target.value)}
        data-testid="clipboard-textarea"
      />
      {/* buttons to trigger the copy, cut, and paste operations */}
      <button onClick={handleCopy} data-testid="copy-button">
        Copy
      </button>
      <button onClick={handleCut} data-testid="cut-button">
        Cut
      </button>
      <button onClick={handlePaste} data-testid="paste-button">
        Paste
      </button>
    </div>
  );
};

const UtilityAPIsComponent = (event) => {
  const [textareaValue, setTextareaValue] = useState("Hello, World!");
  const [selectedOptions, setSelectedOptions] = useState(["2"]);
  const [inputValue, setInputValue] = useState("Hello,");
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleSelectChange = (event) => {
    // gathers selected values as an array
    const options = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    // updates selectedOptions to reflect the selected options in the select element
    setSelectedOptions(options);
  };

  const handleFileUpload = (event) => {
    // converts FileList to an array
    const files = Array.from(event.target.files);
    // updates uploadedFiles with an array
    setUploadedFiles(files);
  };

  return (
    <div>
      {/* displays textareaValue and updates it on change */}
      <textarea
        value={textareaValue}
        onChange={(e) => setTextareaValue(e.target.value)}
        data-testid="textarea"
      />
      {/* multiple-selection dropdown showing options A, B, and C, 
      and updates selectedOptions on selection */}
      <select
        multiple
        value={selectedOptions}
        onChange={handleSelectChange}
        data-testid="select-multiple"
      >
        <option value="1">A</option>
        <option value="2">B</option>
        <option value="3">C</option>
      </select>
      {/* text input showing inputValue and updating it as the user types */}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        data-testid="input-text"
      />
      {/* allows multiple file uploads, updating uploadedFiles */}
      <input
        type="file"
        onChange={handleFileUpload}
        data-testid="file-input"
        multiple
      />
      {/* displays uploaded file names */}
      <div data-testid="uploaded-files">
        {uploadedFiles.map((file, index) => (
          <p key={index}>{file.name}</p>
        ))}
      </div>
    </div>
  );
};

const ConvenienceAPIsComponent = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked((prev) => !prev);
  };

  const handleMouseOver = () => {
    setHovered(true);
  };

  const handleMouseOut = () => {
    setHovered(false);
  };

  return (
    // checkbox with an onChange handler
    <div>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleCheckboxChange}
        data-testid="checkbox"
      />
      {/* div with hover and unhover states using onMouseOver and onMouseOut */}
      <div
        data-testid="hover-box"
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        style={{
          width: "100px",
          height: "100px",
          backgroundColor: hovered ? "lightblue" : "lightgray",
        }}
      >
        Hover
      </div>
      {/* three inputs (checkbox, radio, number) to demonstrate tab
      navigation between elements */}
      <input type="checkbox" data-testid="tab-checkbox" />
      <input type="radio" data-testid="tab-radio" />
      <input type="number" data-testid="tab-number" />
    </div>
  );
};

// const Component = () => {};

// mini-component
function Header({ text }) {
  return (
    <header>
      <h2 data-testid="h2tag" className="fancy-h2">
        {text}
      </h2>
    </header>
  );
}

export {
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
};
