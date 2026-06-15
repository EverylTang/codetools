import assert from "node:assert/strict";
import test from "node:test";

import { generateFrpcConfig, type TunnelFormState } from "../src/lib/tunnelConfig.ts";

const baseState: TunnelFormState = {
  serverAddress: "123.123.123.123",
  serverPort: "7000",
  token: "token123",
  tunnels: [
    {
      id: "web",
      name: "web",
      protocol: "http",
      localIp: "127.0.0.1",
      localPort: "3000",
      customDomain: "myapp.example.com",
      remotePort: "8080",
    },
  ],
};

test("generates an HTTP frpc.ini with custom domain", () => {
  const result = generateFrpcConfig(baseState);

  assert.equal(result.errors.length, 0);
  assert.equal(
    result.config,
    [
      "[common]",
      "server_addr = 123.123.123.123",
      "server_port = 7000",
      "token = token123",
      "",
      "[web]",
      "type = http",
      "local_ip = 127.0.0.1",
      "local_port = 3000",
      "custom_domains = myapp.example.com",
    ].join("\n"),
  );
});

test("generates a TCP frpc.ini with remote port and omits token when empty", () => {
  const result = generateFrpcConfig({
    ...baseState,
    token: "",
    tunnels: [
      {
        id: "ssh",
        name: "ssh",
        protocol: "tcp",
        localIp: "127.0.0.1",
        localPort: "22",
        customDomain: "",
        remotePort: "60022",
      },
    ],
  });

  assert.equal(result.errors.length, 0);
  assert.equal(
    result.config,
    [
      "[common]",
      "server_addr = 123.123.123.123",
      "server_port = 7000",
      "",
      "[ssh]",
      "type = tcp",
      "local_ip = 127.0.0.1",
      "local_port = 22",
      "remote_port = 60022",
    ].join("\n"),
  );
});

test("reports missing protocol-specific fields", () => {
  const result = generateFrpcConfig({
    ...baseState,
    tunnels: [
      {
        id: "broken",
        name: "broken tunnel",
        protocol: "http",
        localIp: "127.0.0.1",
        localPort: "3000",
        customDomain: "",
        remotePort: "",
      },
    ],
  });

  assert.deepEqual(result.errors, ["broken tunnel needs a custom domain for HTTP mode."]);
});
