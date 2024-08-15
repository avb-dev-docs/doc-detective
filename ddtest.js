

let testOne = `# Doc Detective documentation overview

[Doc Detective documentation](https://doc-detective.com) is split into a few key sections:

- The landing page discusses what Doc Detective is, what it does, and who might find it useful.

- [Get started](https://doc-detective.com/get-started.html) covers how to quickly get up and running with Doc Detective.

- The [references](https://doc-detective.com/reference/) detail the various JSON objects that Doc Detective expects for [configs](https://doc-detective.com/reference/schemas/config.html), [test specifications](https://doc-detective.com/reference/schemas/specification.html), [tests](https://doc-detective.com/reference/schemas/test), actions, and more. Open [typeKeys](https://doc-detective.com/reference/schemas/typeKeys.html)--or any other schema--and you'll find three sections: **Description**, **Fields**, and **Examples**.

![Search results.](reference.png)`




let testTwo = `# Doc Detective documentation overview

[comment]: # (test start {"id":"doc-detective-docs", "detectSteps": false})

[Doc Detective documentation](http://doc-detective.com) is split into a few key sections:

[comment]: # (step {"action":"checkLink", "url":"https://doc-detective.com"})

- The landing page discusses what Doc Detective is, what it does, and who might find it useful.

- [Get started](https://doc-detective.com/get-started.html) covers how to quickly get up and running with Doc Detective.

  [comment]: # (step {"action":"checkLink", "url":"https://doc-detective.com/get-started.html"})

- The [references](https://doc-detective.com/reference/) detail the various JSON objects that Doc Detective expects for [configs](https://doc-detective.com/reference/schemas/config.html), [test specifications](https://doc-detective.com/reference/schemas/specification.html), [tests](https://doc-detective.com/reference/schemas/test), actions, and more. Open [typeKeys](https://doc-detective.com/reference/schemas/typeKeys.html)--or any other schema--and you'll find three sections: **Description**, **Fields**, and **Examples**.

  [comment]: # (step {"action":"checkLink", "url":"https://doc-detective.com/reference/"})
  [comment]: # (step {"action":"checkLink", "url":"https://doc-detective.com/reference/schemas/config.html"})
  [comment]: # (step {"action":"checkLink", "url":"https://doc-detective.com/reference/schemas/specification.html"})
  [comment]: # (step {"action":"checkLink", "url":"https://doc-detective.com/reference/schemas/test.html"})
  [comment]: # (step {"action":"goTo", "url":"https://doc-detective.com/reference/schemas/typeKeys.html"})
  [comment]: # (step {"action":"find", "selector":"h2#description", "matchText":"Description"})
  [comment]: # (step {"action":"find", "selector":"h2#fields", "matchText":"Fields"})
  [comment]: # (step {"action":"find", "selector":"h2#examples", "matchText":"Examples"})

![Search results.](reference.png)

[comment]: # (step {"action":"saveScreenshot", "path":"reference.png", "maxVariation":5, "overwrite":"byVariation"})
[comment]: # (test end)`



let testThree = {
    "tests": [
      {
        "steps": [
          {
            "action": "runShell",
            "description": "Run a Docker container and check the output.",
            "command": "docker run hello-world",
            "output": "Hello from Docker!"
          }
        ]
      }
    ]
  }
  


let testFour = {
    "tests": [
      {
        "steps": [
          {
            "action": "checkLink",
            "url": "https://www.duckduckgo.com"
          },
          {
            "action": "httpRequest",
            "url": "https://reqres.in/api/users",
            "method": "post",
            "requestData": {
              "name": "morpheus",
              "job": "leader"
            },
            "responseData": {
              "name": "morpheus",
              "job": "leader"
            },
            "statusCodes": [200, 201]
          }
        ]
      }
    ]
  }
  



let testFive = `To search for American Shorthair kittens,

1. Go to [DuckDuckGo](https://www.duckduckgo.com).

   [comment]: # (step { "action": "goTo", "url": "https://www.duckduckgo.com"})
   [comment]: # (step { "action": "startRecording", "path": "search-results.gif"})

2. In the search bar, enter "American Shorthair kittens", then press Enter.

   [comment]: # (step { "action": "find", "selector": "#searchbox_input", "click": true })
   [comment]: # (step { "action": "typeKeys", "keys": ["American Shorthair kittens", "$ENTER$"] })
   [comment]: # (step { "action": "find", "selector": "[data-testid='web-vertical']" })
   [comment]: # (step { "action": "stopRecording" })

![](search-results.gif)
`


let testSix = `{
  "tests": [
    {
      "steps": [
        {
          "action": "goTo",
          "url": "https://www.duckduckgo.com"
        },
        {
          "action": "find",
          "selector": "#searchbox_input",
          "click": true,
          "typeKeys": {
            "keys": ["American Shorthair kittens", "$ENTER$"]
          }
        },
        {
          "action": "find",
          "selector": "[data-testid='web-vertical']"
        },
        {
          "action": "saveScreenshot",
          "path": "search-results.png"
        }
      ]
    }
  ]
}
`