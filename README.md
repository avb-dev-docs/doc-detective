# doc-unit-test

Unit test documentation to validate UX flows, in-GUI text, and images. Primarily useful for process docs, `doc-unit-test` supports test definitions single-sourced in documentation or defined in separate test files to suit your infrastructure needs.

`doc-unit-test` ingests text files, parses them for test actions, then executes those actions in a headless Chromium browser. The results (PASS/FAIL and context) are output as a JSON object so that other pieces of infrastructure can parse and manipulate them as needed.

This project handles test parsing and web-based UI testing--it doesn't support results reporting or notifications. This framework is a part of testing infrastructures and needs to be complimented by other components.

`doc-unit-test` uses `puppeteer` to install, launch, and drive Chromium to perform tests. `puppeteer` removes the requirement to manually configure a local web browser and enables easy screenshotting and video recording.

**Note:** By default, `puppeteer`'s Chromium doesn't run in Docker containers, which means that `puppeteer` doesn't work either. Don't run `doc-unit-test` in a Docker container unless you first confirm that you have a custom implementation of headless Chrome/Chromium functional in the container. The approved answer to [this question](https://askubuntu.com/questions/79280/how-to-install-chrome-browser-properly-via-command-line) works for me, but it may not work in all environments.

## Get started

You can use `doc-unit-test` as an [NPM package](#npm-package) or a standalone [CLI tool](#cli-tool).

### NPM package

`doc-unit-test` integrates with Node projects as an NPM package. When using the NPM package, you must specify all options in the `run()` method's `config` argument, which is a JSON object with the same structure as [config.json](https://github.com/hawkeyexl/doc-unit-test/blob/master/sample/config.json).

0.  Install prerequisites:
    - [FFmpeg](https://ffmpeg.org/) (Only required if you want the [Start recording](#start-recording) action to output GIFs. Not required for MP4 output.)
1.  In a terminal, navigate to your Node project, then install `doc-unit-test`:

    ```bash
    npm i doc-unit-test
    ```

1.  Add a reference to the package in your project:

    ```node
    const { run } = require("doc-unit-test");
    ```

1.  Run tests with the `run()` method:

    ```node
    run(config);
    ```

### CLI tool

You can run `doc-unit-test` as a standalone CLI tool. When running as a CLI tool, you can specify default configuration options in [config.json](https://github.com/hawkeyexl/doc-unit-test/blob/master/sample/config.json) and override those defaults with command-line arguments. (For a list of arguments, complete the following steps and run `npm run test -- -h`.)

0.  Install prerequisites:

    - [Node.js](https://nodejs.org/)
    - [FFmpeg](https://ffmpeg.org/) (Only required if you want the [Start recording](#start-recording) action to output GIFs. Not required for MP4 output.)

1.  In a terminal, clone the repo and install dependencies:

    ```bash
    git clone https://github.com/hawkeyexl/doc-unit-test.git
    cd doc-unit-test
    npm install
    ```

1.  Run tests according to your config. The `-c` argument is required and specifies the path to your config. The following example runs tests in the [sample/](https://github.com/hawkeyexl/doc-unit-test/tree/master/sample) directory:

    ```bash
    npm run test -- -c sample/config.json
    ```

To customize your test, file type, and directory options, update [sample/config.json](https://github.com/hawkeyexl/doc-unit-test/blob/master/sample/config.json).

## Tests

You can define tests within your documentation (see [doc-content.md](https://github.com/hawkeyexl/doc-unit-test/blob/master/sample/doc-content.md)), or as separate files. Non-JSON files only support single-line test action definitions, so make sure to keep the entire action definition on one line.

JSON files must follow the format and structure defined in [testDefinition](https://github.com/hawkeyexl/doc-unit-test/blob/master/ref/testDefinition.json). For an example, see [samples/tests.json](https://github.com/hawkeyexl/doc-unit-test/blob/master/sample/tests.json).

## Actions

Each test is composed of multiple actions. Actions in a test perform sequentially as they're defined. If one or more actions fail, the test fails.

For information on each field, see [testDefinition](https://github.com/hawkeyexl/doc-unit-test/blob/master/ref/testDefinition.json).

### goTo

Navigate to a specified URI.

Format:

```json
{
  "action": "goTo",
  "uri": "https://www.google.com"
}
```

### Find

Identify if an element is on the current page based on CSS selectors.

Optionally, perform additional actions on the element in the specified order: [`matchText`](#match-text) > [`moveMouse`](#move-mouse) > [`click`](#click) > [`type`](#type). Payloads for these additional actions are nested within the `find` action's definition and (other than omitting the `css` field) match the format for running each action separately.

Simple format:

```json
{
  "action": "find",
  "css": "[title=Search]"
}
```
Advanced format:

```json
{
  "action": "find",
  "css": "[title=Search]",
  "matchText": {
    "text": "Search"
  }
  "moveMouse": {
    "alignH": "center",
    "alignV": "center",
    "offsetX": 0,
    "offsetY": 0
  },
  "click": {},
  "type": {
    "keys": "$SHORTHAIR_CAT_SEARCH",
    "trailingSpecialKey": "Enter",
    "envs": "./sample/variables.env"
  }
}
```

### Match text

Identify if an element displays the expected text.

Format:

```json
{
  "action": "matchText",
  "css": "#gbqfbb",
  "text": "I'm Feeling Lucky"
}
```

### Click

Click an element specified by CSS selectors.

Format:

```json
{
  "action": "click",
  "css": "#gbqfbb",
  "moveMouse": "true",
  "alignH": "center",
  "alignV": "center",
  "offsetX": 10,
  "offsetY": 10

}
```

### Type

Enter text in an element specified by CSS selectors.

`keys` can be either a string or an environment variable. Environment variables are identified by a leading '$', and you can set environment variables by passing a .env file ([sample](https://github.com/hawkeyexl/doc-unit-test/blob/master/sample/variables.env)) to the `env` field. If the variable is undefined on the machine running the test, the `keys` value is typed as a string. For example, if `keys` is "$KITTENS" and the `KITTENS` environment variable is set to "cute kittens", the test types "cute kittens", but if the `KITTENS` environment variable isn't defined, the test types the string "$KITTENS".

**Warning:** If you want to pass sensitive strings like usernames or passwords into the `type` action, store those values in a local .env file, point `env` to that file, and reference the variable in `keys`. Don't include cleartext passwords in your tests. Don't check .env files with sensitive data into a repository. Be careful with your credentials! Consult your security team if you have concerns.

Format:

```json
{
  "action": "type",
  "css": "[title=Search]",
  "keys": "kittens",
  "trailingSpecialKey": "Enter"
}
```

Advanced format with an environment variable:

```json
{
  "action": "type",
  "css": "input#password",
  "keys": "$PASSWORD",
  "trailingSpecialKey": "Enter",
  "envs": "./sample/variables.env"
}
```

### Move mouse

Move the mouse to an element specified by CSS selectors.

**Note:** The mouse cursor is visible in both recordings and screenshots.

Format:

```json
{
  "action": "moveMouse",
  "css": "[title=Search]",
  "alignH": "center",
  "alignV": "center",
  "offsetX": 10,
  "offsetY": 10
}
```

### Scroll

Scroll the current page by a specified number of pixels. For `x`, positive values scroll right and negative values scroll left. For `y`, positive values scroll down and negative values scroll up.

Format:

```json
{
  "action": "scroll",
  "x": 100,
  "y": 100
}
```

### Wait

Pause before performing the next action. If `css` is set, this action waits until the element is available or the `duration` is met, whichever comes first. If not set, `duration` defaults to `10000` milliseconds.

Format:

```json
{
  "action": "wait",
  "css": "[title=Search]",
  "duration": 500
}
```

### Screenshot

Capture an image of the current browser viewport. Supported extensions: .png

To match previously captured screenshots to the current viewport, set `matchPrevious` to `true` and specify a `matchThreshold` value. `matchThreshold` is a value between 0 and 1 that specifies what percentage of a screenshot can change before the action fails. For example, a `matchThreshold` value of `0.1` makes the action pass if the screenshots are up to 10% different or fail if the screenshots are 11% or more different. Screenshot comparison is based on pixel-level image analysis.

Format:

```json
{
  "action": "screenshot",
  "mediaDirectory": "samples",
  "filename": "results.png",
  "matchPrevious": true,
  "matchThreshold": 0.1
}
```

### Check a link

Check if a link returns an acceptable status code from a GET request. If `uri` doesn't include a protocol, the protocol defaults to HTTPS. If `statuscodes` isn't specified, defaults to `[200]`.

Format:

```json
{
  "action": "checkLink",
  "uri": "https://www.google.com",
  "statusCodes": [ 200 ]
}
```

### Start recording

Start recording the current browser viewport. Must be followed by a `stopRecording` action. Supported extensions: .mp4, .gif

**Note:** `.gif` format is **not** recommended. Because of file format and encoding differences, `.gif` files tend to be ~6.5 times larger than `.mp4` files, and with lower visual fidelity. But if `.gif` is a hard requirement for you, it's here. Creating `.gif` files requires `ffmpeg` installed on the machine that runs `doc-unit-test` and also creates `.mp4` files of the recordings.

Format:

```json
{
  "action": "startRecording",
  "mediaDirectory": "samples",
  "filename": "results.mp4",
  "gifFps": 15,
  "gifWidth": 400
}
```

### Stop recording

Stop recording the current browser viewport.

Format:

```json
{
  "action": "stopRecording"
}
```

### Run shell command

Perform a native shell command on the machine running `doc-unit-test`. This can be a single command or a script. Set environment variables before running the command by specifying an env file in the `env` field. For reference, see [variables.env](https://github.com/hawkeyexl/doc-unit-test/blob/master/sample/variables.env).

Returns `PASS` if the command has an exit code of `0`. Returns `FAIL` if the command had a non-`0` exit code and outputs a `stderr` value.

Format:

```json
{
  "action": "runShell",
  "command": "echo $username",
  "env": "./variables.env"
}
```

## Analytics

By default, `doc-unit-test` doesn't collect any information about tests, devices, users, or documentation and doesn't check in with any external service or server. If you want to help inform decisions about the future development of `doc-unit-test`—such as feature development and documentation creation—you can opt into sending anonymized analytics after you run tests at one of the multiple levels of detail.

There are multiple ways to turn on analytics:

- config setting: In your [config](https://github.com/hawkeyexl/doc-unit-test/blob/master/sample/config.json), set `analytics.send` to true.
- CLI argument: When running `doc-unit-test` as a CLI tool, include `-a true` or `--analytics true`. This overrides any setting you specified in your config.

Most fields are self-explanatory, but a few merit additional description:

- `version` is populated with the version of your `doc-unit-test` instance.
- `userId` is whatever arbitrary string, if any, you specify to identify the individual, workgroup, or organization running the tests.
- `detailLevel` must match one of the four supported levels of detail:
  - `run` indicates that tests were run, and that's about it. It omits the `tests`, `actions`, and `actionDetails` objects.
  - `test` includes aggregate data on the number of tests you ran and the tests' PASS/FAIL rates. It omits the `actions`, and `actionDetails` objects.
  - `action-simple` includes aggregate data on the number of actions in tests you ran and the actions' PASS/FAIL rates. It omits the `actionDetails` object.
  - `action-detailed` includes aggregate data on the kinds of actions you ran and the actions' PASS/FAIL rates. It doesn't omit any objects.

The analytics object has the following schema:

```json
{
  "version": "0.1.8",
  "userId": "",
  "detailLevel": "action-detailed",
  "tests": {
    "numberTests": 0,
    "passed": 0,
    "failed": 0
  },
  "actions": {
    "numberActions": 0,
    "averageNumberActionsPerTest": 0,
    "maxActionsPerTest": 0,
    "minActionsPerTest": 0,
    "passed": 0,
    "failed": 0
  },
  "actionDetails": {
    "goTo": {
      "numberInstances": 0,
      "passed": 0,
      "failed": 0,
      "uri": 0
    },
    "find": {
      "numberInstances": 0,
      "passed": 0,
      "failed": 0,
      "wait": {
        "numberInstances": 0,
        "duration": 0
      },
      "matchText": {
        "numberInstances": 0,
        "text": 0
      },
      "moveMouse": {
        "numberInstances": 0,
        "alignH": 0,
        "alignV": 0,
        "offsetX": 0,
        "offsetY": 0
      },
      "click": {
        "numberInstances": 0
      },
      "type": {
        "numberInstances": 0,
        "keys": 0,
        "trailingSpecialKey": 0,
        "env": 0
      }
    },
    "matchText": {
      "numberInstances": 0,
      "passed": 0,
      "failed": 0,
      "css": 0,
      "text": 0
    },
    "click": {
      "numberInstances": 0,
      "passed": 0,
      "failed": 0,
      "css": 0
    },
    "type": {
      "numberInstances": 0,
      "passed": 0,
      "failed": 0,
      "css": 0,
      "keys": 0,
      "trailingSpecialKey": 0,
      "env": 0
    },
    "moveMouse": {
      "numberInstances": 0,
      "passed": 0,
      "failed": 0,
      "css": 0,
      "alignH": 0,
      "alignV": 0,
      "offsetX": 0,
      "offsetY": 0
    },
    "scroll": {
      "numberInstances": 0,
      "passed": 0,
      "failed": 0,
      "x": 0,
      "y": 0
    },
    "wait": {
      "numberInstances": 0,
      "passed": 0,
      "failed": 0,
      "duration": 0,
      "css": 0
    },
    "screenshot": {
      "numberInstances": 0,
      "passed": 0,
      "failed": 0,
      "mediaDirectory": 0,
      "filename": 0,
      "matchPrevious": 0,
      "matchThreshold": 0
    },
    "startRecording": {
      "numberInstances": 0,
      "passed": 0,
      "failed": 0,
      "mediaDirectory": 0,
      "filename": 0,
      "gifFps": 0,
      "gifWidth": 0
    },
    "stopRecording": {
      "numberInstances": 0,
      "passed": 0,
      "failed": 0
    },
    "checkLink": {
      "numberInstances": 0,
      "passed": 0,
      "failed": 0,
      "uri": 0,
      "statusCodes": 0
    },
    "runShell": {
      "numberInstances": 0,
      "passed": 0,
      "failed": 0,
      "command": 0,
      "env": 0
    }
  }
}
```

### Custom analytics servers

If you opt into sending analytics, you can add additional servers that `doc-unit-test` should send the analytics object to. Custom servers are specified in your config and have the following schema.

`params` and `headers` are optional.

```json
{
  ...
  "analytics": {
    ...
    "customServers": [
      {
        "name": "My Analytics Server",
        "method": "post",
        "url": "https://my.analytics-server.com/endpoint",
        "params": {
          "param_secret": "LifeTheUniverseAndEverything"
        },
        "headers": {
          "header_secret": "42"
        }
      }
    ]
  }
  ...
}
```

### Turn off analytics

Analytics reporting is off by default. If you want to make extra sure that `doc-unit-test` doesn't collect analytics, you have a few options:

- config setting: In your [config](https://github.com/hawkeyexl/doc-unit-test/blob/master/sample/config.json), set `analytics.send` to false.
- CLI argument: When running `doc-unit-test` as a CLI tool, include `-a false` or `--analytics false`. This overrides any setting you specified in your config.
- Modify the code (if you're paranoid):
  1. In [src/index.js](https://github.com/hawkeyexl/doc-unit-test/blob/master/src/index.js), remove all references to `sendAnalytics()`.
  1. Delete [src/libs/analytics.js](https://github.com/hawkeyexl/doc-unit-test/blob/master/src/libs/analytics.js).

**Note:** Updating `doc-unit-test` may revert any modified code, so be ready to make code edits repeatedly.

## Potential future features

- Browser auto-detection and fallback.
- Improved default config experience.
- Environment variable overrides for config options.
- Docker image with bundled Chromium/Chrome/Firefox.
- New/upgraded test actions:
  - New: Curl commands. (Support substitution/setting env vars. Only check for `200 OK`.)
  - New: Test if a referenced image (such as an icon) is present in the captured screenshot.
  - Upgrade: `screenshot` and `startRecording` boolean for whether to perform the action or not if the expected output file already exists.
  - Upgrade: `startRecording` to remove MP4 when the output is a GIF.
  - Upgrade: `startRecording` and `stopRecording` to support start, stop, and intermediate test action state image matching to track differences between video captures from different runs.
  - Upgrade: `startRecording` to store the output file in a different location if a recorded action fails. This could help with debugging.
  - Upgrade: `wait` action to support waiting for a specific element to be present, regardless of duration.
- In-content test framing to identify when content is covered by a test defined in another file. This could enable content coverage analysis.
- Suggest tests by parsing document text.
  - Automatically insert suggested tests based on document text.

## License

This project uses the [MIT license](https://github.com/hawkeyexl/doc-unit-test/blob/master/LICENSE).
