SDET Assignment Test Suite
=========================

This repository contains the test suite for the SDET Assignment, which is designed to test the functionality of the robotic hoover service.

Setup Instructions
------------------

**Prerequisites**
- Docker v18+ must be installed on your machine.

**Building the Service**

To build the service, follow these steps:
1. Open a terminal or command prompt.
2. Navigate to the root of this repository.
3. Run the following commands:

- `sudo chmod +x service/run.sh`
- `docker build -t pltsci-sdet-assignment service`

**Running the Service**

To run the service, execute the following command:

- `docker run -d -p 8080:8080 --name pltsci-sdet-assignment pltsci-sdet-assignment`

### Testing the Service Endpoint
To test whether the service is running correctly, you can use the `curl` command. Execute the following command in a terminal or command prompt:

- `curl -H 'Content-Type: application/json' -X POST -d '{ "roomSize" : [5, 5], "coords" : [1, 2], "patches" : [ [1, 0], [2, 2], [2, 3] ], "instructions" : "NNESEESWNWW" }' http://localhost:8080/v1/cleaning-sessions`

If the service is running properly, it should return a response with the final hoover position and the number of cleaned patches.

Cypress Test Execution Guide
----------------------------

To run the Cypress test suite, follow these steps:

1. Make sure the service is running using the instructions provided above.
2. Open a terminal or command prompt.
3. Navigate to the root of this repository.
4. Run the following command to install the necessary dependencies:

- `npm install`

5. Once the dependencies are installed, run the following command to launch Cypress:

- `npx cypress open`

6. Cypress Test Runner will open, showing a list of available test files.
7. Click on a test file to run the tests in that file.
8. The tests will run in a new browser window or tab, and you can see the test execution and results.

Test Suite Details
------------------

**Technology Stack**
- Cypress: A JavaScript-based end-to-end testing framework.

**Test Structure**
The test suite is implemented using Cypress, a widely-used end-to-end testing framework. The test cases are organized based on different scenarios, including valid inputs, invalid inputs, and edge cases. Each test case verifies the expected behavior of the service by comparing the actual results with the expected results.

The tests are written in a behavior-driven development (BDD) style, using descriptive test titles and assertions to clearly define the expected behavior and outcomes.

**Reasoning for Using Cypress**
Cypress was chosen for this test suite due to its simplicity, ease of use, and powerful features for testing web applications. It provides a clean and expressive syntax for writing tests, as well as excellent debugging and built-in time-travel capabilities.

Cypress also offers robust support for making HTTP requests and handling RESTful APIs, which is crucial for testing the service endpoints in this assignment.

**Bugs Found**
During the testing process, two bugs were detected. The details of these bugs are provided in the "BugsFound.txt" file in this repository. Please refer to that file for more information on the bugs and their impact.

Additional Notes
----------------

If you need to restart the service to clear the cache, use the following command:

- `docker restart pltsci-sdet-assignment`

Thank you for reviewing this test suite. Should you have any further questions or need additional information, please don't hesitate to reach out.
