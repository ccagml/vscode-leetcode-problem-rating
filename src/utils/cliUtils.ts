/*
 * Filename: /home/cc/vscode-leetcode-problem-rating/src/utils/cliUtils.ts
 * Path: /home/cc/vscode-leetcode-problem-rating
 * Created Date: Monday, October 31st 2022, 10:16:47 am
 * Author: ccagml
 *
 * Copyright (c) 2022 ccagml . All rights reserved.
 */


import * as cp from "child_process";
import * as vscode from "vscode";
import { logOutput } from "./logOutput";
import * as wsl from "./wslUtils";

interface IExecError extends Error {
    result?: string;
}

export async function executeCommand(command: string, args: string[], options: cp.SpawnOptions = { shell: true }): Promise<string> {
    return new Promise((resolve: (res: string) => void, reject: (e: Error) => void): void => {
        let result: string = "";
        var childProc: cp.ChildProcess
        if (wsl.useVscodeNode() && command == "node") {
            var newargs: string[] = []
            command = args[0];
            for (let arg_index = 1; arg_index < args.length; arg_index++) {
                newargs.push(args[arg_index])
            }
            var new_opt = { silent: true, ...options, env: createEnvOption() }
            if (false) {
                new_opt["execArgv"] = ['--inspect=43210']
            }
            childProc = cp.fork(command, newargs, new_opt);
        } else {
            childProc = cp.spawn(command, args, { ...options, env: createEnvOption() });
        }

        childProc.stdout?.on("data", (data: string | Buffer) => {
            data = data.toString();
            result = result.concat(data);
            logOutput.append(data);
        });

        childProc.stderr?.on("data", (data: string | Buffer) => logOutput.append(data.toString()));

        childProc.on("error", reject);

        childProc.on("close", (code: number) => {

            var try_result_json;
            try {
                try_result_json = JSON.parse(result);
            } catch (e) {
                try_result_json;
            }
            if (code !== 0 || (try_result_json ? try_result_json.code < 0 : (result.indexOf("ERROR") > -1))) {
                const error: IExecError = new Error(`Command "${command} ${args.toString()}" failed with exit code "${code}".`);
                if (result) {
                    error.result = result;
                }
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}

export async function executeCommandWithProgress(message: string, command: string, args: string[], options: cp.SpawnOptions = { shell: true }): Promise<string> {
    let result: string = "";
    await vscode.window.withProgress({ location: vscode.ProgressLocation.Notification }, async (p: vscode.Progress<{}>) => {
        return new Promise<void>(async (resolve: () => void, reject: (e: Error) => void): Promise<void> => {
            p.report({ message });
            try {
                result = await executeCommand(command, args, options);
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    });
    return result;
}

// clone process.env and add http proxy
export function createEnvOption(): {} {
    const proxy: string | undefined = getHttpAgent();
    if (proxy) {
        const env: any = Object.create(process.env);
        env.http_proxy = proxy;
        return env;
    }
    return process.env;
}

function getHttpAgent(): string | undefined {
    return vscode.workspace.getConfiguration("http").get<string>("proxy");
}