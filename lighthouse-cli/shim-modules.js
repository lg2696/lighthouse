/**
 * @license Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/** @fileoverview Some users may be unable to install the full dependency tree,
 * especially for the CLI. `opn` and `update-notifier` in particular have some
 * uncommon transitive dependencies, so these shims will let the modules no-op
 * if the real dependency is not installed.
 */
let opn;
exports.opn = opn;
try {
    exports.opn = opn = require('opn');
}
catch (e) {
    exports.opn = opn = function shimOpn() {
        console.error('module `opn` not installed. Not opening browser.');
    };
}
let updateNotifier;
exports.updateNotifier = updateNotifier;
try {
    exports.updateNotifier = updateNotifier = require('update-notifier');
}
catch (e) {
    exports.updateNotifier = updateNotifier = function shimUpdateNotifier() {
        console.error('module `update-notifier` not installed. Not checking for new version.');
        return { notify: () => false };
    };
}
let inquirer;
exports.inquirer = inquirer;
try {
    exports.inquirer = inquirer = require('inquirer');
}
catch (e) {
    exports.inquirer = inquirer = {
        prompt() {
            console.error('module `inquirer` not installed. Not reporting errors.');
            return Promise.resolve({ isErrorReportingEnabled: false });
        }
    };
}
let Configstore;
exports.Configstore = Configstore;
try {
    exports.Configstore = Configstore = require('configstore');
}
catch (e) {
    exports.Configstore = Configstore = function Configstore() {
        console.error('module `configstore` not installed. Not persisting user choices.');
        this.get = () => false;
        this.set = () => undefined;
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hpbS1tb2R1bGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2hpbS1tb2R1bGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0dBSUc7QUFDSCxZQUFZLENBQUM7O0FBRWI7Ozs7R0FJRztBQUVILElBQUksR0FBRyxDQUFDO0FBMENBLGtCQUFHO0FBekNYLElBQUksQ0FBQztJQUNILGNBQUEsR0FBRyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN2QixDQUFDO0FBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNYLGNBQUEsR0FBRyxHQUFHO1FBQ0osT0FBTyxDQUFDLEtBQUssQ0FBQyxrREFBa0QsQ0FBQyxDQUFDO0lBQ3BFLENBQUMsQ0FBQztBQUNKLENBQUM7QUFFRCxJQUFJLGNBQWMsQ0FBQztBQWlDTix3Q0FBYztBQWhDM0IsSUFBSSxDQUFDO0lBQ0gseUJBQUEsY0FBYyxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQzlDLENBQUM7QUFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ1gseUJBQUEsY0FBYyxHQUFHO1FBQ2YsT0FBTyxDQUFDLEtBQUssQ0FBQyx1RUFBdUUsQ0FBQyxDQUFDO1FBQ3ZGLE1BQU0sQ0FBQyxFQUFDLE1BQU0sRUFBRSxNQUFNLEtBQUssRUFBQyxDQUFDO0lBQy9CLENBQUMsQ0FBQztBQUNKLENBQUM7QUFFRCxJQUFJLFFBQVEsQ0FBQztBQXVCZ0IsNEJBQVE7QUF0QnJDLElBQUksQ0FBQztJQUNILG1CQUFBLFFBQVEsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDakMsQ0FBQztBQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDWCxtQkFBQSxRQUFRLEdBQUc7UUFDVCxNQUFNO1lBQ0osT0FBTyxDQUFDLEtBQUssQ0FBQyx3REFBd0QsQ0FBQyxDQUFDO1lBQ3hFLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUMsdUJBQXVCLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztRQUMzRCxDQUFDO0tBQ0YsQ0FBQTtBQUNILENBQUM7QUFFRCxJQUFJLFdBQVcsQ0FBQztBQVd1QixrQ0FBVztBQVZsRCxJQUFJLENBQUM7SUFDSCxzQkFBQSxXQUFXLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ3ZDLENBQUM7QUFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ1gsc0JBQUEsV0FBVyxHQUFHO1FBQ1osT0FBTyxDQUFDLEtBQUssQ0FBQyxrRUFBa0UsQ0FBQyxDQUFDO1FBQ2xGLElBQUksQ0FBQyxHQUFHLEdBQUcsTUFBTSxLQUFLLENBQUM7UUFDdkIsSUFBSSxDQUFDLEdBQUcsR0FBRyxNQUFNLFNBQVMsQ0FBQztJQUM3QixDQUFDLENBQUE7QUFDSCxDQUFDIn0=