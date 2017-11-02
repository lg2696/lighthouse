/**
 * @license Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/* eslint-disable no-console */

// TODO(bckenny):
// - move package.json requirements up a dir
// - merge tests (running and coverage?) into lighthouse-core tests?
// update all tests for new world
// get new type checking working
// strict tsc checks

const path = require('path');

const printer = require('./printer');
// TODO(bckenny): interfaces
// import {Results} from './types/types';
// import {Flags} from './cli-flags';
// import {LaunchedChrome} from 'chrome-launcher';
const launch = require('chrome-launcher').launch;

const yargsParser = require('yargs-parser');
const lighthouse = require('../lighthouse-core');
const log = require('lighthouse-logger');
const getFilenamePrefix = require('../lighthouse-core/lib/file-namer.js').getFilenamePrefix;
const assetSaver = require('../lighthouse-core/lib/asset-saver.js');

const opn = require('opn');

const _RUNTIME_ERROR_CODE = 1;
const _PROTOCOL_TIMEOUT_EXIT_CODE = 67;

// TODO(bckenny)
// interface LighthouseError extends Error {
//   code?: string
// }

/**
 * exported for testing
 * @param {string} flags
 * @return {!Array<string>}
 */
function parseChromeFlags(flags = '') {
  const parsed = yargsParser(
      flags, {configuration: {'camel-case-expansion': false, 'boolean-negation': false}});

  return Object
      .keys(parsed)
      // Remove unnecessary _ item provided by yargs,
      .filter(key => key !== '_')
      // Avoid '=true', then reintroduce quotes
      .map(key => {
        if (parsed[key] === true) return `--${key}`;
        return `--${key}="${parsed[key]}"`;
      });
}

/**
 * Attempts to connect to an instance of Chrome with an open remote-debugging
 * port. If none is found, launches a debuggable instance.
 * @param {!Flags} flags
 * @return {!Promise<!LaunchedChrome>}
 */
async function getDebuggableChrome(flags) {
  return launch({
    port: flags.port,
    chromeFlags: parseChromeFlags(flags.chromeFlags),
    logLevel: flags.logLevel,
  });
}

function showConnectionError() {
  console.error('Unable to connect to Chrome');
  process.exit(_RUNTIME_ERROR_CODE);
}

/**
 * @param {!LighthouseError} err
 */
function showRuntimeError(err) {
  console.error('Runtime error encountered:', err);
  if (err.stack) {
    console.error(err.stack);
  }
  process.exit(_RUNTIME_ERROR_CODE);
}

function showProtocolTimeoutError() {
  console.error('Debugger protocol timed out while connecting to Chrome.');
  process.exit(_PROTOCOL_TIMEOUT_EXIT_CODE);
}

function showPageLoadError() {
  console.error('Unable to load the page. Please verify the url you are trying to review.');
  process.exit(_RUNTIME_ERROR_CODE);
}

/**
 * @param {!LighthouseError} err
 */
function handleError(err) {
  if (err.code === 'PAGE_LOAD_ERROR') {
    showPageLoadError();
  } else if (err.code === 'ECONNREFUSED') {
    showConnectionError();
  } else if (err.code === 'CRI_TIMEOUT') {
    showProtocolTimeoutError();
  } else {
    showRuntimeError(err);
  }
}

/**
 * @param {!Results} results
 * @param {!Object} artifacts
 * @param {!Flags} flags
 * @return {!Promise<undefined>}
 */
async function saveResults(results, artifacts, flags) {
  const cwd = process.cwd();
  // Use the output path as the prefix for all generated files.
  // If no output path is set, generate a file prefix using the URL and date.
  const configuredPath = !flags.outputPath || flags.outputPath === 'stdout' ?
      getFilenamePrefix(results) :
      flags.outputPath.replace(/\.\w{2,4}$/, '');
  const resolvedPath = path.resolve(cwd, configuredPath);

  if (flags.saveArtifacts) {
    assetSaver.saveArtifacts(artifacts, resolvedPath);
  }

  if (flags.saveAssets) {
    await assetSaver.saveAssets(artifacts, results.audits, resolvedPath);
  }

  if (Array.isArray(flags.output)) {
    for (const outputType of flags.output) {
      const extension = outputType === 'domhtml' ? 'html' : outputType;
      const outputPath = `${resolvedPath}.report.${extension}`;
      await printer.write(results, outputType, outputPath);
    }
  } else {
    const extension = flags.output === 'domhtml' ? 'html' : flags.output;
    const outputPath = flags.outputPath || `${resolvedPath}.report.${extension}`;
    await printer.write(results, flags.output, outputPath);
    if (flags.output === printer.OutputMode.html || flags.output === printer.OutputMode.domhtml) {
      if (flags.view) {
        opn(outputPath, {wait: false});
      } else {
        // eslint-disable-next-line max-len
        log.log('CLI', 'Protip: Run lighthouse with `--view` to immediately open the HTML report in your browser');
      }
    }
  }
}

/**
 * @param {string} url
 * @param {!Flags} flags
 * @param {?Config} config
 * @return {!Promise<!Results>}
 */
async function runLighthouse(url, flags, config) {
  let launchedChrome;

  try {
    launchedChrome = await getDebuggableChrome(flags);
    flags.port = launchedChrome.port;
    const results = await lighthouse(url, flags, config);

    const artifacts = results.artifacts;
    delete results.artifacts;

    await saveResults(results, artifacts, flags);
    await launchedChrome.kill();

    return results;
  } catch (err) {
    if (launchedChrome !== 'undefined') {
      await launchedChrome.kill();
    }

    return handleError(err);
  }
}

module.exports = {
  parseChromeFlags,
  saveResults,
  runLighthouse,
};
