# Variables
IMAGE_NAME = capital-gains
CONTAINER_NAME = capital-gains-container
INPUT_DIR = $(shell pwd)/tests/fixtures/inputs

# Commands
.PHONY: build run run-interactive clean

# Build the Docker image
build:
	docker build -t $(IMAGE_NAME) .

# Run the container interactively (without an input file)
run:
	@echo "Running the container in interactive mode..."
	docker run -it --rm --name $(CONTAINER_NAME) $(IMAGE_NAME) node src/index.js
	
# Run the container with a specific input file
run-file:
	@echo "Running the container with input file: $(FILE)"
	docker run -it --rm --name $(CONTAINER_NAME) -v $(INPUT_DIR):/usr/src/app/inputs $(IMAGE_NAME) sh -c "node src/index.js < /usr/src/app/inputs/$(FILE)"


# Clean up containers and images
clean:
	@echo "Removing containers and images..."
	docker rm -f $(CONTAINER_NAME) || true
	docker rmi -f $(IMAGE_NAME) || true