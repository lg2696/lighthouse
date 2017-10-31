"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
const shim_modules_1 = require("./shim-modules");
const log = require('lighthouse-logger');
const MAXIMUM_WAIT_TIME = 20 * 1000;
// clang-format off
const MESSAGE = `${log.reset}We're constantly trying to improve Lighthouse and its reliability.\n  ` +
    `May we anonymously report runtime exceptions to improve the tool over time?\n  ` +
    `${log.reset}Learn more: https://github.com/GoogleChrome/lighthouse/blob/master/docs/error-reporting.md`;
// clang-format on
function prompt() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!process.stdout.isTTY || process.env.CI) {
            // Default non-interactive sessions to false
            return false;
        }
        let timeout;
        const prompt = shim_modules_1.inquirer.prompt([
            {
                type: 'confirm',
                name: 'isErrorReportingEnabled',
                default: false,
                message: MESSAGE,
            },
        ]);
        const timeoutPromise = new Promise((resolve) => {
            timeout = setTimeout(() => {
                prompt.ui.close();
                process.stdout.write('\n');
                log.warn('CLI', 'No response to error logging preference, errors will not be reported.');
                resolve(false);
            }, MAXIMUM_WAIT_TIME);
        });
        return Promise.race([
            prompt.then((result) => {
                clearTimeout(timeout);
                return result.isErrorReportingEnabled;
            }),
            timeoutPromise,
        ]);
    });
}
function askPermission() {
    return __awaiter(this, void 0, void 0, function* () {
        const configstore = new shim_modules_1.Configstore('lighthouse');
        let isErrorReportingEnabled = configstore.get('isErrorReportingEnabled');
        if (typeof isErrorReportingEnabled === 'boolean') {
            return isErrorReportingEnabled;
        }
        isErrorReportingEnabled = yield prompt();
        configstore.set('isErrorReportingEnabled', isErrorReportingEnabled);
        return isErrorReportingEnabled;
    });
}
exports.askPermission = askPermission;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VudHJ5LXByb21wdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNlbnRyeS1wcm9tcHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7O0dBSUc7QUFDSCxpREFBcUQ7QUFFckQsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFFekMsTUFBTSxpQkFBaUIsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDO0FBQ3BDLG1CQUFtQjtBQUNuQixNQUFNLE9BQU8sR0FDWCxHQUFHLEdBQUcsQ0FBQyxLQUFLLHdFQUF3RTtJQUNwRixpRkFBaUY7SUFDakYsR0FBRyxHQUFHLENBQUMsS0FBSyw0RkFBNEYsQ0FBQztBQUMzRyxrQkFBa0I7QUFFbEI7O1FBQ0UsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDNUMsNENBQTRDO1lBQzVDLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDZixDQUFDO1FBRUQsSUFBSSxPQUFxQixDQUFDO1FBRTFCLE1BQU0sTUFBTSxHQUFHLHVCQUFRLENBQUMsTUFBTSxDQUFDO1lBQzdCO2dCQUNFLElBQUksRUFBRSxTQUFTO2dCQUNmLElBQUksRUFBRSx5QkFBeUI7Z0JBQy9CLE9BQU8sRUFBRSxLQUFLO2dCQUNkLE9BQU8sRUFBRSxPQUFPO2FBQ2pCO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsTUFBTSxjQUFjLEdBQUcsSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUEyQjtZQUM3RCxPQUFPLEdBQUcsVUFBVSxDQUFDO2dCQUNuQixNQUFNLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUNsQixPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDM0IsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsdUVBQXVFLENBQUMsQ0FBQztnQkFDekYsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2pCLENBQUMsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1FBQ3hCLENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFDbEIsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQTBDO2dCQUNyRCxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ3RCLE1BQU0sQ0FBQyxNQUFNLENBQUMsdUJBQXVCLENBQUM7WUFDeEMsQ0FBQyxDQUFDO1lBQ0YsY0FBYztTQUNmLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FBQTtBQUVEOztRQUNFLE1BQU0sV0FBVyxHQUFHLElBQUksMEJBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNsRCxJQUFJLHVCQUF1QixHQUFHLFdBQVcsQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUMsQ0FBQztRQUN6RSxFQUFFLENBQUMsQ0FBQyxPQUFPLHVCQUF1QixLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDakQsTUFBTSxDQUFDLHVCQUF1QixDQUFDO1FBQ2pDLENBQUM7UUFFRCx1QkFBdUIsR0FBRyxNQUFNLE1BQU0sRUFBRSxDQUFDO1FBQ3pDLFdBQVcsQ0FBQyxHQUFHLENBQUMseUJBQXlCLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztRQUNwRSxNQUFNLENBQUMsdUJBQXVCLENBQUM7SUFDakMsQ0FBQztDQUFBO0FBVkQsc0NBVUMifQ==