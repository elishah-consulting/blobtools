# Make shell
default:
	devbox shell

launch:
# Install dependencies
	(cd ./backend && npm ci)
	(cd ./frontend && npm ci)
# Bring up the docker containers
	make down
	make up

# Migrate and seed database
	make seed-db

# Build celestia
	make celestia-build

# Echo wallet to fund
	echo "----------------------------------------"
	echo "Wallet to fund: "
	make celestia-list-wallet
	echo "----------------------------------------"

# Welcome message
	@echo "----------------------------------------"
	@echo "Welcome to the Daytwo Dev Environment."
	@echo "What will you build today?"
	@echo "----------------------------------------"

# Prepare Celestia
celestia-build:
	(cd ./celestia-node && make build && make install && make cel-key)
	./celestia-node/build/celestia version
	./celestia-node/build/celestia light init --p2p.network mocha

celestia-list-wallet:
# List wallet key to fund for gas
	./celestia-node/cel-key list --node.type light --keyring-backend test --p2p.network mocha

celestia-create-test-key:
	./celestia-node/cel-key add test-key --keyring-backend test --node.type light   --p2p.network mocha

celestia-reveal-auth-token:
	./celestia-node/build/celestia light auth admin --p2p.network mocha
# echo "AUTH_TOKEN=$AUTH_TOKEN" >> .env
# echo "AUTH_TOKEN=$AUTH_TOKEN"

celestia-start-client:
	./celestia-node/build/celestia light start --core.ip rpc-mocha.pops.one --p2p.network mocha --keyring.accname test-key
#  ./celestia-node/build/celestia light start --core.ip <URI> --keyring.accname <key-name> \
  --p2p.network mocha # for wallet funding


# Setup docker containers
up:
	docker compose -f "compose.yml" up -d --build --wait

# Teardown docker containers
down:
	docker compose -f "compose.yml" down
	(echo "y" | docker volume prune)
	clear

# Migrate and seed database
seed-db:
	(cd ./backend && npm run db:migrate-dev)
