# Environments

In this folder there are a few simple configurations to try Double Zero in a local environment,
but in a close to production state.

### Proxy mode

This configuration leverages existing block explorer infrastructure instead of running all indexing components locally.
It connects to an established explorer API URL provided via configuration.

It can be configured changing the file `compose-proxy.env`. For example, this
is the configuration to proxy to mainnet:

``` .env
TARGET_RPC="https://mainnet.era.zksync.io"
BLOCK_EXPLORER_API_URL="https://block-explorer-api.mainnet.zksync.io"
```

Once the configuration is in place, the services can be started using:

``` shell
./launch-proxy-env.sh
```

Permissions can be configured editing [this](./compose-proxy-permissions.yaml) file.

### Hyperchain mode

This configuration is meant to target any hyperchain. In particular double zero
was meant thinking on private access for a validium chain. You can find more info
about how to create your own validium chain [here](#spawning-a-local-validium-chain)

``` .env
# validium.env
TARGET_RPC="http://my-private-rpc:4444"
```

Permissions can be configured editing [this](./compose-00-permissions.yaml) file.

In case that you are running a local validium chain, the easiest way to
connect the docker containers with the chain running in the host machine
is by providing the local ip of the host machine. In linux you can do this
by running

``` shell
ifconfig wlan0 | grep "inet " | grep -Fv 127.0.0.1 | awk '{print $2}'
```

Or in mac:

``` shell
ipconfig getifaddr en0
```

Then, the ip can be combined with the port of the local rpc. The final
address is something like `http://{my-ip}:{port}`.

Once the configuration is in place the services can be started like this:

``` shell
./launch-hyperchain-env.sh
```


## Spawning a local validium chain

This can be done using zkstack: https://docs.zksync.io/zk-stack/running-a-zk-chain/quickstart
