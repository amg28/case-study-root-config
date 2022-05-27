import { app } from "./app.js";
import {
  constructServerLayout,
  sendLayoutHTTPResponse,
} from "single-spa-layout/server";
import _ from "lodash";
import { getImportMaps } from "single-spa-web-server-utils";

const serverLayout = constructServerLayout({
  filePath: "server/views/index.html",
});

app.use("*", (req, res, next) => {
  const developmentMode = process.env.NODE_ENV === "development";
  const importSuffix = developmentMode ? `?ts=${Date.now()}` : "";

  const importMapsPromise = getImportMaps({
    url:
      "https://storage.googleapis.com/case-study-mf/import-map.json",
    nodeKeyFilter(importMapKey) {
      return importMapKey.startsWith("@isomorphic-mf");
    },
    req,
    allowOverrides: true,
  }).then(({ nodeImportMap, browserImportMap }) => {
    global.nodeLoader.setImportMapPromise(Promise.resolve(nodeImportMap));
    if (developmentMode) {
      // local override setup for root-config client application
      browserImportMap.imports["@isomorphic-mf/root-config"] =
        "http://[::1]:8080/isomorphic-mf-root-config.js";
      browserImportMap.imports["@isomorphic-mf/root-config/"] =
        "http://[::1]:8080/root-config/";

      // local override setup for navbar application
      nodeImportMap.imports["@isomorphic-mf/navbar"] =
        "http://[::1]:8081/isomorphic-mf-navbar.js";
      nodeImportMap.imports["@isomorphic-mf/navbar/"] = "http://[::1]:8081/";

      browserImportMap.imports["@isomorphic-mf/navbar"] =
        "http://localhost:8081/isomorphic-mf-navbar.js";
      browserImportMap.imports["@isomorphic-mf/navbar/"] =
        "http://localhost:8081/";

      // local override setup for weather application
      nodeImportMap.imports["@isomorphic-mf/weather"] =
        "http://[::1]:8082/isomorphic-mf-weather.js";
      nodeImportMap.imports["@isomorphic-mf/weather/"] = "http://[::1]:8082/";

      browserImportMap.imports["@isomorphic-mf/weather"] =
        "http://localhost:8082/isomorphic-mf-weather.js";
      browserImportMap.imports["@isomorphic-mf/weather/"] =
        "http://localhost:8082/";

      // local override setup for pollution application
      nodeImportMap.imports["@isomorphic-mf/pollution"] =
        "http://[::1]:8083/isomorphic-mf-pollution.js";
      nodeImportMap.imports["@isomorphic-mf/pollution/"] = "http://[::1]:8083/";

      browserImportMap.imports["@isomorphic-mf/pollution"] =
        "http://localhost:8083/isomorphic-mf-pollution.js";
      browserImportMap.imports["@isomorphic-mf/pollution/"] =
        "http://localhost:8083/";
    }
    return { nodeImportMap, browserImportMap };
  });

  const props = {
    user: {
      id: 1,
      name: "Test User",
    },
  };

  const fragments = {
    importmap: async () => {
      const { browserImportMap } = await importMapsPromise;
      return `<script type="systemjs-importmap">${JSON.stringify(
        browserImportMap,
        null,
        2
      )}</script>`;
    },
  };

  const renderFragment = (name) => fragments[name]();

  sendLayoutHTTPResponse({
    serverLayout,
    urlPath: req.originalUrl,
    res,
    renderFragment,
    async renderApplication({ appName, propsPromise }) {
      await importMapsPromise;
      const [app, props] = await Promise.all([
        import(appName + `/server.mjs${importSuffix}`),
        propsPromise,
      ]);
      return app.serverRender(props);
    },
    async retrieveApplicationHeaders({ appName, propsPromise }) {
      await importMapsPromise;
      const [app, props] = await Promise.all([
        import(appName + `/server.mjs${importSuffix}`),
        propsPromise,
      ]);
      return app.getResponseHeaders(props);
    },
    async retrieveProp(propName) {
      return props[propName];
    },
    assembleFinalHeaders(allHeaders) {
      return Object.assign({}, Object.values(allHeaders));
    },
  })
    .then(next)
    .catch((err) => {
      console.error(err);
      res.status(500).send("A server error occurred");
    });
});
