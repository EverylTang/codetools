"use client";

import { useState, useMemo } from "react";

interface StatusCode {
  code: number;
  name: string;
  description: string;
  category: string;
}

const STATUS_CODES: StatusCode[] = [
  { code: 100, name: "Continue", description: "The server has received the request headers and the client should proceed to send the request body.", category: "1xx Informational" },
  { code: 101, name: "Switching Protocols", description: "The server is switching protocols as requested by the client.", category: "1xx Informational" },
  { code: 102, name: "Processing", description: "The server has received and is processing the request, but no response is available yet.", category: "1xx Informational" },
  { code: 103, name: "Early Hints", description: "Used to return some response headers before final HTTP message.", category: "1xx Informational" },
  { code: 200, name: "OK", description: "The request has succeeded. The meaning depends on the HTTP method.", category: "2xx Success" },
  { code: 201, name: "Created", description: "The request has been fulfilled and a new resource has been created.", category: "2xx Success" },
  { code: 202, name: "Accepted", description: "The request has been accepted for processing, but the processing has not been completed.", category: "2xx Success" },
  { code: 203, name: "Non-Authoritative Information", description: "The returned metadata is not exactly the same as available from the origin server.", category: "2xx Success" },
  { code: 204, name: "No Content", description: "The server successfully processed the request and is not returning any content.", category: "2xx Success" },
  { code: 205, name: "Reset Content", description: "The server successfully processed the request and asks the client to reset the document view.", category: "2xx Success" },
  { code: 206, name: "Partial Content", description: "The server is delivering only part of the resource due to a range header sent by the client.", category: "2xx Success" },
  { code: 207, name: "Multi-Status", description: "The message body is an XML message containing multiple independent response codes.", category: "2xx Success" },
  { code: 208, name: "Already Reported", description: "The members of a DAV binding have already been enumerated in a preceding part of the response.", category: "2xx Success" },
  { code: 226, name: "IM Used", description: "The server has fulfilled a GET request for the resource, and the response is a representation of the result of instance manipulations.", category: "2xx Success" },
  { code: 300, name: "Multiple Choices", description: "The request has more than one possible response. The user should choose one.", category: "3xx Redirection" },
  { code: 301, name: "Moved Permanently", description: "The URL of the requested resource has been changed permanently. The new URL is given in the response.", category: "3xx Redirection" },
  { code: 302, name: "Found (Moved Temporarily)", description: "The requested resource resides temporarily under a different URI.", category: "3xx Redirection" },
  { code: 303, name: "See Other", description: "The response to the request can be found under another URI using the GET method.", category: "3xx Redirection" },
  { code: 304, name: "Not Modified", description: "The resource has not been modified since the version specified by the request headers.", category: "3xx Redirection" },
  { code: 305, name: "Use Proxy", description: "The requested resource is available only through a proxy. (Deprecated)", category: "3xx Redirection" },
  { code: 307, name: "Temporary Redirect", description: "The request should be repeated with another URI, but future requests can still use the original URI.", category: "3xx Redirection" },
  { code: 308, name: "Permanent Redirect", description: "The request and all future requests should be repeated using another URI.", category: "3xx Redirection" },
  { code: 400, name: "Bad Request", description: "The server cannot or will not process the request due to something that is perceived to be a client error.", category: "4xx Client Error" },
  { code: 401, name: "Unauthorized", description: "The request requires user authentication. The response must include a WWW-Authenticate header field.", category: "4xx Client Error" },
  { code: 402, name: "Payment Required", description: "Reserved for future use. Originally intended for digital payment systems.", category: "4xx Client Error" },
  { code: 403, name: "Forbidden", description: "The server understood the request but refuses to authorize it.", category: "4xx Client Error" },
  { code: 404, name: "Not Found", description: "The server cannot find the requested resource. This is the most common HTTP error.", category: "4xx Client Error" },
  { code: 405, name: "Method Not Allowed", description: "The request method is known by the server but is not supported by the target resource.", category: "4xx Client Error" },
  { code: 406, name: "Not Acceptable", description: "The target resource does not have a current representation acceptable to the user agent.", category: "4xx Client Error" },
  { code: 407, name: "Proxy Authentication Required", description: "The client must first authenticate itself with the proxy.", category: "4xx Client Error" },
  { code: 408, name: "Request Timeout", description: "The server timed out waiting for the request.", category: "4xx Client Error" },
  { code: 409, name: "Conflict", description: "The request could not be completed due to a conflict with the current state of the resource.", category: "4xx Client Error" },
  { code: 410, name: "Gone", description: "The requested resource is no longer available and will not be available again.", category: "4xx Client Error" },
  { code: 411, name: "Length Required", description: "The request did not specify the length of its content, which is required by the resource.", category: "4xx Client Error" },
  { code: 412, name: "Precondition Failed", description: "The server does not meet one of the preconditions specified in the request headers.", category: "4xx Client Error" },
  { code: 413, name: "Payload Too Large", description: "The request is larger than the server is willing or able to process.", category: "4xx Client Error" },
  { code: 414, name: "URI Too Long", description: "The URI provided was too long for the server to process.", category: "4xx Client Error" },
  { code: 415, name: "Unsupported Media Type", description: "The request entity has a media type which the server or resource does not support.", category: "4xx Client Error" },
  { code: 416, name: "Range Not Satisfiable", description: "The client has asked for a portion of the file, but the server cannot supply that portion.", category: "4xx Client Error" },
  { code: 417, name: "Expectation Failed", description: "The server cannot meet the requirements of the Expect request-header field.", category: "4xx Client Error" },
  { code: 418, name: "I'm a teapot", description: "The server refuses to brew coffee because it is, permanently, a teapot. (RFC 2324 April Fools' joke)", category: "4xx Client Error" },
  { code: 421, name: "Misdirected Request", description: "The request was directed at a server that is not able to produce a response.", category: "4xx Client Error" },
  { code: 422, name: "Unprocessable Entity", description: "The request was well-formed but was unable to be followed due to semantic errors.", category: "4xx Client Error" },
  { code: 423, name: "Locked", description: "The resource that is being accessed is locked.", category: "4xx Client Error" },
  { code: 424, name: "Failed Dependency", description: "The request failed because it depended on another request that failed.", category: "4xx Client Error" },
  { code: 425, name: "Too Early", description: "The server is unwilling to risk processing a request that might be replayed.", category: "4xx Client Error" },
  { code: 426, name: "Upgrade Required", description: "The server refuses to perform the request using the current protocol.", category: "4xx Client Error" },
  { code: 428, name: "Precondition Required", description: "The origin server requires the request to be conditional.", category: "4xx Client Error" },
  { code: 429, name: "Too Many Requests", description: "The user has sent too many requests in a given amount of time (rate limiting).", category: "4xx Client Error" },
  { code: 431, name: "Request Header Fields Too Large", description: "The server is unwilling to process the request because its header fields are too large.", category: "4xx Client Error" },
  { code: 451, name: "Unavailable For Legal Reasons", description: "The server is denying access to the resource as a consequence of a legal demand.", category: "4xx Client Error" },
  { code: 500, name: "Internal Server Error", description: "The server encountered an unexpected condition that prevented it from fulfilling the request.", category: "5xx Server Error" },
  { code: 501, name: "Not Implemented", description: "The server does not support the functionality required to fulfill the request.", category: "5xx Server Error" },
  { code: 502, name: "Bad Gateway", description: "The server, while acting as a gateway or proxy, received an invalid response from the upstream server.", category: "5xx Server Error" },
  { code: 503, name: "Service Unavailable", description: "The server is currently unable to handle the request due to temporary overloading or maintenance.", category: "5xx Server Error" },
  { code: 504, name: "Gateway Timeout", description: "The server, while acting as a gateway or proxy, did not receive a timely response from the upstream server.", category: "5xx Server Error" },
  { code: 505, name: "HTTP Version Not Supported", description: "The server does not support the HTTP protocol version used in the request.", category: "5xx Server Error" },
  { code: 506, name: "Variant Also Negotiates", description: "Transparent content negotiation for the request results in a circular reference.", category: "5xx Server Error" },
  { code: 507, name: "Insufficient Storage", description: "The server is unable to store the representation needed to complete the request.", category: "5xx Server Error" },
  { code: 508, name: "Loop Detected", description: "The server detected an infinite loop while processing the request.", category: "5xx Server Error" },
  { code: 510, name: "Not Extended", description: "Further extensions to the request are required for the server to fulfill it.", category: "5xx Server Error" },
  { code: 511, name: "Network Authentication Required", description: "The client needs to authenticate to gain network access.", category: "5xx Server Error" },
];

