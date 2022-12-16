/*
 * Filename: https://github.com/ccagml/vscode-leetcode-problem-rating/src/model/TreeItemModel.ts
 * Path: https://github.com/ccagml/vscode-leetcode-problem-rating
 * Created Date: Thursday, December 15th 2022, 8:08:41 pm
 * Author: ccagml
 *
 * Copyright (c) 2022 ccagml . All rights reserved.
 */

import { Command, TreeItem, Uri } from "vscode";

export interface userContestRanKingBase {
  attendedContestsCount: number; // 参与次数
  rating: number; // 分数
  globalRanking: number; // 全球名次
  localRanking: number; // 本地名次
  globalTotalParticipants: number; //全球所有
  localTotalParticipants: number; // 本地所有
  topPercentage: number; // 位次百分比
}

export const userContestRankingObj: userContestRanKingBase = {
  attendedContestsCount: 0,
  rating: 1500,
  globalRanking: 0,
  localRanking: 0,
  globalTotalParticipants: 0,
  localTotalParticipants: 0,
  topPercentage: 0,
};

export enum BricksNormalId {
  Have = "bricksHave", // 有活
  HaveDesc = "别吹牛了,工头让我叫你快去搬砖了",
  No = "bricksNo", // 没活
  NoDesc = "工头让你去上面那个工地,过几天再回来",
  Today = "bricksToday",
  DIY = "bricksDiy",
}

export enum BricksType {
  TYPE_0 = 0,
  TYPE_1 = 1,
  TYPE_2 = 2,
  TYPE_3 = 3,
  TYPE_4 = 4,
  TYPE_5 = 5,
  TYPE_6 = 6,
  TYPE_7 = 7,
}

export enum BricksTypeName {
  TYPE_0 = "不再出现",
  TYPE_1 = "14天",
  TYPE_2 = "7天",
  TYPE_3 = "5天",
  TYPE_4 = "3天",
  TYPE_5 = "2天",
  TYPE_6 = "1天",
  TYPE_7 = "999天",
}

export enum Category {
  All = "All",
  Difficulty = "Difficulty",
  Tag = "Tag",
  Company = "Company",
  Favorite = "Favorite",
  Score = "Score",
  Choice = "Choice",
}

export enum SearchSetType {
  ScoreRange = "ScoreRange",
  Context = "Context",
  Day = "Day",
}

export enum ProblemState {
  AC = 1,
  NotAC = 2,
  Unknown = 3,
}

export enum SearchSetTypeName {
  ScoreRange = "分数范围:",
  Context = "周赛期数:",
  Day = "每日一题",
}

export enum RootNodeSort {
  ZERO = 0,
  Day = 1,
  All = 2,
  Difficulty = 3,
  Tag = 4,
  Company = 5,
  Favorite = 6,
  Choice = 7,
  Score = 8,
  ScoreRange = 9,
  Context = 9,
}

// 原型模式 题目数据抽出原型,方便复制,既data部分
// tree 应该有2类:1类是层级, 1类是具体问题节点

// 左侧树型视图的数据原型
// 代理模式 代理操作TreeView的孩子, 可能是折叠, 也可能是具体问题的点

export interface TIDProblemData {
  isFavorite: boolean; // 喜爱的题目
  fid: string; // 显示的编号,可能是数字,也可能是中文
  qid: string; // 应该是唯一序号
  locked: boolean; // 题目上锁
  name: string; // 问题名称
  state: ProblemState; // 状态
  difficulty: string; // 难度
  passRate: string; // 通过率
  companies: string[]; // 公司
  tags: string[]; // 标签
}
export interface TIDDealyData {
  date: string; // 日期
  userStatus: string; // 状态   'NOT_START' 'FINISH'
}
export interface TIDScoreData {
  Rating: number; // 分数
  score: string; // rank分
  ID: number; // 题目ID
  ContestID_en: string; // 周赛名称
  ProblemIndex: string; // 周赛第几题
  ContestSlug: string; // 周赛名称
}

