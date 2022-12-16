/*
 * Filename: https://github.com/ccagml/vscode-leetcode-problem-rating/src/model/Model.ts
 * Path: https://github.com/ccagml/vscode-leetcode-problem-rating
 * Created Date: Thursday, October 27th 2022, 7:43:29 pm
 * Author: ccagml
 *
 * Copyright (c) 2022 ccagml . All rights reserved.
 */

import {
  ViewColumn,
  QuickPickItem,
  MessageItem,
  Comment,
  MarkdownString,
  CommentMode,
  CommentAuthorInformation,
  CommentThread,
} from "vscode";
import { getDayNowM, getRemakeName } from "../utils/SystemUtils";

export interface IQuickItemEx<T> extends QuickPickItem {
  value: T;
}

export enum UserStatus {
  SignedIn = 1,
  SignedOut = 2,
}

export const loginArgsMapping: Map<string, string> = new Map([
  ["LeetCode", "-l"],
  ["Cookie", "-c"],
  ["GitHub", "-g"],
  ["LinkedIn", "-i"],
]);

export const AllProgramLanguage: string[] = [
  "bash",
  "c",
  "cpp",
  "csharp",
  "golang",
  "java",
  "javascript",
  "kotlin",
  "mysql",
  "php",
  "python",
  "python3",
  "ruby",
  "rust",
  "scala",
  "swift",
  "typescript",
];

export const langExt: Map<string, string> = new Map([
  ["bash", "sh"],
  ["c", "c"],
  ["cpp", "cpp"],
  ["csharp", "cs"],
  ["golang", "go"],
  ["java", "java"],
  ["javascript", "js"],
  ["kotlin", "kt"],
  ["mysql", "sql"],
  ["php", "php"],
  ["python", "py"],
  ["python3", "py"],
  ["ruby", "rb"],
  ["rust", "rs"],
  ["scala", "scala"],
  ["swift", "swift"],
  ["typescript", "ts"],
]);

export enum Endpoint {
  LeetCode = "leetcode",
  LeetCodeCN = "leetcode-cn",
}

export enum DescriptionConfiguration {
  InWebView = "In Webview",
  InFileComment = "In File Comment",
  Both = "Both",
  None = "None",
}

export const leetcodeHasInited: string = "leetcode.hasInited";

export enum SortingStrategy {
  None = "None",
  AcceptanceRateAsc = "Acceptance Rate (Ascending)",
  AcceptanceRateDesc = "Acceptance Rate (Descending)",
  FrequencyAsc = "Frequency (Ascending)",
  FrequencyDesc = "Frequency (Descending)",
  ScoreAsc = "Score (Ascending)",
  ScoreDesc = "Score (Descending)",
  IDDesc = "ID (Descending)",
}

export const SORT_ORDER: SortingStrategy[] = [
  SortingStrategy.None,
  SortingStrategy.AcceptanceRateAsc,
  SortingStrategy.AcceptanceRateDesc,
  SortingStrategy.ScoreAsc,
  SortingStrategy.ScoreDesc,
  SortingStrategy.IDDesc,
];

export interface ISubmitEvent {
  fid: string;
  qid: string;
  id: string;
  sub_type: string; // test  submit
  accepted: boolean;
}

export class RemarkComment implements Comment {
  id: number;
  label: string | undefined;
  mode: CommentMode;
  author: CommentAuthorInformation;
  contextValue?: string;

  constructor(public body: string | MarkdownString, public parent?: CommentThread) {
    this.id = getDayNowM();
    this.label = "";
    this.contextValue = "canDelete";
    this.mode = CommentMode.Preview;
    this.author = { name: getRemakeName() };
  }

  getDbData() {
    let a = {
      name: this.author.name,
      id: this.id,
      body: this.body,
    };
    return a;
  }

  static getObjByDbData(dbData, thread?): RemarkComment {
    let obj = new RemarkComment(dbData.body, thread);
    obj.id = dbData.id || getDayNowM();
    obj.author = { name: dbData.name };
    return obj;
  }
}

export interface IWebViewOption {
  title: string;
  viewColumn: ViewColumn;
  preserveFocus?: boolean;
}

export enum OpenOption {
  justOpenFile = "仅打开问题文件",
  openInCurrentWindow = "在当前VsCode窗口打开",
  openInNewWindow = "在新的VsCode窗口打开",
  addToWorkspace = "添加到工作空间",
}

export enum OutPutType {
  info = "info",
  warning = "warning",
  error = "error",
}

export const MessageItemObj: MessageItem = {
  title: "",
  isCloseAffordance: false,
};

export const DialogOptions = {
  open: Object.assign({}, MessageItemObj, { title: "Open" }),
  yes: Object.assign({}, MessageItemObj, { title: "Yes" }),
  no: Object.assign({}, MessageItemObj, {
    title: "No",
    isCloseAffordance: true,
  }),
  never: Object.assign({}, MessageItemObj, { title: "Never" }),
  singUp: Object.assign({}, MessageItemObj, { title: "Sign up" }),
};
