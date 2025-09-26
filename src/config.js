export const envByDomains = [
  {
    domain: "localhost" ?? "",
    api_url: process.env.REACT_APP_HOST ?? "",
    socket_url: process.env.REACT_APP_SOCKET ?? ""
  },
  {
    domain: process.env.REACT_APP_HOST_DOMAIN ?? "",
    api_url: process.env.REACT_APP_HOST ?? "",
    socket_url: process.env.REACT_APP_SOCKET ?? ""
  },
  {
    domain: process.env.REACT_APP_HOST_DOMAIN1 ?? "",
    api_url: process.env.REACT_APP_HOST1 ?? "",
    socket_url: process.env.REACT_APP_SOCKET1 ?? ""
  },
  {
    domain: process.env.REACT_APP_HOST_DOMAIN2 ?? "",
    api_url: process.env.REACT_APP_HOST2 ?? "",
    socket_url: process.env.REACT_APP_SOCKET2 ?? ""
  },
  {
    domain: process.env.REACT_APP_HOST_DOMAIN3 ?? "",
    api_url: process.env.REACT_APP_HOST3 ?? "",
    socket_url: process.env.REACT_APP_SOCKET3 ?? ""
  },
  {
    domain: process.env.REACT_APP_HOST_DOMAIN4 ?? "",
    api_url: process.env.REACT_APP_HOST4 ?? "",
    socket_url: process.env.REACT_APP_SOCKET4 ?? ""
  },
  {
    domain: process.env.REACT_APP_HOST_DOMAIN5 ?? "",
    api_url: process.env.REACT_APP_HOST5 ?? "",
    socket_url: process.env.REACT_APP_SOCKET5 ?? ""
  },
  {
    domain: process.env.REACT_APP_HOST_DOMAIN6 ?? "",
    api_url: process.env.REACT_APP_HOST6 ?? "",
    socket_url: process.env.REACT_APP_SOCKET6 ?? ""
  },
  {
    domain: process.env.REACT_APP_HOST_DOMAIN7 ?? "",
    api_url: process.env.REACT_APP_HOST7 ?? "",
    socket_url: process.env.REACT_APP_SOCKET7 ?? ""
  },
  {
    domain: process.env.REACT_APP_HOST_DOMAIN8 ?? "",
    api_url: process.env.REACT_APP_HOST8 ?? "",
    socket_url: process.env.REACT_APP_SOCKET8 ?? ""
  },
  {
    domain: process.env.REACT_APP_HOST_DOMAIN9 ?? "",
    api_url: process.env.REACT_APP_HOST9 ?? "",
    socket_url: process.env.REACT_APP_SOCKET9 ?? ""
  },
  {
    domain: process.env.REACT_APP_HOST_DOMAIN10 ?? "",
    api_url: process.env.REACT_APP_HOST10 ?? "",
    socket_url: process.env.REACT_APP_SOCKET10 ?? ""
  },
  {
    domain: process.env.REACT_APP_HOST_DOMAIN11 ?? "",
    api_url: process.env.REACT_APP_HOST11 ?? "",
    socket_url: process.env.REACT_APP_SOCKET11 ?? ""
  },
  {
    domain: process.env.REACT_APP_HOST_DOMAIN12 ?? "",
    api_url: process.env.REACT_APP_HOST12 ?? "",
    socket_url: process.env.REACT_APP_SOCKET12 ?? ""
  },
  {
    domain: process.env.REACT_APP_HOST_DOMAIN13 ?? "",
    api_url: process.env.REACT_APP_HOST13 ?? "",
    socket_url: process.env.REACT_APP_SOCKET13 ?? ""
  },
  {
    domain: process.env.REACT_APP_HOST_DOMAIN14 ?? "",
    api_url: process.env.REACT_APP_HOST14 ?? "",
    socket_url: process.env.REACT_APP_SOCKET14 ?? ""
  },
  {
    domain: process.env.REACT_APP_HOST_DOMAIN15 ?? "",
    api_url: process.env.REACT_APP_HOST15 ?? "",
    socket_url: process.env.REACT_APP_SOCKET15 ?? ""
  },
  {
    domain: process.env.REACT_APP_HOST_DOMAIN16 ?? "",
    api_url: process.env.REACT_APP_HOST16 ?? "",
    socket_url: process.env.REACT_APP_SOCKET16 ?? ""
  },
  {
    domain: process.env.REACT_APP_HOST_DOMAIN17 ?? "",
    api_url: process.env.REACT_APP_HOST17 ?? "",
    socket_url: process.env.REACT_APP_SOCKET17 ?? ""
  },
  {
    domain: process.env.REACT_APP_HOST_DOMAIN18 ?? "",
    api_url: process.env.REACT_APP_HOST18 ?? "",
    socket_url: process.env.REACT_APP_SOCKET18 ?? ""
  },
  {
    domain: process.env.REACT_APP_HOST_DOMAIN19 ?? "",
    api_url: process.env.REACT_APP_HOST19 ?? "",
    socket_url: process.env.REACT_APP_SOCKET19 ?? ""
  },
  {
    domain: process.env.REACT_APP_HOST_DOMAIN20 ?? "",
    api_url: process.env.REACT_APP_HOST20 ?? "",
    socket_url: process.env.REACT_APP_SOCKET20 ?? ""
  },
];

export const getBaseApiUrl = () => {
  const currentDomain = window?.location?.hostname;
  const currentApiUrl = envByDomains?.find((item) => item?.domain === currentDomain)?.api_url ?? process.env.REACT_APP_HOST;
  return currentApiUrl;
};

export const getAPIUrl = () => {
  // const currentDomain = window?.location?.hostname;
  // const currentApiUrl = envByDomains?.find((item) => item?.domain === currentDomain)?.api_url ?? process.env.REACT_APP_HOST;
  // return currentApiUrl?.replace(/\/api\/?$/, '');
  const apiUrl = localStorage.getItem("server_url");
  return apiUrl?.replace(/\/api\/?$/, '') ?? 'https://api.octolit.com/'
};

export const getBaseSocketUrl = () => {
  const currentDomain = window?.location?.hostname;
  const currentSocketUrl = envByDomains?.find((item) => item?.domain === currentDomain)?.socket_url ?? process.env.REACT_APP_SOCKET;
  return currentSocketUrl;
};

export const gtmConfig = {
  containerId: process.env.REACT_APP_GTM_CONTAINER_ID
};

export const mapboxConfig = {
  apiKey: process.env.REACT_APP_MAPBOX_API_KEY
};