export interface TIDSearchData {
  value: string; // 输入的内容
  type: SearchSetType; //类型
  time: number; // 创建时间
}

export interface TreeItemData {
  problemData?: TIDProblemData; // 问题数据

  scoreData?: TIDScoreData; // 分数数据

  dealyData?: TIDDealyData; // 每日一题数据

  searchData?: TIDSearchData; // TreeItem是查询生成的数据

  TreeItemSortId: RootNodeSort; // 排序编号
}

export class TreeItemDataDao {
  constructor(public _all_data: TreeItemData) {}

  // 用于生成treeItem需要的数据
  getTreeItem(): TreeItem | Thenable<TreeItem> {
    return {};
  }
  // 用于创建一个新的
  copy() {
    return Object.assign({}, {}, this._all_data);
  }

  get locked(): boolean {
    return this._all_data.problemData?.locked == true;
  }

  get problemName(): string | undefined {
    return this._all_data.problemData?.name;
  }

  get isDealyProblem(): boolean {
    return this._all_data.dealyData != undefined;
  }

  public get state(): ProblemState {
    // 每日一题的修正
    if (this.isDealyProblem) {
      const us = this.todayDataUserStatus;
      if (us == "FINISH") {
        return ProblemState.AC;
      } else {
        return ProblemState.Unknown;
      }
    }

    return this._all_data.problemData?.state || ProblemState.Unknown;
  }

  public get passRate(): string | undefined {
    return this._all_data.problemData?.passRate;
  }

  public get difficulty(): string | undefined {
    return this._all_data.problemData?.difficulty;
  }

  public get tags(): string[] | undefined {
    return this._all_data.problemData?.tags;
  }

  public get companies(): string[] | undefined {
    return this._all_data.problemData?.companies;
  }

  public get isFavorite(): boolean | undefined {
    return this._all_data.problemData?.isFavorite;
  }

  public get isProblem(): boolean {
    return this._all_data.problemData != undefined;
  }
  public get rootNodeSortId(): RootNodeSort {
    return this._all_data.TreeItemSortId;
  }

  public get previewCommand(): Command {
    return {
      title: "Preview Problem",
      command: "lcpr.previewProblem",
      arguments: [this],
    };
  }

  public get acceptanceRate(): number {
    return Number(this.passRate) || 50;
  }

  public get uri(): Uri {
    return Uri.from({
      scheme: "leetcode",
      authority: this.isProblem ? "problems" : "tree-node",
      path: `/${this.qid}`, // 要 / 开头
      query: `difficulty=${this.difficulty}&score=${this.score}`,
    });
  }

  // rank分
  public get score(): string {
    return this._all_data.scoreData?.score || "0";
  }
  // 周赛名称
  public get ContestID_en(): string {
    return this._all_data.scoreData?.ContestID_en || "";
  }
  // 周赛第几题
  public get ProblemIndex(): string {
    return this._all_data.scoreData?.ProblemIndex || "";
  }
  // 周赛名称符号链接
  public get ContestSlug(): string {
    return this._all_data.scoreData?.ContestSlug || "";
  }
  public get scoreData(): TIDScoreData | undefined {
    return this._all_data.scoreData;
  }
  public get isSearchResult(): boolean {
    return this._all_data.searchData != undefined;
  }
  public get input(): string {
    return this._all_data.searchData?.value || "";
  }
  // 每日一题的一些信息
  public get todayData(): TIDDealyData | undefined {
    return this._all_data.dealyData;
  }
  public set todayData(s: TIDDealyData | undefined) {
    this._all_data.dealyData = s;
  }
  public get todayDataDate(): string {
    return this._all_data.dealyData?.date || "";
  }
  public get todayDataUserStatus(): string {
    return this._all_data.dealyData?.userStatus || "";
  }
  public get qid(): string {
    return this._all_data.problemData?.qid || "";
  }
}
