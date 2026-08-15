// Cypress E2E support file.
// Runs before each E2E spec.

import "./commands";
import installLogsCollector from "cypress-terminal-report/src/installLogsCollector";

installLogsCollector({ collectTypes: ["cy:log", "cy:command"] });
