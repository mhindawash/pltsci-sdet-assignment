/// <reference types="cypress" />

function makeRequestParams({ roomSize, coords, patches, instructions }) {
	return {
		method: "POST",
		url: "http://localhost:8080/v1/cleaning-sessions",
		headers: { "Content-Type": "application/json" },
		body: {
			roomSize: roomSize,
			coords: coords,
			patches: patches,
			instructions: instructions,
		},
		failOnStatusCode: false,
	};
}

describe("Testing dirt patches and outer limits/size", () => {
	it("verifying no dirt found", () => {
		cy.request(
			makeRequestParams({
				roomSize: [5, 5],
				coords: [0, 0],
				patches: [],
				instructions: "NNNNESSSSENNNNESSSSENNNN",
			})
		).then((response) => {
			expect(response.status).to.equal(200);
			expect(response.body).to.deep.equal({
				coords: [4, 4],
				patches: 0,
			});

			cy.log("There was nothing to clean");
		});
	});

	it("verifying patches have to be cleaned to count", () => {
		cy.request(
			makeRequestParams({
				roomSize: [5, 5],
				coords: [0, 0],
				patches: [
					[1, 1],
					[1, 2],
					[2, 2],
					[2, 1],
				],
				instructions: "NNNNEEEESSSSWWWW",
			})
		).then((response) => {
			expect(response.status).to.equal(200);
			expect(response.body).to.deep.equal({
				coords: [0, 0],
				patches: 0,
			});

			cy.log("verifying patches are cleaned");
		});
	});

	it("verifying the amount of patches isn't duplicates", () => {
		cy.request(
			makeRequestParams({
				roomSize: [5, 5],
				coords: [0, 0],
				patches: [
					[1, 1],
					[1, 2],
					[2, 2],
					[2, 1],
				],
				instructions: "NEEWWS",
			})
		).then((response) => {
			expect(response.status).to.equal(200);
			expect(response.body).to.deep.equal({
				coords: [0, 0],
				patches: 2,
			});

			cy.log("non-duplicate patches");
		});
	});

	it("verifying outer limits", () => {
		cy.request(
			makeRequestParams({
				roomSize: [5, 5],
				coords: [0, 0],
				patches: [
					[42, 42],
					[11, 11],
					[13, 13],
				],
				instructions: "NNNNNNES",
			})
		).then((response) => {
			expect(response.status).to.equal(200);
			expect(response.body).to.deep.equal({
				coords: [1, 3],
				patches: 0,
			});

			cy.log("Roomba never left the room");
		});
	});

	it("verifying that changing the parameters for size and coordinates doesn't break the test", () => {
		cy.request(
			makeRequestParams({
				roomSize: [20, 20],
				coords: [3, 5],
				patches: [
					[3, 6],
					[4, 6],
					[4, 7],
					[5, 7],
					[5, 6],
				],
				instructions: "NNESSENNWWWWWSSSSSSSS",
			})
		).then((response) => {
			expect(response.status).to.equal(200);
			expect(response.body).to.deep.equal({
				coords: [0, 0],
				patches: 5,
			});

			cy.log("There was nothing to clean");
		});
	});

	it("verifying that the roomba doesn't move without instructions", () => {
		cy.request(
			makeRequestParams({
				roomSize: [5, 5],
				coords: [0, 0],
				patches: [
					[1, 1],
					[1, 2],
					[2, 2],
					[2, 1],
				],
				instructions: "",
			})
		).then((response) => {
			expect(response.status).to.equal(200);
			expect(response.body).to.deep.equal({
				coords: [0, 0],
				patches: 0,
			});

			cy.log("Roomba never left the dock");
		});
	});
});

describe("Tests that Hoover can never exceed the boundaries of the room. The Hoover spins in place if it encounters a wall.", () => {
	[
		{ cardinalDirection: "N", expectedCoord: [0, 4] },
		{ cardinalDirection: "E", expectedCoord: [4, 0] },
		{ cardinalDirection: "S", expectedCoord: [0, 0] },
		{ cardinalDirection: "W", expectedCoord: [0, 0] },
	].forEach((testArgs) => {
		it(`Test that you cannot go past boundary in ${testArgs.cardinalDirection} direction`, () => {
			cy.request(
				makeRequestParams({
					roomSize: [5, 5],
					coords: [0, 0],
					patches: [],
					instructions: testArgs.cardinalDirection.repeat(6),
				})
			).then((response) => {
				expect(response.status).to.equal(200);
				expect(response.body).to.deep.equal({
					coords: testArgs.expectedCoord,
					patches: 0,
				});
			});
		});
	});
});

describe("Basic Test", () => {
	it("Basic test to confirm basic functionality, based on the example inputs and outputs given in the specification", () => {
		cy.request(
			makeRequestParams({
				roomSize: [5, 5],
				coords: [0, 0],
				patches: [
					[1, 1],
					[1, 2],
					[2, 2],
					[2, 1],
				],
				instructions: "NNESEESWNWW",
			})
		).then((response) => {
			expect(response.status).to.equal(200);
			expect(response.body).to.deep.equal({
				coords: [0, 1],
				patches: 3,
			});

			cy.log("THE BASIC TEST WORKS!");
		});
	});
});

describe("Tests that invalid inputs should return 400", () => {
	it("verifying invalid instructions", () => {
		cy.request(
			makeRequestParams({
				roomSize: [5, 5],
				coords: [0, 0],
				patches: [
					[6, 1],
					[6, 2],
					[6, 3],
				],
				instructions: "XYZ",
			})
		).then((response) => {
			expect(response.status).to.equal(400);

			cy.log("invalid instructions");
		});
	});

	it("verifying invalid patch input", () => {
		cy.request(
			makeRequestParams({
				roomSize: [5, 5],
				coords: [0, 0],
				patches: [[-0.2202, ], [ , -3], [0.4, -23.3]],
				instructions: "NNNNNNES",
			})
		).then((response) => {
			expect(response.status).to.equal(400);

			cy.log("invalid patch input");
		});
	});

	it("verifying invalid starting position", () => {
		cy.request(
			makeRequestParams({
				roomSize: [5, 5],
				coords: [0.01, ],
				patches: [
					[6, 1],
					[6, 2],
					[6, 3],
				],
				instructions: "NNNNNNES",
			})
		).then((response) => {
			expect(response.status).to.equal(400);

			cy.log("invalid starting position");
		});
	});
});