const CATEGORIES = ["All", "1xx Informational", "2xx Success", "3xx Redirection", "4xx Client Error", "5xx Server Error"];

export default function HttpStatusClient() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [copied, setCopied] = useState<number | null>(null);

  const filtered = useMemo(() => {
    return STATUS_CODES.filter(s => {
      const catMatch = category === "All" || s.category === category;
      const searchMatch = !search || s.code.toString().includes(search) || s.name.toLowerCase().includes(search.toLowerCase());
      return catMatch && searchMatch;
    });
  }, [search, category]);

  const copyStatus = (code: number) => {
    navigator.clipboard.writeText(code.toString());
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const getCategoryColor = (cat: string) => {
    if (cat.startsWith("1xx")) return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300";
    if (cat.startsWith("2xx")) return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300";
    if (cat.startsWith("3xx")) return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300";
    if (cat.startsWith("4xx")) return "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300";
    return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300";
  };

  return (
    <div className="flex flex-col flex-1 gap-4">
      {/* Search & Filter */}
      <div className="flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by code or name..."
          className="flex-1 p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-48 p-2 text-xs border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300"
        >
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Results */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="max-h-[500px] overflow-auto">
          {filtered.map((status) => (
            <div key={status.code} className="flex items-start gap-3 p-3 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <button
                onClick={() => copyStatus(status.code)}
                className="text-2xl font-bold font-mono text-gray-900 dark:text-gray-100 hover:text-blue-500 transition-colors min-w-[60px]"
                title="Click to copy"
              >
                {status.code}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{status.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${getCategoryColor(status.category)}`}>
                    {status.category}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{status.description}</p>
              </div>
              {copied === status.code && (
                <span className="text-[10px] text-green-500 shrink-0">Copied!</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="text-[10px] text-gray-400 dark:text-gray-500">
        {filtered.length} status codes · Click a code to copy it
      </div>
    </div>
  );
}