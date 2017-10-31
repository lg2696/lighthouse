/**
 * @license Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path = require("path");
const Commands = require("./commands/commands");
const Printer = require("./printer");
const cli_flags_1 = require("./cli-flags");
const run_1 = require("./run");
const log = require('lighthouse-logger');
const perfOnlyConfig = require('../lighthouse-core/config/perf.json');
const pkg = require('../package.json');
const Sentry = require('../lighthouse-core/lib/sentry');
// accept noop modules for these, so the real dependency is optional.
const shim_modules_1 = require("./shim-modules");
const sentry_prompt_1 = require("./sentry-prompt");
function isDev() {
    return fs_1.existsSync(path.join(__dirname, '../.git'));
}
// Tell user if there's a newer version of LH.
shim_modules_1.updateNotifier({ pkg }).notify();
const cliFlags = cli_flags_1.getFlags();
// Process terminating command
if (cliFlags.listAllAudits) {
    Commands.ListAudits();
}
// Process terminating command
if (cliFlags.listTraceCategories) {
    Commands.ListTraceCategories();
}
const url = cliFlags._[0];
let config = null;
if (cliFlags.configPath) {
    // Resolve the config file path relative to where cli was called.
    cliFlags.configPath = path.resolve(process.cwd(), cliFlags.configPath);
    config = require(cliFlags.configPath);
}
else if (cliFlags.perf) {
    config = perfOnlyConfig;
}
// set logging preferences
cliFlags.logLevel = 'info';
if (cliFlags.verbose) {
    cliFlags.logLevel = 'verbose';
}
else if (cliFlags.quiet) {
    cliFlags.logLevel = 'silent';
}
log.setLevel(cliFlags.logLevel);
if (cliFlags.output === Printer.OutputMode[Printer.OutputMode.json] && !cliFlags.outputPath) {
    cliFlags.outputPath = 'stdout';
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof cliFlags.enableErrorReporting === 'undefined') {
            cliFlags.enableErrorReporting = yield sentry_prompt_1.askPermission();
        }
        Sentry.init({
            url,
            flags: cliFlags,
            environmentData: {
                name: 'redacted',
                environment: isDev() ? 'development' : 'production',
                release: pkg.version,
                tags: {
                    channel: 'cli',
                },
            },
        });
        return run_1.runLighthouse(url, cliFlags, config);
    });
}
exports.run = run;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmluLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYmluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0dBSUc7QUFDSCxZQUFZLENBQUM7Ozs7Ozs7Ozs7QUFFYiwyQkFBOEI7QUFDOUIsNkJBQTZCO0FBRTdCLGdEQUFnRDtBQUNoRCxxQ0FBcUM7QUFDckMsMkNBQXFDO0FBQ3JDLCtCQUFvQztBQUVwQyxNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUN6QyxNQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMscUNBQXFDLENBQUMsQ0FBQztBQUN0RSxNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUN2QyxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsK0JBQStCLENBQUMsQ0FBQztBQUV4RCxxRUFBcUU7QUFDckUsaURBQThDO0FBQzlDLG1EQUE4QztBQUU5QztJQUNFLE1BQU0sQ0FBQyxlQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztBQUNyRCxDQUFDO0FBRUQsOENBQThDO0FBQzlDLDZCQUFjLENBQUMsRUFBQyxHQUFHLEVBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBRS9CLE1BQU0sUUFBUSxHQUFHLG9CQUFRLEVBQUUsQ0FBQztBQUU1Qiw4QkFBOEI7QUFDOUIsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7SUFDM0IsUUFBUSxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQ3hCLENBQUM7QUFFRCw4QkFBOEI7QUFDOUIsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQztJQUNqQyxRQUFRLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztBQUNqQyxDQUFDO0FBRUQsTUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUUxQixJQUFJLE1BQU0sR0FBZ0IsSUFBSSxDQUFDO0FBQy9CLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQ3hCLGlFQUFpRTtJQUNqRSxRQUFRLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN2RSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUN4QyxDQUFDO0FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3pCLE1BQU0sR0FBRyxjQUFjLENBQUM7QUFDMUIsQ0FBQztBQUVELDBCQUEwQjtBQUMxQixRQUFRLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQztBQUMzQixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUNyQixRQUFRLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQztBQUNoQyxDQUFDO0FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQzFCLFFBQVEsQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0FBQy9CLENBQUM7QUFDRCxHQUFHLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUVoQyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxLQUFLLE9BQU8sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQzVGLFFBQVEsQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDO0FBQ2pDLENBQUM7QUFFRDs7UUFDRSxFQUFFLENBQUMsQ0FBQyxPQUFPLFFBQVEsQ0FBQyxvQkFBb0IsS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ3pELFFBQVEsQ0FBQyxvQkFBb0IsR0FBRyxNQUFNLDZCQUFhLEVBQUUsQ0FBQztRQUN4RCxDQUFDO1FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNWLEdBQUc7WUFDSCxLQUFLLEVBQUUsUUFBUTtZQUNmLGVBQWUsRUFBRTtnQkFDZixJQUFJLEVBQUUsVUFBVTtnQkFDaEIsV0FBVyxFQUFFLEtBQUssRUFBRSxHQUFHLGFBQWEsR0FBRyxZQUFZO2dCQUNuRCxPQUFPLEVBQUUsR0FBRyxDQUFDLE9BQU87Z0JBQ3BCLElBQUksRUFBRTtvQkFDSixPQUFPLEVBQUUsS0FBSztpQkFDZjthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLG1CQUFhLENBQUMsR0FBRyxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUM5QyxDQUFDO0NBQUE7QUFuQkQsa0JBbUJDIn0=