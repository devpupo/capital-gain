### Capital Gains Calculator

A command-line application that calculates taxes on stock market operations based on Brazilian tax rules.

## Overview

This Capital Gains Calculator processes stock market operations (buy and sell) and calculates the taxes to be paid according to specific rules:

- 20% tax on profits from sell operations
- Tax exemption for operations with total value ≤ R$ 20,000
- Loss deduction from future profits
- Weighted average price calculation for stock holdings


## Architecture

The project follows a clean architecture approach with the following layers:

### Domain Layer

- Contains the core business logic and entities
- Includes `Portfolio`, `Operation`, and `TaxCalculator` classes
- Implements business rules independent of external frameworks


### Application Layer

- Orchestrates the flow of data between the domain and infrastructure layers
- Contains the `OperationProcessor`, `OperationController`, and strategy classes
- Implements the Strategy pattern for different operation types (buy/sell)


### Infrastructure Layer

- Handles external concerns like I/O operations and parsing
- Includes `InputHandler`, `OutputHandler`, and `JsonParser` classes
- Manages the interaction with the user through stdin/stdout


### Dependency Injection

- Uses Awilix for dependency injection
- All components are registered in a container for easy testing and maintenance


## Installation

### Prerequisites

- Node.js 20.x or higher
- npm or yarn
- Docker (optional, for containerized execution)


### Local Installation

```shellscript
# Extract the ZIP file
unzip capital-gains.zip
cd capital-gains

# Install dependencies
npm install
```

## Running the Application

### Locally

```shellscript
# Run the application
node src/index.js
```

### Using Docker

#### Building the Docker Image

```shellscript
# Build the image
docker build -t capital-gains .

# Or use the Makefile
make build
```

#### Running the Docker Container

```shellscript
# Run interactively
docker run -it --rm --name capital-gains-container capital-gains

# Or use the Makefile
make run
```

#### Running with Input Files

```shellscript
# Run with a specific input file
docker run -it --rm -v $(pwd)/tests/fixtures/inputs:/usr/src/app/inputs capital-gains sh -c "node src/index.js < /usr/src/app/inputs/case1.txt"

# Or use the Makefile
make run-file FILE=case1.txt
```

## Makefile Commands

The project includes a Makefile with the following commands:

- `make build`: Builds the Docker image
- `make run`: Runs the container in interactive mode
- `make run-file FILE=filename.txt`: Runs the container with a specific input file from the `tests/fixtures/inputs` directory
- `make clean`: Removes containers and images


## Testing

The project includes unit, integration, and end-to-end tests.

```shellscript
# Run all tests
npm test

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:e2e

# Run tests with coverage
npm run test:coverage

# Run a specific test case from fixtures
CASE_NUMBER=1 npm run test:case
```

The `test:case` script allows you to run the application with predefined test cases from the `tests/fixtures/inputs` directory. Set the `CASE_NUMBER` environment variable to specify which case to run:

```shellscript
# Run test case 1
CASE_NUMBER=1 npm run test:case

# Run test case 2
CASE_NUMBER=2 npm run test:case
```

This is useful for quickly testing the application with the example cases provided in the specification. The test case files have a `.txt` extension but contain JSON data.

## Input Format

The application accepts JSON input in the following format:

```json
[
  {"operation":"buy", "unit-cost":10.00, "quantity": 100},
  {"operation":"sell", "unit-cost":15.00, "quantity": 50},
  {"operation":"sell", "unit-cost":15.00, "quantity": 50}
]
```

Each line represents a separate simulation. The application processes each line independently and outputs the tax calculation results.

### Input Methods

1. **Direct Input**: Type or paste JSON directly into the terminal when running the application.
2. **Input Redirection**: Use shell redirection to provide input from a file:

```shellscript
node src/index.js < input.txt
```


3. **Docker with File**: Mount a volume and redirect input:

```shellscript
docker run -it --rm -v $(pwd)/inputs:/inputs capital-gains sh -c "node src/index.js < /inputs/case1.txt"
```


4. **Test Case Script**: Use the `test:case` script to run predefined test cases:

```shellscript
CASE_NUMBER=1 npm run test:case
```




## Output Format

The application outputs a JSON array with the tax calculation for each operation:

```json
[{"tax": 0.0},{"tax": 0.0},{"tax": 0.0}]
```

## Examples

### Example 1: Basic Buy and Sell

Input (case1.txt):

```json
[{"operation":"buy", "unit-cost":10.00, "quantity": 100},{"operation":"sell", "unit-cost":15.00, "quantity": 50},{"operation":"sell", "unit-cost":15.00, "quantity": 50}]
```

Output:

```json
[{"tax": 0.0},{"tax": 0.0},{"tax": 0.0}]
```

### Example 2: Profit and Loss

Input (case2.txt):

```json
[{"operation":"buy", "unit-cost":10.00, "quantity": 10000},{"operation":"sell", "unit-cost":20.00, "quantity": 5000},{"operation":"sell", "unit-cost":5.00, "quantity": 5000}]
```

Output:

```json
[{"tax": 0.0},{"tax": 10000.0},{"tax": 0.0}]
```