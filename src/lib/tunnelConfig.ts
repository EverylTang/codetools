export type TunnelProtocol = "http" | "tcp";

export interface TunnelEntry {
  id: string;
  name: string;
  protocol: TunnelProtocol;
  localIp: string;
  localPort: string;
  customDomain: string;
  remotePort: string;
}

export interface TunnelFormState {
  serverAddress: string;
  serverPort: string;
  token: string;
  tunnels: TunnelEntry[];
}

export interface TunnelConfigResult {
  config: string;
  errors: string[];
}

function cleanValue(value: string): string {
  return value.trim();
}

function cleanSectionName(value: string, fallback: string): string {
  const cleaned = cleanValue(value)
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return cleaned || fallback;
}

function isMissing(value: string): boolean {
  return cleanValue(value).length === 0;
}

export function generateFrpcConfig(state: TunnelFormState): TunnelConfigResult {
  const errors: string[] = [];
  const serverAddress = cleanValue(state.serverAddress);
  const serverPort = cleanValue(state.serverPort);
  const token = cleanValue(state.token);

  if (!serverAddress) {
    errors.push("Server address is required.");
  }

  if (!serverPort) {
    errors.push("Server port is required.");
  }

  const validTunnels = state.tunnels.filter((tunnel) => {
    const label = cleanValue(tunnel.name) || tunnel.id;

    if (isMissing(tunnel.localIp)) {
      errors.push(`${label} needs a local IP.`);
    }

    if (isMissing(tunnel.localPort)) {
      errors.push(`${label} needs a local port.`);
    }

    if (tunnel.protocol === "http" && isMissing(tunnel.customDomain)) {
      errors.push(`${label} needs a custom domain for HTTP mode.`);
    }

    if (tunnel.protocol === "tcp" && isMissing(tunnel.remotePort)) {
      errors.push(`${label} needs a remote port for TCP mode.`);
    }

    return true;
  });

  if (errors.length > 0) {
    return { config: "", errors };
  }

  const lines = [
    "[common]",
    `server_addr = ${serverAddress}`,
    `server_port = ${serverPort}`,
  ];

  if (token) {
    lines.push(`token = ${token}`);
  }

  validTunnels.forEach((tunnel, index) => {
    const section = cleanSectionName(tunnel.name, `tunnel-${index + 1}`);

    lines.push(
      "",
      `[${section}]`,
      `type = ${tunnel.protocol}`,
      `local_ip = ${cleanValue(tunnel.localIp)}`,
      `local_port = ${cleanValue(tunnel.localPort)}`,
    );

    if (tunnel.protocol === "http") {
      lines.push(`custom_domains = ${cleanValue(tunnel.customDomain)}`);
    } else {
      lines.push(`remote_port = ${cleanValue(tunnel.remotePort)}`);
    }
  });

  return { config: lines.join("\n"), errors };
}
