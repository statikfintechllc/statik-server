"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// node_modules/fast-content-type-parse/index.js
var require_fast_content_type_parse = __commonJS({
  "node_modules/fast-content-type-parse/index.js"(exports, module2) {
    "use strict";
    var NullObject = function NullObject2() {
    };
    NullObject.prototype = /* @__PURE__ */ Object.create(null);
    var paramRE = /; *([!#$%&'*+.^\w`|~-]+)=("(?:[\v\u0020\u0021\u0023-\u005b\u005d-\u007e\u0080-\u00ff]|\\[\v\u0020-\u00ff])*"|[!#$%&'*+.^\w`|~-]+) */gu;
    var quotedPairRE = /\\([\v\u0020-\u00ff])/gu;
    var mediaTypeRE = /^[!#$%&'*+.^\w|~-]+\/[!#$%&'*+.^\w|~-]+$/u;
    var defaultContentType = { type: "", parameters: new NullObject() };
    Object.freeze(defaultContentType.parameters);
    Object.freeze(defaultContentType);
    function parse2(header) {
      if (typeof header !== "string") {
        throw new TypeError("argument header is required and must be a string");
      }
      let index = header.indexOf(";");
      const type = index !== -1 ? header.slice(0, index).trim() : header.trim();
      if (mediaTypeRE.test(type) === false) {
        throw new TypeError("invalid media type");
      }
      const result = {
        type: type.toLowerCase(),
        parameters: new NullObject()
      };
      if (index === -1) {
        return result;
      }
      let key;
      let match;
      let value;
      paramRE.lastIndex = index;
      while (match = paramRE.exec(header)) {
        if (match.index !== index) {
          throw new TypeError("invalid parameter format");
        }
        index += match[0].length;
        key = match[1].toLowerCase();
        value = match[2];
        if (value[0] === '"') {
          value = value.slice(1, value.length - 1);
          quotedPairRE.test(value) && (value = value.replace(quotedPairRE, "$1"));
        }
        result.parameters[key] = value;
      }
      if (index !== header.length) {
        throw new TypeError("invalid parameter format");
      }
      return result;
    }
    function safeParse2(header) {
      if (typeof header !== "string") {
        return defaultContentType;
      }
      let index = header.indexOf(";");
      const type = index !== -1 ? header.slice(0, index).trim() : header.trim();
      if (mediaTypeRE.test(type) === false) {
        return defaultContentType;
      }
      const result = {
        type: type.toLowerCase(),
        parameters: new NullObject()
      };
      if (index === -1) {
        return result;
      }
      let key;
      let match;
      let value;
      paramRE.lastIndex = index;
      while (match = paramRE.exec(header)) {
        if (match.index !== index) {
          return defaultContentType;
        }
        index += match[0].length;
        key = match[1].toLowerCase();
        value = match[2];
        if (value[0] === '"') {
          value = value.slice(1, value.length - 1);
          quotedPairRE.test(value) && (value = value.replace(quotedPairRE, "$1"));
        }
        result.parameters[key] = value;
      }
      if (index !== header.length) {
        return defaultContentType;
      }
      return result;
    }
    module2.exports.default = { parse: parse2, safeParse: safeParse2 };
    module2.exports.parse = parse2;
    module2.exports.safeParse = safeParse2;
    module2.exports.defaultContentType = defaultContentType;
  }
});

// src/extension/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate
});
module.exports = __toCommonJS(extension_exports);
var vscode6 = __toESM(require("vscode"), 1);

// src/extension/commands.ts
var vscode2 = __toESM(require("vscode"), 1);

// src/extension/notebookProvider.ts
var vscode = __toESM(require("vscode"), 1);

// src/extension/parser/symbols.ts
var SymbolTable = class {
  constructor() {
    this._clock = new class {
      constructor() {
        this._value = 0;
      }
      tick() {
        return this._value++;
      }
    }();
    this._data = /* @__PURE__ */ new Map();
  }
  delete(id) {
    this._data.delete(id);
  }
  update(query) {
    this._data.delete(query.id);
    const getType = (def) => {
      if (def.value._type !== "Query" /* Query */) {
        return;
      }
      if (def.value.nodes.length !== 1) {
        return;
      }
      return Utils.getTypeOfNode(def.value.nodes[0], this);
    };
    for (let node of query.nodes) {
      if (node._type === "VariableDefinition" /* VariableDefinition */) {
        let array = this._data.get(query.id);
        if (!array) {
          array = [];
          this._data.set(query.id, array);
        }
        array.push({
          root: query,
          timestamp: this._clock.tick(),
          name: node.name.value,
          def: node,
          type: getType(node),
          value: Utils.print(node.value, query.text, (name) => this.getFirst(name)?.value)
        });
      }
    }
  }
  getFirst(name) {
    let candidate;
    for (let bucket of this._data.values()) {
      for (let info of bucket) {
        if (info.name === name) {
          if (!candidate || candidate.timestamp < info.timestamp) {
            candidate = info;
          }
        }
      }
    }
    return candidate;
  }
  *getAll(name) {
    for (let bucket of this._data.values()) {
      for (let info of bucket) {
        if (info.name === name) {
          yield info;
        }
      }
    }
  }
  *all() {
    for (let bucket of this._data.values()) {
      for (let info of bucket) {
        yield info;
      }
    }
  }
};
var ValueSet = class {
  constructor(exclusive, ...entries) {
    this.exclusive = exclusive;
    this.entries = new Set(entries);
  }
};
var QualifiedValueInfo = class _QualifiedValueInfo {
  constructor(type, enumValues, placeholderType, repeatable = 0 /* No */, valueSequence, description) {
    this.type = type;
    this.enumValues = enumValues;
    this.placeholderType = placeholderType;
    this.repeatable = repeatable;
    this.valueSequence = valueSequence;
    this.description = description;
  }
  static enum(sets, repeatable, description) {
    return new _QualifiedValueInfo("literal" /* Literal */, Array.isArray(sets) ? sets : [sets], void 0, repeatable, false, description);
  }
  static placeholder(placeholder, repeatable, valueSequence, description) {
    return new _QualifiedValueInfo("literal" /* Literal */, void 0, placeholder, repeatable, valueSequence, description);
  }
  static simple(type, description) {
    return new _QualifiedValueInfo(type, void 0, void 0, void 0, false, description);
  }
  static username(repeatable, description) {
    return new _QualifiedValueInfo("literal" /* Literal */, [new ValueSet(true, "@me")], "username" /* Username */, repeatable, false, description);
  }
};
var QualifiedValueNodeSchema = /* @__PURE__ */ new Map([
  // value sets
  ["archived", QualifiedValueInfo.enum(new ValueSet(true, "true", "false"))],
  ["draft", QualifiedValueInfo.enum(new ValueSet(true, "true", "false"), void 0, "Draft pull requests")],
  ["in", QualifiedValueInfo.enum(new ValueSet(true, "title", "body", "comments"), void 0, "Search in the title, body, comments, or any combination of these")],
  ["is", QualifiedValueInfo.enum([new ValueSet(true, "locked", "unlocked"), new ValueSet(true, "merged", "unmerged"), new ValueSet(true, "public", "private"), new ValueSet(true, "open", "closed"), new ValueSet(true, "pr", "issue")], 1 /* Repeat */)],
  ["reason", QualifiedValueInfo.enum(new ValueSet(true, "completed", '"not planned"'))],
  ["linked", QualifiedValueInfo.enum(new ValueSet(true, "pr", "issue"))],
  ["no", QualifiedValueInfo.enum(new ValueSet(false, "label", "milestone", "assignee", "project"), 1 /* Repeat */)],
  ["review", QualifiedValueInfo.enum(new ValueSet(true, "none", "required", "approved", "changes_requested"))],
  ["state", QualifiedValueInfo.enum(new ValueSet(true, "open", "closed"), void 0, "Issues and pull requests based on whether they are open or closed")],
  ["status", QualifiedValueInfo.enum(new ValueSet(true, "pending", "success", "failure"), void 0, "Pull requests based on the status of the commits")],
  ["type", QualifiedValueInfo.enum(new ValueSet(true, "pr", "issue"), void 0, "Only issues or only pull requests")],
  ["sort", QualifiedValueInfo.enum(new ValueSet(
    true,
    "created-desc",
    "created-asc",
    "comments-desc",
    "comments-asc",
    "updated-desc",
    "updated-asc",
    "reactions-+1-desc",
    "reactions--1-desc",
    "reactions-smile-desc",
    "reactions-tada-desc",
    "reactions-thinking_face-desc",
    "reactions-heart-desc",
    "reactions-rocket-desc",
    "reactions-eyes-desc"
    // 'reactions-+1-asc', 'reactions--1-asc', 'reactions-smile-asc', 'reactions-tada-asc', 'reactions-thinking_face-asc', 'reactions-heart-asc', 'reactions-rocket-asc', 'reactions-eyes-asc',
  ))],
  // placeholder 
  ["base", QualifiedValueInfo.placeholder("baseBranch" /* BaseBranch */)],
  ["head", QualifiedValueInfo.placeholder("headBranch" /* HeadBranch */)],
  ["label", QualifiedValueInfo.placeholder("label" /* Label */, 1 /* Repeat */, true, "Issues and pull requests with a certain label")],
  ["language", QualifiedValueInfo.placeholder("language" /* Language */)],
  ["milestone", QualifiedValueInfo.placeholder("milestone" /* Milestone */, void 0, false, "Issues and pull requests for a certain miletsone")],
  ["org", QualifiedValueInfo.placeholder("orgname" /* Orgname */, 1 /* Repeat */, false, "Issues and pull requests in all repositories owned by a certain organization")],
  ["project", QualifiedValueInfo.placeholder("projectBoard" /* ProjectBoard */)],
  ["repo", QualifiedValueInfo.placeholder("repository" /* Repository */, 1 /* Repeat */, false, "Issues and pull requests in a certain repository")],
  ["user", QualifiedValueInfo.username(1 /* Repeat */, "Issues and pull requests in all repositories owned by a certain user")],
  ["team-review-requested", QualifiedValueInfo.placeholder("teamname" /* Teamname */)],
  ["team", QualifiedValueInfo.placeholder("teamname" /* Teamname */)],
  // placeholder (username)
  ["assignee", QualifiedValueInfo.username(2 /* RepeatNegated */, "Issues and pull requests that are assigned to a certain user")],
  ["author", QualifiedValueInfo.username(2 /* RepeatNegated */, "Issues and pull requests created by a certain user")],
  ["commenter", QualifiedValueInfo.username(1 /* Repeat */, "Issues and pull requests that contain a comment from a certain user")],
  ["mentions", QualifiedValueInfo.username(1 /* Repeat */, "Issues and pull requests that mention a certain user")],
  ["involves", QualifiedValueInfo.username(1 /* Repeat */, "Issues and pull requests that in some way involve a user. The involves qualifier is a logical OR between the author, assignee, mentions, and commenter qualifiers for a single user")],
  ["review-requested", QualifiedValueInfo.username(void 0, "Pull requests where a specific user is requested for review")],
  ["reviewed-by", QualifiedValueInfo.username(void 0, "Pull requests reviewed by a particular user")],
  // simple value
  ["closed", QualifiedValueInfo.simple("date" /* Date */, "Issues and pull requests based on when they were closed")],
  ["created", QualifiedValueInfo.simple("date" /* Date */, "Issues and pull requests based on when they were created")],
  ["merged", QualifiedValueInfo.simple("date" /* Date */, "Issues and pull requests based on when they were merged")],
  ["pushed", QualifiedValueInfo.simple("date" /* Date */, "Issues and pull requests based on when they were pushed")],
  ["updated", QualifiedValueInfo.simple("date" /* Date */, "Issues and pull requests based on when they were updated")],
  ["comments", QualifiedValueInfo.simple("number" /* Number */, "Issues and pull request by number of comments")],
  ["interactions", QualifiedValueInfo.simple("number" /* Number */, "Issues and pull request by number of interactions")],
  ["reactions", QualifiedValueInfo.simple("number" /* Number */, "Issues and pull request by number of reactions")],
  ["size", QualifiedValueInfo.simple("number" /* Number */)],
  ["stars", QualifiedValueInfo.simple("number" /* Number */)],
  ["topics", QualifiedValueInfo.simple("number" /* Number */)]
]);

// src/extension/parser/nodes.ts
var Utils;
((Utils2) => {
  function walk(node, callback) {
    if (!node) {
      return;
    }
    const stack = [void 0, node];
    while (stack.length > 0) {
      let parent = stack.shift();
      let node2 = stack.shift();
      if (!node2) {
        continue;
      }
      callback(node2, parent);
      switch (node2._type) {
        case "Compare" /* Compare */:
          stack.unshift(node2.value);
          stack.unshift(node2);
          break;
        case "Range" /* Range */:
          stack.unshift(node2.close);
          stack.unshift(node2);
          stack.unshift(node2.open);
          stack.unshift(node2);
          break;
        case "QualifiedValue" /* QualifiedValue */:
          stack.unshift(node2.value);
          stack.unshift(node2);
          stack.unshift(node2.qualifier);
          stack.unshift(node2);
          break;
        case "VariableDefinition" /* VariableDefinition */:
          stack.unshift(node2.value);
          stack.unshift(node2);
          stack.unshift(node2.name);
          stack.unshift(node2);
          break;
        case "OrExpression" /* OrExpression */:
          stack.unshift(node2.right);
          stack.unshift(node2);
          stack.unshift(node2.left);
          stack.unshift(node2);
          break;
        case "LiteralSequence" /* LiteralSequence */:
        case "Query" /* Query */:
        case "QueryDocument" /* QueryDocument */:
          for (let i = node2.nodes.length - 1; i >= 0; i--) {
            stack.unshift(node2.nodes[i]);
            stack.unshift(node2);
          }
          break;
      }
    }
  }
  Utils2.walk = walk;
  function nodeAt(node, offset, parents) {
    let result;
    Utils2.walk(node, (node2) => {
      if (Utils2.containsPosition(node2, offset)) {
        parents?.push(node2);
        result = node2;
      }
    });
    return result;
  }
  Utils2.nodeAt = nodeAt;
  function containsPosition(node, offset) {
    return node.start <= offset && offset <= node.end;
  }
  Utils2.containsPosition = containsPosition;
  function print(node, text, variableValue) {
    function _print(node2) {
      switch (node2._type) {
        case "Missing" /* Missing */:
          return "";
        case "VariableName" /* VariableName */:
          return variableValue(node2.value) ?? `${node2.value}`;
        case "Any" /* Any */:
        case "Literal" /* Literal */:
        case "Date" /* Date */:
        case "Number" /* Number */:
          return text.substring(node2.start, node2.end);
        case "LiteralSequence" /* LiteralSequence */:
          return node2.nodes.map(_print).join(",");
        case "Compare" /* Compare */:
          return `${node2.cmp}${_print(node2.value)}`;
        case "Range" /* Range */:
          return node2.open && node2.close ? `${_print(node2.open)}..${_print(node2.close)}` : node2.open ? `${_print(node2.open)}..*` : `*..${_print(node2.close)}`;
        case "QualifiedValue" /* QualifiedValue */:
          return `${node2.not ? "-" : ""}${node2.qualifier.value}:${_print(node2.value)}`;
        case "Query" /* Query */:
          let result = "";
          let lastEnd = -1;
          for (let child of node2.nodes) {
            let value = _print(child);
            if (value) {
              result += lastEnd !== -1 && child.start !== lastEnd ? " " : "";
              result += value;
            }
            lastEnd = child.end;
          }
          return result;
        default:
          return "???";
      }
    }
    return _print(node);
  }
  Utils2.print = print;
  function getTypeOfNode(node, symbols) {
    switch (node._type) {
      case "VariableName" /* VariableName */:
        return symbols.getFirst(node.value)?.type;
      case "Date" /* Date */:
        return "date" /* Date */;
      case "Number" /* Number */:
        return "number" /* Number */;
      case "Literal" /* Literal */:
        return "literal" /* Literal */;
      case "Compare" /* Compare */:
        return getTypeOfNode(node.value, symbols);
      case "Range" /* Range */:
        if (node.open) {
          return getTypeOfNode(node.open, symbols);
        } else if (node.close) {
          return getTypeOfNode(node.close, symbols);
        }
    }
    return void 0;
  }
  Utils2.getTypeOfNode = getTypeOfNode;
})(Utils || (Utils = {}));

// src/extension/utils.ts
function* getAllRepos(project) {
  const repoStrings = [];
  for (let item of project.all()) {
    Utils.walk(item.node, (node) => {
      if (node._type === "QualifiedValue" /* QualifiedValue */ && node.qualifier.value === "repo") {
        let value;
        if (node.value._type === "VariableName" /* VariableName */) {
          value = project.symbols.getFirst(node.value.value)?.value;
        } else {
          value = Utils.print(node.value, item.doc.getText(), () => void 0);
        }
        if (value) {
          repoStrings.push(value);
        }
      }
    });
  }
  for (let string of repoStrings) {
    let idx = string.indexOf("/");
    if (idx > 0) {
      const owner = string.substring(0, idx);
      const repo = string.substring(idx + 1);
      yield { owner, repo };
    }
  }
}
function isRunnable(query) {
  return query.nodes.some((node) => node._type === "Query" /* Query */ || node._type === "OrExpression" /* OrExpression */);
}
function isUsingAtMe(query, project) {
  let result = 0;
  Utils.walk(query, (node, parent) => {
    if (result === 0) {
      if (node._type === "VariableName" /* VariableName */ && parent?._type !== "VariableDefinition" /* VariableDefinition */) {
        let symbol = project.symbols.getFirst(node.value);
        if (symbol) {
          result += 2 * isUsingAtMe(symbol.def, project);
        }
      } else if (node._type === "QualifiedValue" /* QualifiedValue */ && node.value._type === "Literal" /* Literal */ && node.value.value === "@me") {
        const info = QualifiedValueNodeSchema.get(node.qualifier.value);
        if (info?.placeholderType === "username" /* Username */) {
          result = 1;
        }
      }
    }
  });
  return result;
}

// src/extension/notebookProvider.ts
var mimeGithubIssues = "x-application/github-issues";
var atMeLink = "[`@me`](https://docs.github.com/en/search-github/getting-started-with-searching-on-github/understanding-the-search-syntax#queries-with-usernames)";
var IssuesNotebookKernel = class {
  constructor(container, octokit) {
    this.container = container;
    this.octokit = octokit;
    this._executionOrder = 0;
    this._controller = vscode.notebooks.createNotebookController(
      "githubIssueKernel",
      "github-issues",
      "github.com"
    );
    this._controller.supportedLanguages = ["github-issues"];
    this._controller.supportsExecutionOrder = true;
    this._controller.description = "GitHub";
    this._controller.executeHandler = this._executeAll.bind(this);
  }
  dispose() {
    this._controller.dispose();
  }
  _executeAll(cells) {
    const all = /* @__PURE__ */ new Set();
    for (const cell of cells) {
      this._collectDependentCells(cell, all);
    }
    for (const cell of all.values()) {
      this._doExecuteCell(cell);
    }
  }
  async _doExecuteCell(cell) {
    const doc = await vscode.workspace.openTextDocument(cell.document.uri);
    const project = this.container.lookupProject(doc.uri);
    const query = project.getOrCreate(doc);
    project.symbols.update(query);
    const exec = this._controller.createNotebookCellExecution(cell);
    exec.executionOrder = ++this._executionOrder;
    exec.start(Date.now());
    if (!isRunnable(query)) {
      exec.end(true);
      return;
    }
    if (!this.octokit.isAuthenticated) {
      const atMe = isUsingAtMe(query, project);
      if (atMe > 0) {
        const message = atMe > 1 ? vscode.l10n.t({
          message: "This query depends on {0} to specify the current user. For that to work you need to be [logged in](command:github-issues.authNow).",
          args: [atMeLink],
          comment: [
            "The [...](command:...) will be rendered as a markdown link. Only the contents of the square brackets should be translated",
            '{Locked="](command:github-issues.authNow)"}'
          ]
        }) : vscode.l10n.t({
          message: "This query uses {0} to specify the current user. For that to work you need to be [logged in](command:github-issues.authNow).",
          args: [atMeLink],
          comment: [
            "The [...](command:...) will be rendered as a markdown link. Only the contents of the square brackets should be translated",
            '{Locked="](command:github-issues.authNow)"}'
          ]
        });
        exec.replaceOutput(new vscode.NotebookCellOutput([vscode.NotebookCellOutputItem.text(message, "text/markdown")]));
        exec.end(false);
        return;
      }
    }
    const allQueryData = project.queryData(query);
    let allItems = [];
    let tooLarge = false;
    try {
      const abortCtl = new AbortController();
      exec.token.onCancellationRequested((_) => abortCtl.abort());
      for (let queryData of allQueryData) {
        const octokit = await this.octokit.lib();
        let page = 1;
        let count = 0;
        while (!exec.token.isCancellationRequested) {
          const response = await octokit.search.issuesAndPullRequests({
            q: queryData.q,
            sort: queryData.sort,
            order: queryData.order,
            per_page: 100,
            page,
            request: { signal: abortCtl.signal }
          });
          count += response.data.items.length;
          allItems = allItems.concat(response.data.items);
          tooLarge = tooLarge || response.data.total_count > 1e3;
          if (count >= Math.min(1e3, response.data.total_count)) {
            break;
          }
          page += 1;
        }
      }
    } catch (err) {
      if (err instanceof Error && err.message.includes("Authenticated requests get a higher rate limit")) {
        const message = vscode.l10n.t({
          message: "You have exceeded the rate limit for anonymous querying. You can [log in](command:github-issues.authNow) to continue querying.",
          comment: [
            "The [...](command:...) will be rendered as a markdown link. Only the contents of the square brackets should be translated",
            '{Locked="](command:github-issues.authNow)"}'
          ]
        });
        exec.replaceOutput(new vscode.NotebookCellOutput([vscode.NotebookCellOutputItem.text(message, "text/markdown")]));
      } else if (err instanceof Error && err.message.includes("The listed users cannot be searched")) {
        const message = vscode.l10n.t({
          message: "This query uses {0} to specify the current user. For that to work you need to be [logged in](command:github-issues.authNow).",
          args: [atMeLink],
          comment: [
            "The [...](command:...) will be rendered as a markdown link. Only the contents of the square brackets should be translated",
            '{Locked="](command:github-issues.authNow)"}'
          ]
        });
        exec.replaceOutput(new vscode.NotebookCellOutput([vscode.NotebookCellOutputItem.text(message, "text/markdown")]));
      } else {
        exec.replaceOutput(new vscode.NotebookCellOutput([vscode.NotebookCellOutputItem.error(err)]));
      }
      exec.end(false);
      return;
    }
    const [first] = allQueryData;
    const comparator = allQueryData.length >= 2 && allQueryData.every((item) => item.sort === first.sort) && cmp.byName.get(first.sort);
    if (comparator) {
      allItems.sort(first.sort === "asc" ? cmp.invert(comparator) : comparator);
    }
    const seen = /* @__PURE__ */ new Set();
    let md = "";
    for (let item of allItems) {
      if (seen.has(item.url)) {
        continue;
      }
      seen.add(item.url);
      md += `- [#${item.number}](${item.html_url}) ${item.title}`;
      if (item.labels.length > 0) {
        md += ` [${item.labels.map((label) => `${label.name}`).join(", ")}] `;
      }
      if (item.assignee) {
        md += `- [@${item.assignee.login}](${item.assignee.html_url} "${vscode.l10n.t("Issue {0} is assigned to {1}", item.number, item.assignee.login)}")
`;
      }
      md += "\n";
    }
    exec.replaceOutput([new vscode.NotebookCellOutput([
      vscode.NotebookCellOutputItem.json(allItems, mimeGithubIssues),
      vscode.NotebookCellOutputItem.text(md, "text/markdown")
    ], { itemCount: allItems.length })]);
    exec.end(true, Date.now());
  }
  async _collectDependentCells(cell, bucket) {
    const project = this.container.lookupProject(cell.notebook.uri);
    const query = project.getOrCreate(cell.document);
    const seen = /* @__PURE__ */ new Set();
    const stack = [query];
    while (true) {
      const query2 = stack.pop();
      if (!query2) {
        break;
      }
      if (seen.has(query2.id)) {
        continue;
      }
      seen.add(query2.id);
      Utils.walk(query2, (node) => {
        if (node._type === "VariableName" /* VariableName */) {
          const symbol = project.symbols.getFirst(node.value);
          if (symbol) {
            stack.push(symbol.root);
          }
        }
      });
    }
    for (const candidate of cell.notebook.getCells()) {
      if (seen.has(candidate.document.uri.toString())) {
        bucket.add(candidate);
      }
    }
  }
};
var IssuesStatusBarProvider = class {
  provideCellStatusBarItems(cell) {
    const count = cell.outputs[0]?.metadata?.["itemCount"];
    if (typeof count !== "number") {
      return;
    }
    const item = new vscode.NotebookCellStatusBarItem(
      "$(globe) " + vscode.l10n.t("Open {0} results", count),
      vscode.NotebookCellStatusBarAlignment.Right
    );
    item.command = "github-issues.openAll";
    item.tooltip = vscode.l10n.t("Open {0} results in browser", count);
    return item;
  }
};
var IssuesNotebookSerializer = class {
  constructor() {
    this._decoder = new TextDecoder();
    this._encoder = new TextEncoder();
  }
  deserializeNotebook(data) {
    let contents = "";
    try {
      contents = this._decoder.decode(data);
    } catch {
    }
    let raw;
    try {
      raw = JSON.parse(contents);
    } catch {
      raw = [];
    }
    const cells = raw.map((item) => new vscode.NotebookCellData(
      item.kind,
      item.value,
      item.language
    ));
    return new vscode.NotebookData(cells);
  }
  serializeNotebook(data) {
    let contents = [];
    for (let cell of data.cells) {
      contents.push({
        kind: cell.kind,
        language: cell.languageId,
        value: cell.value
      });
    }
    return this._encoder.encode(JSON.stringify(contents, void 0, 2));
  }
};
var cmp;
((cmp2) => {
  cmp2.byName = /* @__PURE__ */ new Map([
    ["comments", compareByComments],
    ["created", compareByCreated],
    ["updated", compareByUpdated]
  ]);
  function invert(compare) {
    return (a, b) => compare(a, b) * -1;
  }
  cmp2.invert = invert;
  function compareByComments(a, b) {
    return a.comments - b.comments;
  }
  cmp2.compareByComments = compareByComments;
  function compareByCreated(a, b) {
    return Date.parse(a.created_at) - Date.parse(b.created_at);
  }
  cmp2.compareByCreated = compareByCreated;
  function compareByUpdated(a, b) {
    return Date.parse(a.updated_at) - Date.parse(b.updated_at);
  }
  cmp2.compareByUpdated = compareByUpdated;
})(cmp || (cmp = {}));

// src/extension/commands.ts
function registerCommands(projectContainer, octokit) {
  const subscriptions = [];
  subscriptions.push(vscode2.commands.registerCommand("github-issues.new", async () => {
    const newNotebook = await vscode2.workspace.openNotebookDocument("github-issues", new vscode2.NotebookData(
      [new vscode2.NotebookCellData(vscode2.NotebookCellKind.Code, "repo:microsoft/vscode is:open", "github-issues")]
    ));
    await vscode2.commands.executeCommand("vscode.openWith", newNotebook.uri, "github-issues");
  }));
  subscriptions.push(vscode2.commands.registerCommand("github-issues.openAll", async (cell) => {
    let items;
    out: for (let output of cell.outputs) {
      for (let item of output.items) {
        if (item.mime === mimeGithubIssues) {
          items = JSON.parse(new TextDecoder().decode(item.data));
          break out;
        }
      }
    }
    if (!items) {
      return;
    }
    if (items.length > 10) {
      const ok = vscode2.l10n.t("OK");
      const option = await vscode2.window.showInformationMessage(
        vscode2.l10n.t("This will open {0} browser tabs. Do you want to continue?", items.length),
        { modal: true },
        ok
      );
      if (option !== ok) {
        return;
      }
    }
    for (let item of items) {
      await vscode2.env.openExternal(vscode2.Uri.parse(item.html_url));
    }
  }));
  subscriptions.push(vscode2.commands.registerCommand("github-issues.openUrl", async (cell) => {
    const project = projectContainer.lookupProject(cell.document.uri, false);
    if (!project) {
      return;
    }
    const data = project.queryData(project.getOrCreate(cell.document));
    for (let d of data) {
      let url = `https://github.com/issues?q=${d.q}`;
      if (d.sort) {
        url += ` sort:${d.sort}`;
      }
      if (d.order) {
        url += `-${d.order}`;
      }
      await vscode2.env.openExternal(vscode2.Uri.parse(url));
    }
  }));
  subscriptions.push(vscode2.commands.registerCommand("github-issues.authNow", async () => {
    await octokit.lib(true);
  }));
  return vscode2.Disposable.from(...subscriptions);
}

// src/extension/languageProvider.ts
var vscode3 = __toESM(require("vscode"), 1);

// src/common/emoji.ts
var _emojiMap = JSON.parse(`{
  "100": "\u{1F4AF}",
  "1234": "\u{1F522}",
  "grinning": "\u{1F600}",
  "smiley": "\u{1F603}",
  "smile": "\u{1F604}",
  "grin": "\u{1F601}",
  "laughing": "\u{1F606}",
  "satisfied": "\u{1F606}",
  "sweat_smile": "\u{1F605}",
  "rofl": "\u{1F923}",
  "joy": "\u{1F602}",
  "slightly_smiling_face": "\u{1F642}",
  "upside_down_face": "\u{1F643}",
  "wink": "\u{1F609}",
  "blush": "\u{1F60A}",
  "innocent": "\u{1F607}",
  "smiling_face_with_three_hearts": "\u{1F970}",
  "heart_eyes": "\u{1F60D}",
  "star_struck": "\u{1F929}",
  "kissing_heart": "\u{1F618}",
  "kissing": "\u{1F617}",
  "relaxed": "\u263A\uFE0F",
  "kissing_closed_eyes": "\u{1F61A}",
  "kissing_smiling_eyes": "\u{1F619}",
  "smiling_face_with_tear": "\u{1F972}",
  "yum": "\u{1F60B}",
  "stuck_out_tongue": "\u{1F61B}",
  "stuck_out_tongue_winking_eye": "\u{1F61C}",
  "zany_face": "\u{1F92A}",
  "stuck_out_tongue_closed_eyes": "\u{1F61D}",
  "money_mouth_face": "\u{1F911}",
  "hugs": "\u{1F917}",
  "hand_over_mouth": "\u{1F92D}",
  "shushing_face": "\u{1F92B}",
  "thinking": "\u{1F914}",
  "zipper_mouth_face": "\u{1F910}",
  "raised_eyebrow": "\u{1F928}",
  "neutral_face": "\u{1F610}",
  "expressionless": "\u{1F611}",
  "no_mouth": "\u{1F636}",
  "smirk": "\u{1F60F}",
  "unamused": "\u{1F612}",
  "roll_eyes": "\u{1F644}",
  "grimacing": "\u{1F62C}",
  "lying_face": "\u{1F925}",
  "relieved": "\u{1F60C}",
  "pensive": "\u{1F614}",
  "sleepy": "\u{1F62A}",
  "drooling_face": "\u{1F924}",
  "sleeping": "\u{1F634}",
  "mask": "\u{1F637}",
  "face_with_thermometer": "\u{1F912}",
  "face_with_head_bandage": "\u{1F915}",
  "nauseated_face": "\u{1F922}",
  "vomiting_face": "\u{1F92E}",
  "sneezing_face": "\u{1F927}",
  "hot_face": "\u{1F975}",
  "cold_face": "\u{1F976}",
  "woozy_face": "\u{1F974}",
  "dizzy_face": "\u{1F635}",
  "exploding_head": "\u{1F92F}",
  "cowboy_hat_face": "\u{1F920}",
  "partying_face": "\u{1F973}",
  "disguised_face": "\u{1F978}",
  "sunglasses": "\u{1F60E}",
  "nerd_face": "\u{1F913}",
  "monocle_face": "\u{1F9D0}",
  "confused": "\u{1F615}",
  "worried": "\u{1F61F}",
  "slightly_frowning_face": "\u{1F641}",
  "frowning_face": "\u2639\uFE0F",
  "open_mouth": "\u{1F62E}",
  "hushed": "\u{1F62F}",
  "astonished": "\u{1F632}",
  "flushed": "\u{1F633}",
  "pleading_face": "\u{1F97A}",
  "frowning": "\u{1F626}",
  "anguished": "\u{1F627}",
  "fearful": "\u{1F628}",
  "cold_sweat": "\u{1F630}",
  "disappointed_relieved": "\u{1F625}",
  "cry": "\u{1F622}",
  "sob": "\u{1F62D}",
  "scream": "\u{1F631}",
  "confounded": "\u{1F616}",
  "persevere": "\u{1F623}",
  "disappointed": "\u{1F61E}",
  "sweat": "\u{1F613}",
  "weary": "\u{1F629}",
  "tired_face": "\u{1F62B}",
  "yawning_face": "\u{1F971}",
  "triumph": "\u{1F624}",
  "rage": "\u{1F621}",
  "pout": "\u{1F621}",
  "angry": "\u{1F620}",
  "cursing_face": "\u{1F92C}",
  "smiling_imp": "\u{1F608}",
  "imp": "\u{1F47F}",
  "skull": "\u{1F480}",
  "skull_and_crossbones": "\u2620\uFE0F",
  "hankey": "\u{1F4A9}",
  "poop": "\u{1F4A9}",
  "shit": "\u{1F4A9}",
  "clown_face": "\u{1F921}",
  "japanese_ogre": "\u{1F479}",
  "japanese_goblin": "\u{1F47A}",
  "ghost": "\u{1F47B}",
  "alien": "\u{1F47D}",
  "space_invader": "\u{1F47E}",
  "robot": "\u{1F916}",
  "smiley_cat": "\u{1F63A}",
  "smile_cat": "\u{1F638}",
  "joy_cat": "\u{1F639}",
  "heart_eyes_cat": "\u{1F63B}",
  "smirk_cat": "\u{1F63C}",
  "kissing_cat": "\u{1F63D}",
  "scream_cat": "\u{1F640}",
  "crying_cat_face": "\u{1F63F}",
  "pouting_cat": "\u{1F63E}",
  "see_no_evil": "\u{1F648}",
  "hear_no_evil": "\u{1F649}",
  "speak_no_evil": "\u{1F64A}",
  "kiss": "\u{1F48B}",
  "love_letter": "\u{1F48C}",
  "cupid": "\u{1F498}",
  "gift_heart": "\u{1F49D}",
  "sparkling_heart": "\u{1F496}",
  "heartpulse": "\u{1F497}",
  "heartbeat": "\u{1F493}",
  "revolving_hearts": "\u{1F49E}",
  "two_hearts": "\u{1F495}",
  "heart_decoration": "\u{1F49F}",
  "heavy_heart_exclamation": "\u2763\uFE0F",
  "broken_heart": "\u{1F494}",
  "heart": "\u2764\uFE0F",
  "orange_heart": "\u{1F9E1}",
  "yellow_heart": "\u{1F49B}",
  "green_heart": "\u{1F49A}",
  "blue_heart": "\u{1F499}",
  "purple_heart": "\u{1F49C}",
  "brown_heart": "\u{1F90E}",
  "black_heart": "\u{1F5A4}",
  "white_heart": "\u{1F90D}",
  "anger": "\u{1F4A2}",
  "boom": "\u{1F4A5}",
  "collision": "\u{1F4A5}",
  "dizzy": "\u{1F4AB}",
  "sweat_drops": "\u{1F4A6}",
  "dash": "\u{1F4A8}",
  "hole": "\u{1F573}\uFE0F",
  "bomb": "\u{1F4A3}",
  "speech_balloon": "\u{1F4AC}",
  "eye_speech_bubble": "\u{1F441}\uFE0F\u200D\u{1F5E8}\uFE0F",
  "left_speech_bubble": "\u{1F5E8}\uFE0F",
  "right_anger_bubble": "\u{1F5EF}\uFE0F",
  "thought_balloon": "\u{1F4AD}",
  "zzz": "\u{1F4A4}",
  "wave": "\u{1F44B}",
  "raised_back_of_hand": "\u{1F91A}",
  "raised_hand_with_fingers_splayed": "\u{1F590}\uFE0F",
  "hand": "\u270B",
  "raised_hand": "\u270B",
  "vulcan_salute": "\u{1F596}",
  "ok_hand": "\u{1F44C}",
  "pinched_fingers": "\u{1F90C}",
  "pinching_hand": "\u{1F90F}",
  "v": "\u270C\uFE0F",
  "crossed_fingers": "\u{1F91E}",
  "love_you_gesture": "\u{1F91F}",
  "metal": "\u{1F918}",
  "call_me_hand": "\u{1F919}",
  "point_left": "\u{1F448}",
  "point_right": "\u{1F449}",
  "point_up_2": "\u{1F446}",
  "middle_finger": "\u{1F595}",
  "fu": "\u{1F595}",
  "point_down": "\u{1F447}",
  "point_up": "\u261D\uFE0F",
  "+1": "\u{1F44D}",
  "thumbsup": "\u{1F44D}",
  "-1": "\u{1F44E}",
  "thumbsdown": "\u{1F44E}",
  "fist_raised": "\u270A",
  "fist": "\u270A",
  "fist_oncoming": "\u{1F44A}",
  "facepunch": "\u{1F44A}",
  "punch": "\u{1F44A}",
  "fist_left": "\u{1F91B}",
  "fist_right": "\u{1F91C}",
  "clap": "\u{1F44F}",
  "raised_hands": "\u{1F64C}",
  "open_hands": "\u{1F450}",
  "palms_up_together": "\u{1F932}",
  "handshake": "\u{1F91D}",
  "pray": "\u{1F64F}",
  "writing_hand": "\u270D\uFE0F",
  "nail_care": "\u{1F485}",
  "selfie": "\u{1F933}",
  "muscle": "\u{1F4AA}",
  "mechanical_arm": "\u{1F9BE}",
  "mechanical_leg": "\u{1F9BF}",
  "leg": "\u{1F9B5}",
  "foot": "\u{1F9B6}",
  "ear": "\u{1F442}",
  "ear_with_hearing_aid": "\u{1F9BB}",
  "nose": "\u{1F443}",
  "brain": "\u{1F9E0}",
  "anatomical_heart": "\u{1FAC0}",
  "lungs": "\u{1FAC1}",
  "tooth": "\u{1F9B7}",
  "bone": "\u{1F9B4}",
  "eyes": "\u{1F440}",
  "eye": "\u{1F441}\uFE0F",
  "tongue": "\u{1F445}",
  "lips": "\u{1F444}",
  "baby": "\u{1F476}",
  "child": "\u{1F9D2}",
  "boy": "\u{1F466}",
  "girl": "\u{1F467}",
  "adult": "\u{1F9D1}",
  "blond_haired_person": "\u{1F471}",
  "man": "\u{1F468}",
  "bearded_person": "\u{1F9D4}",
  "red_haired_man": "\u{1F468}\u200D\u{1F9B0}",
  "curly_haired_man": "\u{1F468}\u200D\u{1F9B1}",
  "white_haired_man": "\u{1F468}\u200D\u{1F9B3}",
  "bald_man": "\u{1F468}\u200D\u{1F9B2}",
  "woman": "\u{1F469}",
  "red_haired_woman": "\u{1F469}\u200D\u{1F9B0}",
  "person_red_hair": "\u{1F9D1}\u200D\u{1F9B0}",
  "curly_haired_woman": "\u{1F469}\u200D\u{1F9B1}",
  "person_curly_hair": "\u{1F9D1}\u200D\u{1F9B1}",
  "white_haired_woman": "\u{1F469}\u200D\u{1F9B3}",
  "person_white_hair": "\u{1F9D1}\u200D\u{1F9B3}",
  "bald_woman": "\u{1F469}\u200D\u{1F9B2}",
  "person_bald": "\u{1F9D1}\u200D\u{1F9B2}",
  "blond_haired_woman": "\u{1F471}\u200D\u2640\uFE0F",
  "blonde_woman": "\u{1F471}\u200D\u2640\uFE0F",
  "blond_haired_man": "\u{1F471}\u200D\u2642\uFE0F",
  "older_adult": "\u{1F9D3}",
  "older_man": "\u{1F474}",
  "older_woman": "\u{1F475}",
  "frowning_person": "\u{1F64D}",
  "frowning_man": "\u{1F64D}\u200D\u2642\uFE0F",
  "frowning_woman": "\u{1F64D}\u200D\u2640\uFE0F",
  "pouting_face": "\u{1F64E}",
  "pouting_man": "\u{1F64E}\u200D\u2642\uFE0F",
  "pouting_woman": "\u{1F64E}\u200D\u2640\uFE0F",
  "no_good": "\u{1F645}",
  "no_good_man": "\u{1F645}\u200D\u2642\uFE0F",
  "ng_man": "\u{1F645}\u200D\u2642\uFE0F",
  "no_good_woman": "\u{1F645}\u200D\u2640\uFE0F",
  "ng_woman": "\u{1F645}\u200D\u2640\uFE0F",
  "ok_person": "\u{1F646}",
  "ok_man": "\u{1F646}\u200D\u2642\uFE0F",
  "ok_woman": "\u{1F646}\u200D\u2640\uFE0F",
  "tipping_hand_person": "\u{1F481}",
  "information_desk_person": "\u{1F481}",
  "tipping_hand_man": "\u{1F481}\u200D\u2642\uFE0F",
  "sassy_man": "\u{1F481}\u200D\u2642\uFE0F",
  "tipping_hand_woman": "\u{1F481}\u200D\u2640\uFE0F",
  "sassy_woman": "\u{1F481}\u200D\u2640\uFE0F",
  "raising_hand": "\u{1F64B}",
  "raising_hand_man": "\u{1F64B}\u200D\u2642\uFE0F",
  "raising_hand_woman": "\u{1F64B}\u200D\u2640\uFE0F",
  "deaf_person": "\u{1F9CF}",
  "deaf_man": "\u{1F9CF}\u200D\u2642\uFE0F",
  "deaf_woman": "\u{1F9CF}\u200D\u2640\uFE0F",
  "bow": "\u{1F647}",
  "bowing_man": "\u{1F647}\u200D\u2642\uFE0F",
  "bowing_woman": "\u{1F647}\u200D\u2640\uFE0F",
  "facepalm": "\u{1F926}",
  "man_facepalming": "\u{1F926}\u200D\u2642\uFE0F",
  "woman_facepalming": "\u{1F926}\u200D\u2640\uFE0F",
  "shrug": "\u{1F937}",
  "man_shrugging": "\u{1F937}\u200D\u2642\uFE0F",
  "woman_shrugging": "\u{1F937}\u200D\u2640\uFE0F",
  "health_worker": "\u{1F9D1}\u200D\u2695\uFE0F",
  "man_health_worker": "\u{1F468}\u200D\u2695\uFE0F",
  "woman_health_worker": "\u{1F469}\u200D\u2695\uFE0F",
  "student": "\u{1F9D1}\u200D\u{1F393}",
  "man_student": "\u{1F468}\u200D\u{1F393}",
  "woman_student": "\u{1F469}\u200D\u{1F393}",
  "teacher": "\u{1F9D1}\u200D\u{1F3EB}",
  "man_teacher": "\u{1F468}\u200D\u{1F3EB}",
  "woman_teacher": "\u{1F469}\u200D\u{1F3EB}",
  "judge": "\u{1F9D1}\u200D\u2696\uFE0F",
  "man_judge": "\u{1F468}\u200D\u2696\uFE0F",
  "woman_judge": "\u{1F469}\u200D\u2696\uFE0F",
  "farmer": "\u{1F9D1}\u200D\u{1F33E}",
  "man_farmer": "\u{1F468}\u200D\u{1F33E}",
  "woman_farmer": "\u{1F469}\u200D\u{1F33E}",
  "cook": "\u{1F9D1}\u200D\u{1F373}",
  "man_cook": "\u{1F468}\u200D\u{1F373}",
  "woman_cook": "\u{1F469}\u200D\u{1F373}",
  "mechanic": "\u{1F9D1}\u200D\u{1F527}",
  "man_mechanic": "\u{1F468}\u200D\u{1F527}",
  "woman_mechanic": "\u{1F469}\u200D\u{1F527}",
  "factory_worker": "\u{1F9D1}\u200D\u{1F3ED}",
  "man_factory_worker": "\u{1F468}\u200D\u{1F3ED}",
  "woman_factory_worker": "\u{1F469}\u200D\u{1F3ED}",
  "office_worker": "\u{1F9D1}\u200D\u{1F4BC}",
  "man_office_worker": "\u{1F468}\u200D\u{1F4BC}",
  "woman_office_worker": "\u{1F469}\u200D\u{1F4BC}",
  "scientist": "\u{1F9D1}\u200D\u{1F52C}",
  "man_scientist": "\u{1F468}\u200D\u{1F52C}",
  "woman_scientist": "\u{1F469}\u200D\u{1F52C}",
  "technologist": "\u{1F9D1}\u200D\u{1F4BB}",
  "man_technologist": "\u{1F468}\u200D\u{1F4BB}",
  "woman_technologist": "\u{1F469}\u200D\u{1F4BB}",
  "singer": "\u{1F9D1}\u200D\u{1F3A4}",
  "man_singer": "\u{1F468}\u200D\u{1F3A4}",
  "woman_singer": "\u{1F469}\u200D\u{1F3A4}",
  "artist": "\u{1F9D1}\u200D\u{1F3A8}",
  "man_artist": "\u{1F468}\u200D\u{1F3A8}",
  "woman_artist": "\u{1F469}\u200D\u{1F3A8}",
  "pilot": "\u{1F9D1}\u200D\u2708\uFE0F",
  "man_pilot": "\u{1F468}\u200D\u2708\uFE0F",
  "woman_pilot": "\u{1F469}\u200D\u2708\uFE0F",
  "astronaut": "\u{1F9D1}\u200D\u{1F680}",
  "man_astronaut": "\u{1F468}\u200D\u{1F680}",
  "woman_astronaut": "\u{1F469}\u200D\u{1F680}",
  "firefighter": "\u{1F9D1}\u200D\u{1F692}",
  "man_firefighter": "\u{1F468}\u200D\u{1F692}",
  "woman_firefighter": "\u{1F469}\u200D\u{1F692}",
  "police_officer": "\u{1F46E}",
  "cop": "\u{1F46E}",
  "policeman": "\u{1F46E}\u200D\u2642\uFE0F",
  "policewoman": "\u{1F46E}\u200D\u2640\uFE0F",
  "detective": "\u{1F575}\uFE0F",
  "male_detective": "\u{1F575}\uFE0F\u200D\u2642\uFE0F",
  "female_detective": "\u{1F575}\uFE0F\u200D\u2640\uFE0F",
  "guard": "\u{1F482}",
  "guardsman": "\u{1F482}\u200D\u2642\uFE0F",
  "guardswoman": "\u{1F482}\u200D\u2640\uFE0F",
  "ninja": "\u{1F977}",
  "construction_worker": "\u{1F477}",
  "construction_worker_man": "\u{1F477}\u200D\u2642\uFE0F",
  "construction_worker_woman": "\u{1F477}\u200D\u2640\uFE0F",
  "prince": "\u{1F934}",
  "princess": "\u{1F478}",
  "person_with_turban": "\u{1F473}",
  "man_with_turban": "\u{1F473}\u200D\u2642\uFE0F",
  "woman_with_turban": "\u{1F473}\u200D\u2640\uFE0F",
  "man_with_gua_pi_mao": "\u{1F472}",
  "woman_with_headscarf": "\u{1F9D5}",
  "person_in_tuxedo": "\u{1F935}",
  "man_in_tuxedo": "\u{1F935}\u200D\u2642\uFE0F",
  "woman_in_tuxedo": "\u{1F935}\u200D\u2640\uFE0F",
  "person_with_veil": "\u{1F470}",
  "man_with_veil": "\u{1F470}\u200D\u2642\uFE0F",
  "woman_with_veil": "\u{1F470}\u200D\u2640\uFE0F",
  "bride_with_veil": "\u{1F470}\u200D\u2640\uFE0F",
  "pregnant_woman": "\u{1F930}",
  "breast_feeding": "\u{1F931}",
  "woman_feeding_baby": "\u{1F469}\u200D\u{1F37C}",
  "man_feeding_baby": "\u{1F468}\u200D\u{1F37C}",
  "person_feeding_baby": "\u{1F9D1}\u200D\u{1F37C}",
  "angel": "\u{1F47C}",
  "santa": "\u{1F385}",
  "mrs_claus": "\u{1F936}",
  "mx_claus": "\u{1F9D1}\u200D\u{1F384}",
  "superhero": "\u{1F9B8}",
  "superhero_man": "\u{1F9B8}\u200D\u2642\uFE0F",
  "superhero_woman": "\u{1F9B8}\u200D\u2640\uFE0F",
  "supervillain": "\u{1F9B9}",
  "supervillain_man": "\u{1F9B9}\u200D\u2642\uFE0F",
  "supervillain_woman": "\u{1F9B9}\u200D\u2640\uFE0F",
  "mage": "\u{1F9D9}",
  "mage_man": "\u{1F9D9}\u200D\u2642\uFE0F",
  "mage_woman": "\u{1F9D9}\u200D\u2640\uFE0F",
  "fairy": "\u{1F9DA}",
  "fairy_man": "\u{1F9DA}\u200D\u2642\uFE0F",
  "fairy_woman": "\u{1F9DA}\u200D\u2640\uFE0F",
  "vampire": "\u{1F9DB}",
  "vampire_man": "\u{1F9DB}\u200D\u2642\uFE0F",
  "vampire_woman": "\u{1F9DB}\u200D\u2640\uFE0F",
  "merperson": "\u{1F9DC}",
  "merman": "\u{1F9DC}\u200D\u2642\uFE0F",
  "mermaid": "\u{1F9DC}\u200D\u2640\uFE0F",
  "elf": "\u{1F9DD}",
  "elf_man": "\u{1F9DD}\u200D\u2642\uFE0F",
  "elf_woman": "\u{1F9DD}\u200D\u2640\uFE0F",
  "genie": "\u{1F9DE}",
  "genie_man": "\u{1F9DE}\u200D\u2642\uFE0F",
  "genie_woman": "\u{1F9DE}\u200D\u2640\uFE0F",
  "zombie": "\u{1F9DF}",
  "zombie_man": "\u{1F9DF}\u200D\u2642\uFE0F",
  "zombie_woman": "\u{1F9DF}\u200D\u2640\uFE0F",
  "massage": "\u{1F486}",
  "massage_man": "\u{1F486}\u200D\u2642\uFE0F",
  "massage_woman": "\u{1F486}\u200D\u2640\uFE0F",
  "haircut": "\u{1F487}",
  "haircut_man": "\u{1F487}\u200D\u2642\uFE0F",
  "haircut_woman": "\u{1F487}\u200D\u2640\uFE0F",
  "walking": "\u{1F6B6}",
  "walking_man": "\u{1F6B6}\u200D\u2642\uFE0F",
  "walking_woman": "\u{1F6B6}\u200D\u2640\uFE0F",
  "standing_person": "\u{1F9CD}",
  "standing_man": "\u{1F9CD}\u200D\u2642\uFE0F",
  "standing_woman": "\u{1F9CD}\u200D\u2640\uFE0F",
  "kneeling_person": "\u{1F9CE}",
  "kneeling_man": "\u{1F9CE}\u200D\u2642\uFE0F",
  "kneeling_woman": "\u{1F9CE}\u200D\u2640\uFE0F",
  "person_with_probing_cane": "\u{1F9D1}\u200D\u{1F9AF}",
  "man_with_probing_cane": "\u{1F468}\u200D\u{1F9AF}",
  "woman_with_probing_cane": "\u{1F469}\u200D\u{1F9AF}",
  "person_in_motorized_wheelchair": "\u{1F9D1}\u200D\u{1F9BC}",
  "man_in_motorized_wheelchair": "\u{1F468}\u200D\u{1F9BC}",
  "woman_in_motorized_wheelchair": "\u{1F469}\u200D\u{1F9BC}",
  "person_in_manual_wheelchair": "\u{1F9D1}\u200D\u{1F9BD}",
  "man_in_manual_wheelchair": "\u{1F468}\u200D\u{1F9BD}",
  "woman_in_manual_wheelchair": "\u{1F469}\u200D\u{1F9BD}",
  "runner": "\u{1F3C3}",
  "running": "\u{1F3C3}",
  "running_man": "\u{1F3C3}\u200D\u2642\uFE0F",
  "running_woman": "\u{1F3C3}\u200D\u2640\uFE0F",
  "woman_dancing": "\u{1F483}",
  "dancer": "\u{1F483}",
  "man_dancing": "\u{1F57A}",
  "business_suit_levitating": "\u{1F574}\uFE0F",
  "dancers": "\u{1F46F}",
  "dancing_men": "\u{1F46F}\u200D\u2642\uFE0F",
  "dancing_women": "\u{1F46F}\u200D\u2640\uFE0F",
  "sauna_person": "\u{1F9D6}",
  "sauna_man": "\u{1F9D6}\u200D\u2642\uFE0F",
  "sauna_woman": "\u{1F9D6}\u200D\u2640\uFE0F",
  "climbing": "\u{1F9D7}",
  "climbing_man": "\u{1F9D7}\u200D\u2642\uFE0F",
  "climbing_woman": "\u{1F9D7}\u200D\u2640\uFE0F",
  "person_fencing": "\u{1F93A}",
  "horse_racing": "\u{1F3C7}",
  "skier": "\u26F7\uFE0F",
  "snowboarder": "\u{1F3C2}",
  "golfing": "\u{1F3CC}\uFE0F",
  "golfing_man": "\u{1F3CC}\uFE0F\u200D\u2642\uFE0F",
  "golfing_woman": "\u{1F3CC}\uFE0F\u200D\u2640\uFE0F",
  "surfer": "\u{1F3C4}",
  "surfing_man": "\u{1F3C4}\u200D\u2642\uFE0F",
  "surfing_woman": "\u{1F3C4}\u200D\u2640\uFE0F",
  "rowboat": "\u{1F6A3}",
  "rowing_man": "\u{1F6A3}\u200D\u2642\uFE0F",
  "rowing_woman": "\u{1F6A3}\u200D\u2640\uFE0F",
  "swimmer": "\u{1F3CA}",
  "swimming_man": "\u{1F3CA}\u200D\u2642\uFE0F",
  "swimming_woman": "\u{1F3CA}\u200D\u2640\uFE0F",
  "bouncing_ball_person": "\u26F9\uFE0F",
  "bouncing_ball_man": "\u26F9\uFE0F\u200D\u2642\uFE0F",
  "basketball_man": "\u26F9\uFE0F\u200D\u2642\uFE0F",
  "bouncing_ball_woman": "\u26F9\uFE0F\u200D\u2640\uFE0F",
  "basketball_woman": "\u26F9\uFE0F\u200D\u2640\uFE0F",
  "weight_lifting": "\u{1F3CB}\uFE0F",
  "weight_lifting_man": "\u{1F3CB}\uFE0F\u200D\u2642\uFE0F",
  "weight_lifting_woman": "\u{1F3CB}\uFE0F\u200D\u2640\uFE0F",
  "bicyclist": "\u{1F6B4}",
  "biking_man": "\u{1F6B4}\u200D\u2642\uFE0F",
  "biking_woman": "\u{1F6B4}\u200D\u2640\uFE0F",
  "mountain_bicyclist": "\u{1F6B5}",
  "mountain_biking_man": "\u{1F6B5}\u200D\u2642\uFE0F",
  "mountain_biking_woman": "\u{1F6B5}\u200D\u2640\uFE0F",
  "cartwheeling": "\u{1F938}",
  "man_cartwheeling": "\u{1F938}\u200D\u2642\uFE0F",
  "woman_cartwheeling": "\u{1F938}\u200D\u2640\uFE0F",
  "wrestling": "\u{1F93C}",
  "men_wrestling": "\u{1F93C}\u200D\u2642\uFE0F",
  "women_wrestling": "\u{1F93C}\u200D\u2640\uFE0F",
  "water_polo": "\u{1F93D}",
  "man_playing_water_polo": "\u{1F93D}\u200D\u2642\uFE0F",
  "woman_playing_water_polo": "\u{1F93D}\u200D\u2640\uFE0F",
  "handball_person": "\u{1F93E}",
  "man_playing_handball": "\u{1F93E}\u200D\u2642\uFE0F",
  "woman_playing_handball": "\u{1F93E}\u200D\u2640\uFE0F",
  "juggling_person": "\u{1F939}",
  "man_juggling": "\u{1F939}\u200D\u2642\uFE0F",
  "woman_juggling": "\u{1F939}\u200D\u2640\uFE0F",
  "lotus_position": "\u{1F9D8}",
  "lotus_position_man": "\u{1F9D8}\u200D\u2642\uFE0F",
  "lotus_position_woman": "\u{1F9D8}\u200D\u2640\uFE0F",
  "bath": "\u{1F6C0}",
  "sleeping_bed": "\u{1F6CC}",
  "people_holding_hands": "\u{1F9D1}\u200D\u{1F91D}\u200D\u{1F9D1}",
  "two_women_holding_hands": "\u{1F46D}",
  "couple": "\u{1F46B}",
  "two_men_holding_hands": "\u{1F46C}",
  "couplekiss": "\u{1F48F}",
  "couplekiss_man_woman": "\u{1F469}\u200D\u2764\uFE0F\u200D\u{1F48B}\u200D\u{1F468}",
  "couplekiss_man_man": "\u{1F468}\u200D\u2764\uFE0F\u200D\u{1F48B}\u200D\u{1F468}",
  "couplekiss_woman_woman": "\u{1F469}\u200D\u2764\uFE0F\u200D\u{1F48B}\u200D\u{1F469}",
  "couple_with_heart": "\u{1F491}",
  "couple_with_heart_woman_man": "\u{1F469}\u200D\u2764\uFE0F\u200D\u{1F468}",
  "couple_with_heart_man_man": "\u{1F468}\u200D\u2764\uFE0F\u200D\u{1F468}",
  "couple_with_heart_woman_woman": "\u{1F469}\u200D\u2764\uFE0F\u200D\u{1F469}",
  "family": "\u{1F46A}",
  "family_man_woman_boy": "\u{1F468}\u200D\u{1F469}\u200D\u{1F466}",
  "family_man_woman_girl": "\u{1F468}\u200D\u{1F469}\u200D\u{1F467}",
  "family_man_woman_girl_boy": "\u{1F468}\u200D\u{1F469}\u200D\u{1F467}\u200D\u{1F466}",
  "family_man_woman_boy_boy": "\u{1F468}\u200D\u{1F469}\u200D\u{1F466}\u200D\u{1F466}",
  "family_man_woman_girl_girl": "\u{1F468}\u200D\u{1F469}\u200D\u{1F467}\u200D\u{1F467}",
  "family_man_man_boy": "\u{1F468}\u200D\u{1F468}\u200D\u{1F466}",
  "family_man_man_girl": "\u{1F468}\u200D\u{1F468}\u200D\u{1F467}",
  "family_man_man_girl_boy": "\u{1F468}\u200D\u{1F468}\u200D\u{1F467}\u200D\u{1F466}",
  "family_man_man_boy_boy": "\u{1F468}\u200D\u{1F468}\u200D\u{1F466}\u200D\u{1F466}",
  "family_man_man_girl_girl": "\u{1F468}\u200D\u{1F468}\u200D\u{1F467}\u200D\u{1F467}",
  "family_woman_woman_boy": "\u{1F469}\u200D\u{1F469}\u200D\u{1F466}",
  "family_woman_woman_girl": "\u{1F469}\u200D\u{1F469}\u200D\u{1F467}",
  "family_woman_woman_girl_boy": "\u{1F469}\u200D\u{1F469}\u200D\u{1F467}\u200D\u{1F466}",
  "family_woman_woman_boy_boy": "\u{1F469}\u200D\u{1F469}\u200D\u{1F466}\u200D\u{1F466}",
  "family_woman_woman_girl_girl": "\u{1F469}\u200D\u{1F469}\u200D\u{1F467}\u200D\u{1F467}",
  "family_man_boy": "\u{1F468}\u200D\u{1F466}",
  "family_man_boy_boy": "\u{1F468}\u200D\u{1F466}\u200D\u{1F466}",
  "family_man_girl": "\u{1F468}\u200D\u{1F467}",
  "family_man_girl_boy": "\u{1F468}\u200D\u{1F467}\u200D\u{1F466}",
  "family_man_girl_girl": "\u{1F468}\u200D\u{1F467}\u200D\u{1F467}",
  "family_woman_boy": "\u{1F469}\u200D\u{1F466}",
  "family_woman_boy_boy": "\u{1F469}\u200D\u{1F466}\u200D\u{1F466}",
  "family_woman_girl": "\u{1F469}\u200D\u{1F467}",
  "family_woman_girl_boy": "\u{1F469}\u200D\u{1F467}\u200D\u{1F466}",
  "family_woman_girl_girl": "\u{1F469}\u200D\u{1F467}\u200D\u{1F467}",
  "speaking_head": "\u{1F5E3}\uFE0F",
  "bust_in_silhouette": "\u{1F464}",
  "busts_in_silhouette": "\u{1F465}",
  "people_hugging": "\u{1FAC2}",
  "footprints": "\u{1F463}",
  "monkey_face": "\u{1F435}",
  "monkey": "\u{1F412}",
  "gorilla": "\u{1F98D}",
  "orangutan": "\u{1F9A7}",
  "dog": "\u{1F436}",
  "dog2": "\u{1F415}",
  "guide_dog": "\u{1F9AE}",
  "service_dog": "\u{1F415}\u200D\u{1F9BA}",
  "poodle": "\u{1F429}",
  "wolf": "\u{1F43A}",
  "fox_face": "\u{1F98A}",
  "raccoon": "\u{1F99D}",
  "cat": "\u{1F431}",
  "cat2": "\u{1F408}",
  "black_cat": "\u{1F408}\u200D\u2B1B",
  "lion": "\u{1F981}",
  "tiger": "\u{1F42F}",
  "tiger2": "\u{1F405}",
  "leopard": "\u{1F406}",
  "horse": "\u{1F434}",
  "racehorse": "\u{1F40E}",
  "unicorn": "\u{1F984}",
  "zebra": "\u{1F993}",
  "deer": "\u{1F98C}",
  "bison": "\u{1F9AC}",
  "cow": "\u{1F42E}",
  "ox": "\u{1F402}",
  "water_buffalo": "\u{1F403}",
  "cow2": "\u{1F404}",
  "pig": "\u{1F437}",
  "pig2": "\u{1F416}",
  "boar": "\u{1F417}",
  "pig_nose": "\u{1F43D}",
  "ram": "\u{1F40F}",
  "sheep": "\u{1F411}",
  "goat": "\u{1F410}",
  "dromedary_camel": "\u{1F42A}",
  "camel": "\u{1F42B}",
  "llama": "\u{1F999}",
  "giraffe": "\u{1F992}",
  "elephant": "\u{1F418}",
  "mammoth": "\u{1F9A3}",
  "rhinoceros": "\u{1F98F}",
  "hippopotamus": "\u{1F99B}",
  "mouse": "\u{1F42D}",
  "mouse2": "\u{1F401}",
  "rat": "\u{1F400}",
  "hamster": "\u{1F439}",
  "rabbit": "\u{1F430}",
  "rabbit2": "\u{1F407}",
  "chipmunk": "\u{1F43F}\uFE0F",
  "beaver": "\u{1F9AB}",
  "hedgehog": "\u{1F994}",
  "bat": "\u{1F987}",
  "bear": "\u{1F43B}",
  "polar_bear": "\u{1F43B}\u200D\u2744\uFE0F",
  "koala": "\u{1F428}",
  "panda_face": "\u{1F43C}",
  "sloth": "\u{1F9A5}",
  "otter": "\u{1F9A6}",
  "skunk": "\u{1F9A8}",
  "kangaroo": "\u{1F998}",
  "badger": "\u{1F9A1}",
  "feet": "\u{1F43E}",
  "paw_prints": "\u{1F43E}",
  "turkey": "\u{1F983}",
  "chicken": "\u{1F414}",
  "rooster": "\u{1F413}",
  "hatching_chick": "\u{1F423}",
  "baby_chick": "\u{1F424}",
  "hatched_chick": "\u{1F425}",
  "bird": "\u{1F426}",
  "penguin": "\u{1F427}",
  "dove": "\u{1F54A}\uFE0F",
  "eagle": "\u{1F985}",
  "duck": "\u{1F986}",
  "swan": "\u{1F9A2}",
  "owl": "\u{1F989}",
  "dodo": "\u{1F9A4}",
  "feather": "\u{1FAB6}",
  "flamingo": "\u{1F9A9}",
  "peacock": "\u{1F99A}",
  "parrot": "\u{1F99C}",
  "frog": "\u{1F438}",
  "crocodile": "\u{1F40A}",
  "turtle": "\u{1F422}",
  "lizard": "\u{1F98E}",
  "snake": "\u{1F40D}",
  "dragon_face": "\u{1F432}",
  "dragon": "\u{1F409}",
  "sauropod": "\u{1F995}",
  "t-rex": "\u{1F996}",
  "whale": "\u{1F433}",
  "whale2": "\u{1F40B}",
  "dolphin": "\u{1F42C}",
  "flipper": "\u{1F42C}",
  "seal": "\u{1F9AD}",
  "fish": "\u{1F41F}",
  "tropical_fish": "\u{1F420}",
  "blowfish": "\u{1F421}",
  "shark": "\u{1F988}",
  "octopus": "\u{1F419}",
  "shell": "\u{1F41A}",
  "snail": "\u{1F40C}",
  "butterfly": "\u{1F98B}",
  "bug": "\u{1F41B}",
  "ant": "\u{1F41C}",
  "bee": "\u{1F41D}",
  "honeybee": "\u{1F41D}",
  "beetle": "\u{1FAB2}",
  "lady_beetle": "\u{1F41E}",
  "cricket": "\u{1F997}",
  "cockroach": "\u{1FAB3}",
  "spider": "\u{1F577}\uFE0F",
  "spider_web": "\u{1F578}\uFE0F",
  "scorpion": "\u{1F982}",
  "mosquito": "\u{1F99F}",
  "fly": "\u{1FAB0}",
  "worm": "\u{1FAB1}",
  "microbe": "\u{1F9A0}",
  "bouquet": "\u{1F490}",
  "cherry_blossom": "\u{1F338}",
  "white_flower": "\u{1F4AE}",
  "rosette": "\u{1F3F5}\uFE0F",
  "rose": "\u{1F339}",
  "wilted_flower": "\u{1F940}",
  "hibiscus": "\u{1F33A}",
  "sunflower": "\u{1F33B}",
  "blossom": "\u{1F33C}",
  "tulip": "\u{1F337}",
  "seedling": "\u{1F331}",
  "potted_plant": "\u{1FAB4}",
  "evergreen_tree": "\u{1F332}",
  "deciduous_tree": "\u{1F333}",
  "palm_tree": "\u{1F334}",
  "cactus": "\u{1F335}",
  "ear_of_rice": "\u{1F33E}",
  "herb": "\u{1F33F}",
  "shamrock": "\u2618\uFE0F",
  "four_leaf_clover": "\u{1F340}",
  "maple_leaf": "\u{1F341}",
  "fallen_leaf": "\u{1F342}",
  "leaves": "\u{1F343}",
  "grapes": "\u{1F347}",
  "melon": "\u{1F348}",
  "watermelon": "\u{1F349}",
  "tangerine": "\u{1F34A}",
  "orange": "\u{1F34A}",
  "mandarin": "\u{1F34A}",
  "lemon": "\u{1F34B}",
  "banana": "\u{1F34C}",
  "pineapple": "\u{1F34D}",
  "mango": "\u{1F96D}",
  "apple": "\u{1F34E}",
  "green_apple": "\u{1F34F}",
  "pear": "\u{1F350}",
  "peach": "\u{1F351}",
  "cherries": "\u{1F352}",
  "strawberry": "\u{1F353}",
  "blueberries": "\u{1FAD0}",
  "kiwi_fruit": "\u{1F95D}",
  "tomato": "\u{1F345}",
  "olive": "\u{1FAD2}",
  "coconut": "\u{1F965}",
  "avocado": "\u{1F951}",
  "eggplant": "\u{1F346}",
  "potato": "\u{1F954}",
  "carrot": "\u{1F955}",
  "corn": "\u{1F33D}",
  "hot_pepper": "\u{1F336}\uFE0F",
  "bell_pepper": "\u{1FAD1}",
  "cucumber": "\u{1F952}",
  "leafy_green": "\u{1F96C}",
  "broccoli": "\u{1F966}",
  "garlic": "\u{1F9C4}",
  "onion": "\u{1F9C5}",
  "mushroom": "\u{1F344}",
  "peanuts": "\u{1F95C}",
  "chestnut": "\u{1F330}",
  "bread": "\u{1F35E}",
  "croissant": "\u{1F950}",
  "baguette_bread": "\u{1F956}",
  "flatbread": "\u{1FAD3}",
  "pretzel": "\u{1F968}",
  "bagel": "\u{1F96F}",
  "pancakes": "\u{1F95E}",
  "waffle": "\u{1F9C7}",
  "cheese": "\u{1F9C0}",
  "meat_on_bone": "\u{1F356}",
  "poultry_leg": "\u{1F357}",
  "cut_of_meat": "\u{1F969}",
  "bacon": "\u{1F953}",
  "hamburger": "\u{1F354}",
  "fries": "\u{1F35F}",
  "pizza": "\u{1F355}",
  "hotdog": "\u{1F32D}",
  "sandwich": "\u{1F96A}",
  "taco": "\u{1F32E}",
  "burrito": "\u{1F32F}",
  "tamale": "\u{1FAD4}",
  "stuffed_flatbread": "\u{1F959}",
  "falafel": "\u{1F9C6}",
  "egg": "\u{1F95A}",
  "fried_egg": "\u{1F373}",
  "shallow_pan_of_food": "\u{1F958}",
  "stew": "\u{1F372}",
  "fondue": "\u{1FAD5}",
  "bowl_with_spoon": "\u{1F963}",
  "green_salad": "\u{1F957}",
  "popcorn": "\u{1F37F}",
  "butter": "\u{1F9C8}",
  "salt": "\u{1F9C2}",
  "canned_food": "\u{1F96B}",
  "bento": "\u{1F371}",
  "rice_cracker": "\u{1F358}",
  "rice_ball": "\u{1F359}",
  "rice": "\u{1F35A}",
  "curry": "\u{1F35B}",
  "ramen": "\u{1F35C}",
  "spaghetti": "\u{1F35D}",
  "sweet_potato": "\u{1F360}",
  "oden": "\u{1F362}",
  "sushi": "\u{1F363}",
  "fried_shrimp": "\u{1F364}",
  "fish_cake": "\u{1F365}",
  "moon_cake": "\u{1F96E}",
  "dango": "\u{1F361}",
  "dumpling": "\u{1F95F}",
  "fortune_cookie": "\u{1F960}",
  "takeout_box": "\u{1F961}",
  "crab": "\u{1F980}",
  "lobster": "\u{1F99E}",
  "shrimp": "\u{1F990}",
  "squid": "\u{1F991}",
  "oyster": "\u{1F9AA}",
  "icecream": "\u{1F366}",
  "shaved_ice": "\u{1F367}",
  "ice_cream": "\u{1F368}",
  "doughnut": "\u{1F369}",
  "cookie": "\u{1F36A}",
  "birthday": "\u{1F382}",
  "cake": "\u{1F370}",
  "cupcake": "\u{1F9C1}",
  "pie": "\u{1F967}",
  "chocolate_bar": "\u{1F36B}",
  "candy": "\u{1F36C}",
  "lollipop": "\u{1F36D}",
  "custard": "\u{1F36E}",
  "honey_pot": "\u{1F36F}",
  "baby_bottle": "\u{1F37C}",
  "milk_glass": "\u{1F95B}",
  "coffee": "\u2615",
  "teapot": "\u{1FAD6}",
  "tea": "\u{1F375}",
  "sake": "\u{1F376}",
  "champagne": "\u{1F37E}",
  "wine_glass": "\u{1F377}",
  "cocktail": "\u{1F378}",
  "tropical_drink": "\u{1F379}",
  "beer": "\u{1F37A}",
  "beers": "\u{1F37B}",
  "clinking_glasses": "\u{1F942}",
  "tumbler_glass": "\u{1F943}",
  "cup_with_straw": "\u{1F964}",
  "bubble_tea": "\u{1F9CB}",
  "beverage_box": "\u{1F9C3}",
  "mate": "\u{1F9C9}",
  "ice_cube": "\u{1F9CA}",
  "chopsticks": "\u{1F962}",
  "plate_with_cutlery": "\u{1F37D}\uFE0F",
  "fork_and_knife": "\u{1F374}",
  "spoon": "\u{1F944}",
  "hocho": "\u{1F52A}",
  "knife": "\u{1F52A}",
  "amphora": "\u{1F3FA}",
  "earth_africa": "\u{1F30D}",
  "earth_americas": "\u{1F30E}",
  "earth_asia": "\u{1F30F}",
  "globe_with_meridians": "\u{1F310}",
  "world_map": "\u{1F5FA}\uFE0F",
  "japan": "\u{1F5FE}",
  "compass": "\u{1F9ED}",
  "mountain_snow": "\u{1F3D4}\uFE0F",
  "mountain": "\u26F0\uFE0F",
  "volcano": "\u{1F30B}",
  "mount_fuji": "\u{1F5FB}",
  "camping": "\u{1F3D5}\uFE0F",
  "beach_umbrella": "\u{1F3D6}\uFE0F",
  "desert": "\u{1F3DC}\uFE0F",
  "desert_island": "\u{1F3DD}\uFE0F",
  "national_park": "\u{1F3DE}\uFE0F",
  "stadium": "\u{1F3DF}\uFE0F",
  "classical_building": "\u{1F3DB}\uFE0F",
  "building_construction": "\u{1F3D7}\uFE0F",
  "bricks": "\u{1F9F1}",
  "rock": "\u{1FAA8}",
  "wood": "\u{1FAB5}",
  "hut": "\u{1F6D6}",
  "houses": "\u{1F3D8}\uFE0F",
  "derelict_house": "\u{1F3DA}\uFE0F",
  "house": "\u{1F3E0}",
  "house_with_garden": "\u{1F3E1}",
  "office": "\u{1F3E2}",
  "post_office": "\u{1F3E3}",
  "european_post_office": "\u{1F3E4}",
  "hospital": "\u{1F3E5}",
  "bank": "\u{1F3E6}",
  "hotel": "\u{1F3E8}",
  "love_hotel": "\u{1F3E9}",
  "convenience_store": "\u{1F3EA}",
  "school": "\u{1F3EB}",
  "department_store": "\u{1F3EC}",
  "factory": "\u{1F3ED}",
  "japanese_castle": "\u{1F3EF}",
  "european_castle": "\u{1F3F0}",
  "wedding": "\u{1F492}",
  "tokyo_tower": "\u{1F5FC}",
  "statue_of_liberty": "\u{1F5FD}",
  "church": "\u26EA",
  "mosque": "\u{1F54C}",
  "hindu_temple": "\u{1F6D5}",
  "synagogue": "\u{1F54D}",
  "shinto_shrine": "\u26E9\uFE0F",
  "kaaba": "\u{1F54B}",
  "fountain": "\u26F2",
  "tent": "\u26FA",
  "foggy": "\u{1F301}",
  "night_with_stars": "\u{1F303}",
  "cityscape": "\u{1F3D9}\uFE0F",
  "sunrise_over_mountains": "\u{1F304}",
  "sunrise": "\u{1F305}",
  "city_sunset": "\u{1F306}",
  "city_sunrise": "\u{1F307}",
  "bridge_at_night": "\u{1F309}",
  "hotsprings": "\u2668\uFE0F",
  "carousel_horse": "\u{1F3A0}",
  "ferris_wheel": "\u{1F3A1}",
  "roller_coaster": "\u{1F3A2}",
  "barber": "\u{1F488}",
  "circus_tent": "\u{1F3AA}",
  "steam_locomotive": "\u{1F682}",
  "railway_car": "\u{1F683}",
  "bullettrain_side": "\u{1F684}",
  "bullettrain_front": "\u{1F685}",
  "train2": "\u{1F686}",
  "metro": "\u{1F687}",
  "light_rail": "\u{1F688}",
  "station": "\u{1F689}",
  "tram": "\u{1F68A}",
  "monorail": "\u{1F69D}",
  "mountain_railway": "\u{1F69E}",
  "train": "\u{1F68B}",
  "bus": "\u{1F68C}",
  "oncoming_bus": "\u{1F68D}",
  "trolleybus": "\u{1F68E}",
  "minibus": "\u{1F690}",
  "ambulance": "\u{1F691}",
  "fire_engine": "\u{1F692}",
  "police_car": "\u{1F693}",
  "oncoming_police_car": "\u{1F694}",
  "taxi": "\u{1F695}",
  "oncoming_taxi": "\u{1F696}",
  "car": "\u{1F697}",
  "red_car": "\u{1F697}",
  "oncoming_automobile": "\u{1F698}",
  "blue_car": "\u{1F699}",
  "pickup_truck": "\u{1F6FB}",
  "truck": "\u{1F69A}",
  "articulated_lorry": "\u{1F69B}",
  "tractor": "\u{1F69C}",
  "racing_car": "\u{1F3CE}\uFE0F",
  "motorcycle": "\u{1F3CD}\uFE0F",
  "motor_scooter": "\u{1F6F5}",
  "manual_wheelchair": "\u{1F9BD}",
  "motorized_wheelchair": "\u{1F9BC}",
  "auto_rickshaw": "\u{1F6FA}",
  "bike": "\u{1F6B2}",
  "kick_scooter": "\u{1F6F4}",
  "skateboard": "\u{1F6F9}",
  "roller_skate": "\u{1F6FC}",
  "busstop": "\u{1F68F}",
  "motorway": "\u{1F6E3}\uFE0F",
  "railway_track": "\u{1F6E4}\uFE0F",
  "oil_drum": "\u{1F6E2}\uFE0F",
  "fuelpump": "\u26FD",
  "rotating_light": "\u{1F6A8}",
  "traffic_light": "\u{1F6A5}",
  "vertical_traffic_light": "\u{1F6A6}",
  "stop_sign": "\u{1F6D1}",
  "construction": "\u{1F6A7}",
  "anchor": "\u2693",
  "boat": "\u26F5",
  "sailboat": "\u26F5",
  "canoe": "\u{1F6F6}",
  "speedboat": "\u{1F6A4}",
  "passenger_ship": "\u{1F6F3}\uFE0F",
  "ferry": "\u26F4\uFE0F",
  "motor_boat": "\u{1F6E5}\uFE0F",
  "ship": "\u{1F6A2}",
  "airplane": "\u2708\uFE0F",
  "small_airplane": "\u{1F6E9}\uFE0F",
  "flight_departure": "\u{1F6EB}",
  "flight_arrival": "\u{1F6EC}",
  "parachute": "\u{1FA82}",
  "seat": "\u{1F4BA}",
  "helicopter": "\u{1F681}",
  "suspension_railway": "\u{1F69F}",
  "mountain_cableway": "\u{1F6A0}",
  "aerial_tramway": "\u{1F6A1}",
  "artificial_satellite": "\u{1F6F0}\uFE0F",
  "rocket": "\u{1F680}",
  "flying_saucer": "\u{1F6F8}",
  "bellhop_bell": "\u{1F6CE}\uFE0F",
  "luggage": "\u{1F9F3}",
  "hourglass": "\u231B",
  "hourglass_flowing_sand": "\u23F3",
  "watch": "\u231A",
  "alarm_clock": "\u23F0",
  "stopwatch": "\u23F1\uFE0F",
  "timer_clock": "\u23F2\uFE0F",
  "mantelpiece_clock": "\u{1F570}\uFE0F",
  "clock12": "\u{1F55B}",
  "clock1230": "\u{1F567}",
  "clock1": "\u{1F550}",
  "clock130": "\u{1F55C}",
  "clock2": "\u{1F551}",
  "clock230": "\u{1F55D}",
  "clock3": "\u{1F552}",
  "clock330": "\u{1F55E}",
  "clock4": "\u{1F553}",
  "clock430": "\u{1F55F}",
  "clock5": "\u{1F554}",
  "clock530": "\u{1F560}",
  "clock6": "\u{1F555}",
  "clock630": "\u{1F561}",
  "clock7": "\u{1F556}",
  "clock730": "\u{1F562}",
  "clock8": "\u{1F557}",
  "clock830": "\u{1F563}",
  "clock9": "\u{1F558}",
  "clock930": "\u{1F564}",
  "clock10": "\u{1F559}",
  "clock1030": "\u{1F565}",
  "clock11": "\u{1F55A}",
  "clock1130": "\u{1F566}",
  "new_moon": "\u{1F311}",
  "waxing_crescent_moon": "\u{1F312}",
  "first_quarter_moon": "\u{1F313}",
  "moon": "\u{1F314}",
  "waxing_gibbous_moon": "\u{1F314}",
  "full_moon": "\u{1F315}",
  "waning_gibbous_moon": "\u{1F316}",
  "last_quarter_moon": "\u{1F317}",
  "waning_crescent_moon": "\u{1F318}",
  "crescent_moon": "\u{1F319}",
  "new_moon_with_face": "\u{1F31A}",
  "first_quarter_moon_with_face": "\u{1F31B}",
  "last_quarter_moon_with_face": "\u{1F31C}",
  "thermometer": "\u{1F321}\uFE0F",
  "sunny": "\u2600\uFE0F",
  "full_moon_with_face": "\u{1F31D}",
  "sun_with_face": "\u{1F31E}",
  "ringed_planet": "\u{1FA90}",
  "star": "\u2B50",
  "star2": "\u{1F31F}",
  "stars": "\u{1F320}",
  "milky_way": "\u{1F30C}",
  "cloud": "\u2601\uFE0F",
  "partly_sunny": "\u26C5",
  "cloud_with_lightning_and_rain": "\u26C8\uFE0F",
  "sun_behind_small_cloud": "\u{1F324}\uFE0F",
  "sun_behind_large_cloud": "\u{1F325}\uFE0F",
  "sun_behind_rain_cloud": "\u{1F326}\uFE0F",
  "cloud_with_rain": "\u{1F327}\uFE0F",
  "cloud_with_snow": "\u{1F328}\uFE0F",
  "cloud_with_lightning": "\u{1F329}\uFE0F",
  "tornado": "\u{1F32A}\uFE0F",
  "fog": "\u{1F32B}\uFE0F",
  "wind_face": "\u{1F32C}\uFE0F",
  "cyclone": "\u{1F300}",
  "rainbow": "\u{1F308}",
  "closed_umbrella": "\u{1F302}",
  "open_umbrella": "\u2602\uFE0F",
  "umbrella": "\u2614",
  "parasol_on_ground": "\u26F1\uFE0F",
  "zap": "\u26A1",
  "snowflake": "\u2744\uFE0F",
  "snowman_with_snow": "\u2603\uFE0F",
  "snowman": "\u26C4",
  "comet": "\u2604\uFE0F",
  "fire": "\u{1F525}",
  "droplet": "\u{1F4A7}",
  "ocean": "\u{1F30A}",
  "jack_o_lantern": "\u{1F383}",
  "christmas_tree": "\u{1F384}",
  "fireworks": "\u{1F386}",
  "sparkler": "\u{1F387}",
  "firecracker": "\u{1F9E8}",
  "sparkles": "\u2728",
  "balloon": "\u{1F388}",
  "tada": "\u{1F389}",
  "confetti_ball": "\u{1F38A}",
  "tanabata_tree": "\u{1F38B}",
  "bamboo": "\u{1F38D}",
  "dolls": "\u{1F38E}",
  "flags": "\u{1F38F}",
  "wind_chime": "\u{1F390}",
  "rice_scene": "\u{1F391}",
  "red_envelope": "\u{1F9E7}",
  "ribbon": "\u{1F380}",
  "gift": "\u{1F381}",
  "reminder_ribbon": "\u{1F397}\uFE0F",
  "tickets": "\u{1F39F}\uFE0F",
  "ticket": "\u{1F3AB}",
  "medal_military": "\u{1F396}\uFE0F",
  "trophy": "\u{1F3C6}",
  "medal_sports": "\u{1F3C5}",
  "1st_place_medal": "\u{1F947}",
  "2nd_place_medal": "\u{1F948}",
  "3rd_place_medal": "\u{1F949}",
  "soccer": "\u26BD",
  "baseball": "\u26BE",
  "softball": "\u{1F94E}",
  "basketball": "\u{1F3C0}",
  "volleyball": "\u{1F3D0}",
  "football": "\u{1F3C8}",
  "rugby_football": "\u{1F3C9}",
  "tennis": "\u{1F3BE}",
  "flying_disc": "\u{1F94F}",
  "bowling": "\u{1F3B3}",
  "cricket_game": "\u{1F3CF}",
  "field_hockey": "\u{1F3D1}",
  "ice_hockey": "\u{1F3D2}",
  "lacrosse": "\u{1F94D}",
  "ping_pong": "\u{1F3D3}",
  "badminton": "\u{1F3F8}",
  "boxing_glove": "\u{1F94A}",
  "martial_arts_uniform": "\u{1F94B}",
  "goal_net": "\u{1F945}",
  "golf": "\u26F3",
  "ice_skate": "\u26F8\uFE0F",
  "fishing_pole_and_fish": "\u{1F3A3}",
  "diving_mask": "\u{1F93F}",
  "running_shirt_with_sash": "\u{1F3BD}",
  "ski": "\u{1F3BF}",
  "sled": "\u{1F6F7}",
  "curling_stone": "\u{1F94C}",
  "dart": "\u{1F3AF}",
  "yo_yo": "\u{1FA80}",
  "kite": "\u{1FA81}",
  "8ball": "\u{1F3B1}",
  "crystal_ball": "\u{1F52E}",
  "magic_wand": "\u{1FA84}",
  "nazar_amulet": "\u{1F9FF}",
  "video_game": "\u{1F3AE}",
  "joystick": "\u{1F579}\uFE0F",
  "slot_machine": "\u{1F3B0}",
  "game_die": "\u{1F3B2}",
  "jigsaw": "\u{1F9E9}",
  "teddy_bear": "\u{1F9F8}",
  "pinata": "\u{1FA85}",
  "nesting_dolls": "\u{1FA86}",
  "spades": "\u2660\uFE0F",
  "hearts": "\u2665\uFE0F",
  "diamonds": "\u2666\uFE0F",
  "clubs": "\u2663\uFE0F",
  "chess_pawn": "\u265F\uFE0F",
  "black_joker": "\u{1F0CF}",
  "mahjong": "\u{1F004}",
  "flower_playing_cards": "\u{1F3B4}",
  "performing_arts": "\u{1F3AD}",
  "framed_picture": "\u{1F5BC}\uFE0F",
  "art": "\u{1F3A8}",
  "thread": "\u{1F9F5}",
  "sewing_needle": "\u{1FAA1}",
  "yarn": "\u{1F9F6}",
  "knot": "\u{1FAA2}",
  "eyeglasses": "\u{1F453}",
  "dark_sunglasses": "\u{1F576}\uFE0F",
  "goggles": "\u{1F97D}",
  "lab_coat": "\u{1F97C}",
  "safety_vest": "\u{1F9BA}",
  "necktie": "\u{1F454}",
  "shirt": "\u{1F455}",
  "tshirt": "\u{1F455}",
  "jeans": "\u{1F456}",
  "scarf": "\u{1F9E3}",
  "gloves": "\u{1F9E4}",
  "coat": "\u{1F9E5}",
  "socks": "\u{1F9E6}",
  "dress": "\u{1F457}",
  "kimono": "\u{1F458}",
  "sari": "\u{1F97B}",
  "one_piece_swimsuit": "\u{1FA71}",
  "swim_brief": "\u{1FA72}",
  "shorts": "\u{1FA73}",
  "bikini": "\u{1F459}",
  "womans_clothes": "\u{1F45A}",
  "purse": "\u{1F45B}",
  "handbag": "\u{1F45C}",
  "pouch": "\u{1F45D}",
  "shopping": "\u{1F6CD}\uFE0F",
  "school_satchel": "\u{1F392}",
  "thong_sandal": "\u{1FA74}",
  "mans_shoe": "\u{1F45E}",
  "shoe": "\u{1F45E}",
  "athletic_shoe": "\u{1F45F}",
  "hiking_boot": "\u{1F97E}",
  "flat_shoe": "\u{1F97F}",
  "high_heel": "\u{1F460}",
  "sandal": "\u{1F461}",
  "ballet_shoes": "\u{1FA70}",
  "boot": "\u{1F462}",
  "crown": "\u{1F451}",
  "womans_hat": "\u{1F452}",
  "tophat": "\u{1F3A9}",
  "mortar_board": "\u{1F393}",
  "billed_cap": "\u{1F9E2}",
  "military_helmet": "\u{1FA96}",
  "rescue_worker_helmet": "\u26D1\uFE0F",
  "prayer_beads": "\u{1F4FF}",
  "lipstick": "\u{1F484}",
  "ring": "\u{1F48D}",
  "gem": "\u{1F48E}",
  "mute": "\u{1F507}",
  "speaker": "\u{1F508}",
  "sound": "\u{1F509}",
  "loud_sound": "\u{1F50A}",
  "loudspeaker": "\u{1F4E2}",
  "mega": "\u{1F4E3}",
  "postal_horn": "\u{1F4EF}",
  "bell": "\u{1F514}",
  "no_bell": "\u{1F515}",
  "musical_score": "\u{1F3BC}",
  "musical_note": "\u{1F3B5}",
  "notes": "\u{1F3B6}",
  "studio_microphone": "\u{1F399}\uFE0F",
  "level_slider": "\u{1F39A}\uFE0F",
  "control_knobs": "\u{1F39B}\uFE0F",
  "microphone": "\u{1F3A4}",
  "headphones": "\u{1F3A7}",
  "radio": "\u{1F4FB}",
  "saxophone": "\u{1F3B7}",
  "accordion": "\u{1FA97}",
  "guitar": "\u{1F3B8}",
  "musical_keyboard": "\u{1F3B9}",
  "trumpet": "\u{1F3BA}",
  "violin": "\u{1F3BB}",
  "banjo": "\u{1FA95}",
  "drum": "\u{1F941}",
  "long_drum": "\u{1FA98}",
  "iphone": "\u{1F4F1}",
  "calling": "\u{1F4F2}",
  "phone": "\u260E\uFE0F",
  "telephone": "\u260E\uFE0F",
  "telephone_receiver": "\u{1F4DE}",
  "pager": "\u{1F4DF}",
  "fax": "\u{1F4E0}",
  "battery": "\u{1F50B}",
  "electric_plug": "\u{1F50C}",
  "computer": "\u{1F4BB}",
  "desktop_computer": "\u{1F5A5}\uFE0F",
  "printer": "\u{1F5A8}\uFE0F",
  "keyboard": "\u2328\uFE0F",
  "computer_mouse": "\u{1F5B1}\uFE0F",
  "trackball": "\u{1F5B2}\uFE0F",
  "minidisc": "\u{1F4BD}",
  "floppy_disk": "\u{1F4BE}",
  "cd": "\u{1F4BF}",
  "dvd": "\u{1F4C0}",
  "abacus": "\u{1F9EE}",
  "movie_camera": "\u{1F3A5}",
  "film_strip": "\u{1F39E}\uFE0F",
  "film_projector": "\u{1F4FD}\uFE0F",
  "clapper": "\u{1F3AC}",
  "tv": "\u{1F4FA}",
  "camera": "\u{1F4F7}",
  "camera_flash": "\u{1F4F8}",
  "video_camera": "\u{1F4F9}",
  "vhs": "\u{1F4FC}",
  "mag": "\u{1F50D}",
  "mag_right": "\u{1F50E}",
  "candle": "\u{1F56F}\uFE0F",
  "bulb": "\u{1F4A1}",
  "flashlight": "\u{1F526}",
  "izakaya_lantern": "\u{1F3EE}",
  "lantern": "\u{1F3EE}",
  "diya_lamp": "\u{1FA94}",
  "notebook_with_decorative_cover": "\u{1F4D4}",
  "closed_book": "\u{1F4D5}",
  "book": "\u{1F4D6}",
  "open_book": "\u{1F4D6}",
  "green_book": "\u{1F4D7}",
  "blue_book": "\u{1F4D8}",
  "orange_book": "\u{1F4D9}",
  "books": "\u{1F4DA}",
  "notebook": "\u{1F4D3}",
  "ledger": "\u{1F4D2}",
  "page_with_curl": "\u{1F4C3}",
  "scroll": "\u{1F4DC}",
  "page_facing_up": "\u{1F4C4}",
  "newspaper": "\u{1F4F0}",
  "newspaper_roll": "\u{1F5DE}\uFE0F",
  "bookmark_tabs": "\u{1F4D1}",
  "bookmark": "\u{1F516}",
  "label": "\u{1F3F7}\uFE0F",
  "moneybag": "\u{1F4B0}",
  "coin": "\u{1FA99}",
  "yen": "\u{1F4B4}",
  "dollar": "\u{1F4B5}",
  "euro": "\u{1F4B6}",
  "pound": "\u{1F4B7}",
  "money_with_wings": "\u{1F4B8}",
  "credit_card": "\u{1F4B3}",
  "receipt": "\u{1F9FE}",
  "chart": "\u{1F4B9}",
  "envelope": "\u2709\uFE0F",
  "email": "\u{1F4E7}",
  "e-mail": "\u{1F4E7}",
  "incoming_envelope": "\u{1F4E8}",
  "envelope_with_arrow": "\u{1F4E9}",
  "outbox_tray": "\u{1F4E4}",
  "inbox_tray": "\u{1F4E5}",
  "package": "\u{1F4E6}",
  "mailbox": "\u{1F4EB}",
  "mailbox_closed": "\u{1F4EA}",
  "mailbox_with_mail": "\u{1F4EC}",
  "mailbox_with_no_mail": "\u{1F4ED}",
  "postbox": "\u{1F4EE}",
  "ballot_box": "\u{1F5F3}\uFE0F",
  "pencil2": "\u270F\uFE0F",
  "black_nib": "\u2712\uFE0F",
  "fountain_pen": "\u{1F58B}\uFE0F",
  "pen": "\u{1F58A}\uFE0F",
  "paintbrush": "\u{1F58C}\uFE0F",
  "crayon": "\u{1F58D}\uFE0F",
  "memo": "\u{1F4DD}",
  "pencil": "\u{1F4DD}",
  "briefcase": "\u{1F4BC}",
  "file_folder": "\u{1F4C1}",
  "open_file_folder": "\u{1F4C2}",
  "card_index_dividers": "\u{1F5C2}\uFE0F",
  "date": "\u{1F4C5}",
  "calendar": "\u{1F4C6}",
  "spiral_notepad": "\u{1F5D2}\uFE0F",
  "spiral_calendar": "\u{1F5D3}\uFE0F",
  "card_index": "\u{1F4C7}",
  "chart_with_upwards_trend": "\u{1F4C8}",
  "chart_with_downwards_trend": "\u{1F4C9}",
  "bar_chart": "\u{1F4CA}",
  "clipboard": "\u{1F4CB}",
  "pushpin": "\u{1F4CC}",
  "round_pushpin": "\u{1F4CD}",
  "paperclip": "\u{1F4CE}",
  "paperclips": "\u{1F587}\uFE0F",
  "straight_ruler": "\u{1F4CF}",
  "triangular_ruler": "\u{1F4D0}",
  "scissors": "\u2702\uFE0F",
  "card_file_box": "\u{1F5C3}\uFE0F",
  "file_cabinet": "\u{1F5C4}\uFE0F",
  "wastebasket": "\u{1F5D1}\uFE0F",
  "lock": "\u{1F512}",
  "unlock": "\u{1F513}",
  "lock_with_ink_pen": "\u{1F50F}",
  "closed_lock_with_key": "\u{1F510}",
  "key": "\u{1F511}",
  "old_key": "\u{1F5DD}\uFE0F",
  "hammer": "\u{1F528}",
  "axe": "\u{1FA93}",
  "pick": "\u26CF\uFE0F",
  "hammer_and_pick": "\u2692\uFE0F",
  "hammer_and_wrench": "\u{1F6E0}\uFE0F",
  "dagger": "\u{1F5E1}\uFE0F",
  "crossed_swords": "\u2694\uFE0F",
  "gun": "\u{1F52B}",
  "boomerang": "\u{1FA83}",
  "bow_and_arrow": "\u{1F3F9}",
  "shield": "\u{1F6E1}\uFE0F",
  "carpentry_saw": "\u{1FA9A}",
  "wrench": "\u{1F527}",
  "screwdriver": "\u{1FA9B}",
  "nut_and_bolt": "\u{1F529}",
  "gear": "\u2699\uFE0F",
  "clamp": "\u{1F5DC}\uFE0F",
  "balance_scale": "\u2696\uFE0F",
  "probing_cane": "\u{1F9AF}",
  "link": "\u{1F517}",
  "chains": "\u26D3\uFE0F",
  "hook": "\u{1FA9D}",
  "toolbox": "\u{1F9F0}",
  "magnet": "\u{1F9F2}",
  "ladder": "\u{1FA9C}",
  "alembic": "\u2697\uFE0F",
  "test_tube": "\u{1F9EA}",
  "petri_dish": "\u{1F9EB}",
  "dna": "\u{1F9EC}",
  "microscope": "\u{1F52C}",
  "telescope": "\u{1F52D}",
  "satellite": "\u{1F4E1}",
  "syringe": "\u{1F489}",
  "drop_of_blood": "\u{1FA78}",
  "pill": "\u{1F48A}",
  "adhesive_bandage": "\u{1FA79}",
  "stethoscope": "\u{1FA7A}",
  "door": "\u{1F6AA}",
  "elevator": "\u{1F6D7}",
  "mirror": "\u{1FA9E}",
  "window": "\u{1FA9F}",
  "bed": "\u{1F6CF}\uFE0F",
  "couch_and_lamp": "\u{1F6CB}\uFE0F",
  "chair": "\u{1FA91}",
  "toilet": "\u{1F6BD}",
  "plunger": "\u{1FAA0}",
  "shower": "\u{1F6BF}",
  "bathtub": "\u{1F6C1}",
  "mouse_trap": "\u{1FAA4}",
  "razor": "\u{1FA92}",
  "lotion_bottle": "\u{1F9F4}",
  "safety_pin": "\u{1F9F7}",
  "broom": "\u{1F9F9}",
  "basket": "\u{1F9FA}",
  "roll_of_paper": "\u{1F9FB}",
  "bucket": "\u{1FAA3}",
  "soap": "\u{1F9FC}",
  "toothbrush": "\u{1FAA5}",
  "sponge": "\u{1F9FD}",
  "fire_extinguisher": "\u{1F9EF}",
  "shopping_cart": "\u{1F6D2}",
  "smoking": "\u{1F6AC}",
  "coffin": "\u26B0\uFE0F",
  "headstone": "\u{1FAA6}",
  "funeral_urn": "\u26B1\uFE0F",
  "moyai": "\u{1F5FF}",
  "placard": "\u{1FAA7}",
  "atm": "\u{1F3E7}",
  "put_litter_in_its_place": "\u{1F6AE}",
  "potable_water": "\u{1F6B0}",
  "wheelchair": "\u267F",
  "mens": "\u{1F6B9}",
  "womens": "\u{1F6BA}",
  "restroom": "\u{1F6BB}",
  "baby_symbol": "\u{1F6BC}",
  "wc": "\u{1F6BE}",
  "passport_control": "\u{1F6C2}",
  "customs": "\u{1F6C3}",
  "baggage_claim": "\u{1F6C4}",
  "left_luggage": "\u{1F6C5}",
  "warning": "\u26A0\uFE0F",
  "children_crossing": "\u{1F6B8}",
  "no_entry": "\u26D4",
  "no_entry_sign": "\u{1F6AB}",
  "no_bicycles": "\u{1F6B3}",
  "no_smoking": "\u{1F6AD}",
  "do_not_litter": "\u{1F6AF}",
  "non-potable_water": "\u{1F6B1}",
  "no_pedestrians": "\u{1F6B7}",
  "no_mobile_phones": "\u{1F4F5}",
  "underage": "\u{1F51E}",
  "radioactive": "\u2622\uFE0F",
  "biohazard": "\u2623\uFE0F",
  "arrow_up": "\u2B06\uFE0F",
  "arrow_upper_right": "\u2197\uFE0F",
  "arrow_right": "\u27A1\uFE0F",
  "arrow_lower_right": "\u2198\uFE0F",
  "arrow_down": "\u2B07\uFE0F",
  "arrow_lower_left": "\u2199\uFE0F",
  "arrow_left": "\u2B05\uFE0F",
  "arrow_upper_left": "\u2196\uFE0F",
  "arrow_up_down": "\u2195\uFE0F",
  "left_right_arrow": "\u2194\uFE0F",
  "leftwards_arrow_with_hook": "\u21A9\uFE0F",
  "arrow_right_hook": "\u21AA\uFE0F",
  "arrow_heading_up": "\u2934\uFE0F",
  "arrow_heading_down": "\u2935\uFE0F",
  "arrows_clockwise": "\u{1F503}",
  "arrows_counterclockwise": "\u{1F504}",
  "back": "\u{1F519}",
  "end": "\u{1F51A}",
  "on": "\u{1F51B}",
  "soon": "\u{1F51C}",
  "top": "\u{1F51D}",
  "place_of_worship": "\u{1F6D0}",
  "atom_symbol": "\u269B\uFE0F",
  "om": "\u{1F549}\uFE0F",
  "star_of_david": "\u2721\uFE0F",
  "wheel_of_dharma": "\u2638\uFE0F",
  "yin_yang": "\u262F\uFE0F",
  "latin_cross": "\u271D\uFE0F",
  "orthodox_cross": "\u2626\uFE0F",
  "star_and_crescent": "\u262A\uFE0F",
  "peace_symbol": "\u262E\uFE0F",
  "menorah": "\u{1F54E}",
  "six_pointed_star": "\u{1F52F}",
  "aries": "\u2648",
  "taurus": "\u2649",
  "gemini": "\u264A",
  "cancer": "\u264B",
  "leo": "\u264C",
  "virgo": "\u264D",
  "libra": "\u264E",
  "scorpius": "\u264F",
  "sagittarius": "\u2650",
  "capricorn": "\u2651",
  "aquarius": "\u2652",
  "pisces": "\u2653",
  "ophiuchus": "\u26CE",
  "twisted_rightwards_arrows": "\u{1F500}",
  "repeat": "\u{1F501}",
  "repeat_one": "\u{1F502}",
  "arrow_forward": "\u25B6\uFE0F",
  "fast_forward": "\u23E9",
  "next_track_button": "\u23ED\uFE0F",
  "play_or_pause_button": "\u23EF\uFE0F",
  "arrow_backward": "\u25C0\uFE0F",
  "rewind": "\u23EA",
  "previous_track_button": "\u23EE\uFE0F",
  "arrow_up_small": "\u{1F53C}",
  "arrow_double_up": "\u23EB",
  "arrow_down_small": "\u{1F53D}",
  "arrow_double_down": "\u23EC",
  "pause_button": "\u23F8\uFE0F",
  "stop_button": "\u23F9\uFE0F",
  "record_button": "\u23FA\uFE0F",
  "eject_button": "\u23CF\uFE0F",
  "cinema": "\u{1F3A6}",
  "low_brightness": "\u{1F505}",
  "high_brightness": "\u{1F506}",
  "signal_strength": "\u{1F4F6}",
  "vibration_mode": "\u{1F4F3}",
  "mobile_phone_off": "\u{1F4F4}",
  "female_sign": "\u2640\uFE0F",
  "male_sign": "\u2642\uFE0F",
  "transgender_symbol": "\u26A7\uFE0F",
  "heavy_multiplication_x": "\u2716\uFE0F",
  "heavy_plus_sign": "\u2795",
  "heavy_minus_sign": "\u2796",
  "heavy_division_sign": "\u2797",
  "infinity": "\u267E\uFE0F",
  "bangbang": "\u203C\uFE0F",
  "interrobang": "\u2049\uFE0F",
  "question": "\u2753",
  "grey_question": "\u2754",
  "grey_exclamation": "\u2755",
  "exclamation": "\u2757",
  "heavy_exclamation_mark": "\u2757",
  "wavy_dash": "\u3030\uFE0F",
  "currency_exchange": "\u{1F4B1}",
  "heavy_dollar_sign": "\u{1F4B2}",
  "medical_symbol": "\u2695\uFE0F",
  "recycle": "\u267B\uFE0F",
  "fleur_de_lis": "\u269C\uFE0F",
  "trident": "\u{1F531}",
  "name_badge": "\u{1F4DB}",
  "beginner": "\u{1F530}",
  "o": "\u2B55",
  "white_check_mark": "\u2705",
  "ballot_box_with_check": "\u2611\uFE0F",
  "heavy_check_mark": "\u2714\uFE0F",
  "x": "\u274C",
  "negative_squared_cross_mark": "\u274E",
  "curly_loop": "\u27B0",
  "loop": "\u27BF",
  "part_alternation_mark": "\u303D\uFE0F",
  "eight_spoked_asterisk": "\u2733\uFE0F",
  "eight_pointed_black_star": "\u2734\uFE0F",
  "sparkle": "\u2747\uFE0F",
  "copyright": "\xA9\uFE0F",
  "registered": "\xAE\uFE0F",
  "tm": "\u2122\uFE0F",
  "hash": "#\uFE0F\u20E3",
  "asterisk": "*\uFE0F\u20E3",
  "zero": "0\uFE0F\u20E3",
  "one": "1\uFE0F\u20E3",
  "two": "2\uFE0F\u20E3",
  "three": "3\uFE0F\u20E3",
  "four": "4\uFE0F\u20E3",
  "five": "5\uFE0F\u20E3",
  "six": "6\uFE0F\u20E3",
  "seven": "7\uFE0F\u20E3",
  "eight": "8\uFE0F\u20E3",
  "nine": "9\uFE0F\u20E3",
  "keycap_ten": "\u{1F51F}",
  "capital_abcd": "\u{1F520}",
  "abcd": "\u{1F521}",
  "symbols": "\u{1F523}",
  "abc": "\u{1F524}",
  "a": "\u{1F170}\uFE0F",
  "ab": "\u{1F18E}",
  "b": "\u{1F171}\uFE0F",
  "cl": "\u{1F191}",
  "cool": "\u{1F192}",
  "free": "\u{1F193}",
  "information_source": "\u2139\uFE0F",
  "id": "\u{1F194}",
  "m": "\u24C2\uFE0F",
  "new": "\u{1F195}",
  "ng": "\u{1F196}",
  "o2": "\u{1F17E}\uFE0F",
  "ok": "\u{1F197}",
  "parking": "\u{1F17F}\uFE0F",
  "sos": "\u{1F198}",
  "up": "\u{1F199}",
  "vs": "\u{1F19A}",
  "koko": "\u{1F201}",
  "sa": "\u{1F202}\uFE0F",
  "ideograph_advantage": "\u{1F250}",
  "accept": "\u{1F251}",
  "congratulations": "\u3297\uFE0F",
  "secret": "\u3299\uFE0F",
  "u6e80": "\u{1F235}",
  "red_circle": "\u{1F534}",
  "orange_circle": "\u{1F7E0}",
  "yellow_circle": "\u{1F7E1}",
  "green_circle": "\u{1F7E2}",
  "large_blue_circle": "\u{1F535}",
  "purple_circle": "\u{1F7E3}",
  "brown_circle": "\u{1F7E4}",
  "black_circle": "\u26AB",
  "white_circle": "\u26AA",
  "red_square": "\u{1F7E5}",
  "orange_square": "\u{1F7E7}",
  "yellow_square": "\u{1F7E8}",
  "green_square": "\u{1F7E9}",
  "blue_square": "\u{1F7E6}",
  "purple_square": "\u{1F7EA}",
  "brown_square": "\u{1F7EB}",
  "black_large_square": "\u2B1B",
  "white_large_square": "\u2B1C",
  "black_medium_square": "\u25FC\uFE0F",
  "white_medium_square": "\u25FB\uFE0F",
  "black_medium_small_square": "\u25FE",
  "white_medium_small_square": "\u25FD",
  "black_small_square": "\u25AA\uFE0F",
  "white_small_square": "\u25AB\uFE0F",
  "large_orange_diamond": "\u{1F536}",
  "large_blue_diamond": "\u{1F537}",
  "small_orange_diamond": "\u{1F538}",
  "small_blue_diamond": "\u{1F539}",
  "small_red_triangle": "\u{1F53A}",
  "small_red_triangle_down": "\u{1F53B}",
  "diamond_shape_with_a_dot_inside": "\u{1F4A0}",
  "radio_button": "\u{1F518}",
  "white_square_button": "\u{1F533}",
  "black_square_button": "\u{1F532}",
  "checkered_flag": "\u{1F3C1}",
  "triangular_flag_on_post": "\u{1F6A9}",
  "crossed_flags": "\u{1F38C}",
  "black_flag": "\u{1F3F4}",
  "white_flag": "\u{1F3F3}\uFE0F",
  "rainbow_flag": "\u{1F3F3}\uFE0F\u200D\u{1F308}",
  "transgender_flag": "\u{1F3F3}\uFE0F\u200D\u26A7\uFE0F",
  "pirate_flag": "\u{1F3F4}\u200D\u2620\uFE0F",
  "ascension_island": "\u{1F1E6}\u{1F1E8}",
  "andorra": "\u{1F1E6}\u{1F1E9}",
  "united_arab_emirates": "\u{1F1E6}\u{1F1EA}",
  "afghanistan": "\u{1F1E6}\u{1F1EB}",
  "antigua_barbuda": "\u{1F1E6}\u{1F1EC}",
  "anguilla": "\u{1F1E6}\u{1F1EE}",
  "albania": "\u{1F1E6}\u{1F1F1}",
  "armenia": "\u{1F1E6}\u{1F1F2}",
  "angola": "\u{1F1E6}\u{1F1F4}",
  "antarctica": "\u{1F1E6}\u{1F1F6}",
  "argentina": "\u{1F1E6}\u{1F1F7}",
  "american_samoa": "\u{1F1E6}\u{1F1F8}",
  "austria": "\u{1F1E6}\u{1F1F9}",
  "australia": "\u{1F1E6}\u{1F1FA}",
  "aruba": "\u{1F1E6}\u{1F1FC}",
  "aland_islands": "\u{1F1E6}\u{1F1FD}",
  "azerbaijan": "\u{1F1E6}\u{1F1FF}",
  "bosnia_herzegovina": "\u{1F1E7}\u{1F1E6}",
  "barbados": "\u{1F1E7}\u{1F1E7}",
  "bangladesh": "\u{1F1E7}\u{1F1E9}",
  "belgium": "\u{1F1E7}\u{1F1EA}",
  "burkina_faso": "\u{1F1E7}\u{1F1EB}",
  "bulgaria": "\u{1F1E7}\u{1F1EC}",
  "bahrain": "\u{1F1E7}\u{1F1ED}",
  "burundi": "\u{1F1E7}\u{1F1EE}",
  "benin": "\u{1F1E7}\u{1F1EF}",
  "st_barthelemy": "\u{1F1E7}\u{1F1F1}",
  "bermuda": "\u{1F1E7}\u{1F1F2}",
  "brunei": "\u{1F1E7}\u{1F1F3}",
  "bolivia": "\u{1F1E7}\u{1F1F4}",
  "caribbean_netherlands": "\u{1F1E7}\u{1F1F6}",
  "brazil": "\u{1F1E7}\u{1F1F7}",
  "bahamas": "\u{1F1E7}\u{1F1F8}",
  "bhutan": "\u{1F1E7}\u{1F1F9}",
  "bouvet_island": "\u{1F1E7}\u{1F1FB}",
  "botswana": "\u{1F1E7}\u{1F1FC}",
  "belarus": "\u{1F1E7}\u{1F1FE}",
  "belize": "\u{1F1E7}\u{1F1FF}",
  "canada": "\u{1F1E8}\u{1F1E6}",
  "cocos_islands": "\u{1F1E8}\u{1F1E8}",
  "congo_kinshasa": "\u{1F1E8}\u{1F1E9}",
  "central_african_republic": "\u{1F1E8}\u{1F1EB}",
  "congo_brazzaville": "\u{1F1E8}\u{1F1EC}",
  "switzerland": "\u{1F1E8}\u{1F1ED}",
  "cote_divoire": "\u{1F1E8}\u{1F1EE}",
  "cook_islands": "\u{1F1E8}\u{1F1F0}",
  "chile": "\u{1F1E8}\u{1F1F1}",
  "cameroon": "\u{1F1E8}\u{1F1F2}",
  "cn": "\u{1F1E8}\u{1F1F3}",
  "colombia": "\u{1F1E8}\u{1F1F4}",
  "clipperton_island": "\u{1F1E8}\u{1F1F5}",
  "costa_rica": "\u{1F1E8}\u{1F1F7}",
  "cuba": "\u{1F1E8}\u{1F1FA}",
  "cape_verde": "\u{1F1E8}\u{1F1FB}",
  "curacao": "\u{1F1E8}\u{1F1FC}",
  "christmas_island": "\u{1F1E8}\u{1F1FD}",
  "cyprus": "\u{1F1E8}\u{1F1FE}",
  "czech_republic": "\u{1F1E8}\u{1F1FF}",
  "de": "\u{1F1E9}\u{1F1EA}",
  "diego_garcia": "\u{1F1E9}\u{1F1EC}",
  "djibouti": "\u{1F1E9}\u{1F1EF}",
  "denmark": "\u{1F1E9}\u{1F1F0}",
  "dominica": "\u{1F1E9}\u{1F1F2}",
  "dominican_republic": "\u{1F1E9}\u{1F1F4}",
  "algeria": "\u{1F1E9}\u{1F1FF}",
  "ceuta_melilla": "\u{1F1EA}\u{1F1E6}",
  "ecuador": "\u{1F1EA}\u{1F1E8}",
  "estonia": "\u{1F1EA}\u{1F1EA}",
  "egypt": "\u{1F1EA}\u{1F1EC}",
  "western_sahara": "\u{1F1EA}\u{1F1ED}",
  "eritrea": "\u{1F1EA}\u{1F1F7}",
  "es": "\u{1F1EA}\u{1F1F8}",
  "ethiopia": "\u{1F1EA}\u{1F1F9}",
  "eu": "\u{1F1EA}\u{1F1FA}",
  "european_union": "\u{1F1EA}\u{1F1FA}",
  "finland": "\u{1F1EB}\u{1F1EE}",
  "fiji": "\u{1F1EB}\u{1F1EF}",
  "falkland_islands": "\u{1F1EB}\u{1F1F0}",
  "micronesia": "\u{1F1EB}\u{1F1F2}",
  "faroe_islands": "\u{1F1EB}\u{1F1F4}",
  "fr": "\u{1F1EB}\u{1F1F7}",
  "gabon": "\u{1F1EC}\u{1F1E6}",
  "gb": "\u{1F1EC}\u{1F1E7}",
  "uk": "\u{1F1EC}\u{1F1E7}",
  "grenada": "\u{1F1EC}\u{1F1E9}",
  "georgia": "\u{1F1EC}\u{1F1EA}",
  "french_guiana": "\u{1F1EC}\u{1F1EB}",
  "guernsey": "\u{1F1EC}\u{1F1EC}",
  "ghana": "\u{1F1EC}\u{1F1ED}",
  "gibraltar": "\u{1F1EC}\u{1F1EE}",
  "greenland": "\u{1F1EC}\u{1F1F1}",
  "gambia": "\u{1F1EC}\u{1F1F2}",
  "guinea": "\u{1F1EC}\u{1F1F3}",
  "guadeloupe": "\u{1F1EC}\u{1F1F5}",
  "equatorial_guinea": "\u{1F1EC}\u{1F1F6}",
  "greece": "\u{1F1EC}\u{1F1F7}",
  "south_georgia_south_sandwich_islands": "\u{1F1EC}\u{1F1F8}",
  "guatemala": "\u{1F1EC}\u{1F1F9}",
  "guam": "\u{1F1EC}\u{1F1FA}",
  "guinea_bissau": "\u{1F1EC}\u{1F1FC}",
  "guyana": "\u{1F1EC}\u{1F1FE}",
  "hong_kong": "\u{1F1ED}\u{1F1F0}",
  "heard_mcdonald_islands": "\u{1F1ED}\u{1F1F2}",
  "honduras": "\u{1F1ED}\u{1F1F3}",
  "croatia": "\u{1F1ED}\u{1F1F7}",
  "haiti": "\u{1F1ED}\u{1F1F9}",
  "hungary": "\u{1F1ED}\u{1F1FA}",
  "canary_islands": "\u{1F1EE}\u{1F1E8}",
  "indonesia": "\u{1F1EE}\u{1F1E9}",
  "ireland": "\u{1F1EE}\u{1F1EA}",
  "israel": "\u{1F1EE}\u{1F1F1}",
  "isle_of_man": "\u{1F1EE}\u{1F1F2}",
  "india": "\u{1F1EE}\u{1F1F3}",
  "british_indian_ocean_territory": "\u{1F1EE}\u{1F1F4}",
  "iraq": "\u{1F1EE}\u{1F1F6}",
  "iran": "\u{1F1EE}\u{1F1F7}",
  "iceland": "\u{1F1EE}\u{1F1F8}",
  "it": "\u{1F1EE}\u{1F1F9}",
  "jersey": "\u{1F1EF}\u{1F1EA}",
  "jamaica": "\u{1F1EF}\u{1F1F2}",
  "jordan": "\u{1F1EF}\u{1F1F4}",
  "jp": "\u{1F1EF}\u{1F1F5}",
  "kenya": "\u{1F1F0}\u{1F1EA}",
  "kyrgyzstan": "\u{1F1F0}\u{1F1EC}",
  "cambodia": "\u{1F1F0}\u{1F1ED}",
  "kiribati": "\u{1F1F0}\u{1F1EE}",
  "comoros": "\u{1F1F0}\u{1F1F2}",
  "st_kitts_nevis": "\u{1F1F0}\u{1F1F3}",
  "north_korea": "\u{1F1F0}\u{1F1F5}",
  "kr": "\u{1F1F0}\u{1F1F7}",
  "kuwait": "\u{1F1F0}\u{1F1FC}",
  "cayman_islands": "\u{1F1F0}\u{1F1FE}",
  "kazakhstan": "\u{1F1F0}\u{1F1FF}",
  "laos": "\u{1F1F1}\u{1F1E6}",
  "lebanon": "\u{1F1F1}\u{1F1E7}",
  "st_lucia": "\u{1F1F1}\u{1F1E8}",
  "liechtenstein": "\u{1F1F1}\u{1F1EE}",
  "sri_lanka": "\u{1F1F1}\u{1F1F0}",
  "liberia": "\u{1F1F1}\u{1F1F7}",
  "lesotho": "\u{1F1F1}\u{1F1F8}",
  "lithuania": "\u{1F1F1}\u{1F1F9}",
  "luxembourg": "\u{1F1F1}\u{1F1FA}",
  "latvia": "\u{1F1F1}\u{1F1FB}",
  "libya": "\u{1F1F1}\u{1F1FE}",
  "morocco": "\u{1F1F2}\u{1F1E6}",
  "monaco": "\u{1F1F2}\u{1F1E8}",
  "moldova": "\u{1F1F2}\u{1F1E9}",
  "montenegro": "\u{1F1F2}\u{1F1EA}",
  "st_martin": "\u{1F1F2}\u{1F1EB}",
  "madagascar": "\u{1F1F2}\u{1F1EC}",
  "marshall_islands": "\u{1F1F2}\u{1F1ED}",
  "macedonia": "\u{1F1F2}\u{1F1F0}",
  "mali": "\u{1F1F2}\u{1F1F1}",
  "myanmar": "\u{1F1F2}\u{1F1F2}",
  "mongolia": "\u{1F1F2}\u{1F1F3}",
  "macau": "\u{1F1F2}\u{1F1F4}",
  "northern_mariana_islands": "\u{1F1F2}\u{1F1F5}",
  "martinique": "\u{1F1F2}\u{1F1F6}",
  "mauritania": "\u{1F1F2}\u{1F1F7}",
  "montserrat": "\u{1F1F2}\u{1F1F8}",
  "malta": "\u{1F1F2}\u{1F1F9}",
  "mauritius": "\u{1F1F2}\u{1F1FA}",
  "maldives": "\u{1F1F2}\u{1F1FB}",
  "malawi": "\u{1F1F2}\u{1F1FC}",
  "mexico": "\u{1F1F2}\u{1F1FD}",
  "malaysia": "\u{1F1F2}\u{1F1FE}",
  "mozambique": "\u{1F1F2}\u{1F1FF}",
  "namibia": "\u{1F1F3}\u{1F1E6}",
  "new_caledonia": "\u{1F1F3}\u{1F1E8}",
  "niger": "\u{1F1F3}\u{1F1EA}",
  "norfolk_island": "\u{1F1F3}\u{1F1EB}",
  "nigeria": "\u{1F1F3}\u{1F1EC}",
  "nicaragua": "\u{1F1F3}\u{1F1EE}",
  "netherlands": "\u{1F1F3}\u{1F1F1}",
  "norway": "\u{1F1F3}\u{1F1F4}",
  "nepal": "\u{1F1F3}\u{1F1F5}",
  "nauru": "\u{1F1F3}\u{1F1F7}",
  "niue": "\u{1F1F3}\u{1F1FA}",
  "new_zealand": "\u{1F1F3}\u{1F1FF}",
  "oman": "\u{1F1F4}\u{1F1F2}",
  "panama": "\u{1F1F5}\u{1F1E6}",
  "peru": "\u{1F1F5}\u{1F1EA}",
  "french_polynesia": "\u{1F1F5}\u{1F1EB}",
  "papua_new_guinea": "\u{1F1F5}\u{1F1EC}",
  "philippines": "\u{1F1F5}\u{1F1ED}",
  "pakistan": "\u{1F1F5}\u{1F1F0}",
  "poland": "\u{1F1F5}\u{1F1F1}",
  "st_pierre_miquelon": "\u{1F1F5}\u{1F1F2}",
  "pitcairn_islands": "\u{1F1F5}\u{1F1F3}",
  "puerto_rico": "\u{1F1F5}\u{1F1F7}",
  "palestinian_territories": "\u{1F1F5}\u{1F1F8}",
  "portugal": "\u{1F1F5}\u{1F1F9}",
  "palau": "\u{1F1F5}\u{1F1FC}",
  "paraguay": "\u{1F1F5}\u{1F1FE}",
  "qatar": "\u{1F1F6}\u{1F1E6}",
  "reunion": "\u{1F1F7}\u{1F1EA}",
  "romania": "\u{1F1F7}\u{1F1F4}",
  "serbia": "\u{1F1F7}\u{1F1F8}",
  "ru": "\u{1F1F7}\u{1F1FA}",
  "rwanda": "\u{1F1F7}\u{1F1FC}",
  "saudi_arabia": "\u{1F1F8}\u{1F1E6}",
  "solomon_islands": "\u{1F1F8}\u{1F1E7}",
  "seychelles": "\u{1F1F8}\u{1F1E8}",
  "sudan": "\u{1F1F8}\u{1F1E9}",
  "sweden": "\u{1F1F8}\u{1F1EA}",
  "singapore": "\u{1F1F8}\u{1F1EC}",
  "st_helena": "\u{1F1F8}\u{1F1ED}",
  "slovenia": "\u{1F1F8}\u{1F1EE}",
  "svalbard_jan_mayen": "\u{1F1F8}\u{1F1EF}",
  "slovakia": "\u{1F1F8}\u{1F1F0}",
  "sierra_leone": "\u{1F1F8}\u{1F1F1}",
  "san_marino": "\u{1F1F8}\u{1F1F2}",
  "senegal": "\u{1F1F8}\u{1F1F3}",
  "somalia": "\u{1F1F8}\u{1F1F4}",
  "suriname": "\u{1F1F8}\u{1F1F7}",
  "south_sudan": "\u{1F1F8}\u{1F1F8}",
  "sao_tome_principe": "\u{1F1F8}\u{1F1F9}",
  "el_salvador": "\u{1F1F8}\u{1F1FB}",
  "sint_maarten": "\u{1F1F8}\u{1F1FD}",
  "syria": "\u{1F1F8}\u{1F1FE}",
  "swaziland": "\u{1F1F8}\u{1F1FF}",
  "tristan_da_cunha": "\u{1F1F9}\u{1F1E6}",
  "turks_caicos_islands": "\u{1F1F9}\u{1F1E8}",
  "chad": "\u{1F1F9}\u{1F1E9}",
  "french_southern_territories": "\u{1F1F9}\u{1F1EB}",
  "togo": "\u{1F1F9}\u{1F1EC}",
  "thailand": "\u{1F1F9}\u{1F1ED}",
  "tajikistan": "\u{1F1F9}\u{1F1EF}",
  "tokelau": "\u{1F1F9}\u{1F1F0}",
  "timor_leste": "\u{1F1F9}\u{1F1F1}",
  "turkmenistan": "\u{1F1F9}\u{1F1F2}",
  "tunisia": "\u{1F1F9}\u{1F1F3}",
  "tonga": "\u{1F1F9}\u{1F1F4}",
  "tr": "\u{1F1F9}\u{1F1F7}",
  "trinidad_tobago": "\u{1F1F9}\u{1F1F9}",
  "tuvalu": "\u{1F1F9}\u{1F1FB}",
  "taiwan": "\u{1F1F9}\u{1F1FC}",
  "tanzania": "\u{1F1F9}\u{1F1FF}",
  "ukraine": "\u{1F1FA}\u{1F1E6}",
  "uganda": "\u{1F1FA}\u{1F1EC}",
  "us_outlying_islands": "\u{1F1FA}\u{1F1F2}",
  "united_nations": "\u{1F1FA}\u{1F1F3}",
  "us": "\u{1F1FA}\u{1F1F8}",
  "uruguay": "\u{1F1FA}\u{1F1FE}",
  "uzbekistan": "\u{1F1FA}\u{1F1FF}",
  "vatican_city": "\u{1F1FB}\u{1F1E6}",
  "st_vincent_grenadines": "\u{1F1FB}\u{1F1E8}",
  "venezuela": "\u{1F1FB}\u{1F1EA}",
  "british_virgin_islands": "\u{1F1FB}\u{1F1EC}",
  "us_virgin_islands": "\u{1F1FB}\u{1F1EE}",
  "vietnam": "\u{1F1FB}\u{1F1F3}",
  "vanuatu": "\u{1F1FB}\u{1F1FA}",
  "wallis_futuna": "\u{1F1FC}\u{1F1EB}",
  "samoa": "\u{1F1FC}\u{1F1F8}",
  "kosovo": "\u{1F1FD}\u{1F1F0}",
  "yemen": "\u{1F1FE}\u{1F1EA}",
  "mayotte": "\u{1F1FE}\u{1F1F9}",
  "south_africa": "\u{1F1FF}\u{1F1E6}",
  "zambia": "\u{1F1FF}\u{1F1F2}",
  "zimbabwe": "\u{1F1FF}\u{1F1FC}",
  "england": "\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}",
  "scotland": "\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}",
  "wales": "\u{1F3F4}\u{E0067}\u{E0062}\u{E0077}\u{E006C}\u{E0073}\u{E007F}"
}`);
function withEmoji(str) {
  return str.replace(/:(\w+(_\w+))*:/gi, (m, g1) => {
    return _emojiMap[g1] ?? m;
  });
}

// src/extension/githubDataProvider.ts
var GithubData = class {
  constructor(octokitProvider) {
    this.octokitProvider = octokitProvider;
    this._cache = /* @__PURE__ */ new Map();
  }
  _getOrFetch(type, info, fetch) {
    const key = type + info.owner + info.repo;
    let result = this._cache.get(key);
    if (!result) {
      result = fetch();
      this._cache.set(key, result);
    }
    return result;
  }
  async getOrFetchLabels(info) {
    return this._getOrFetch("labels", info, async () => {
      const octokit = await this.octokitProvider.lib();
      const options = octokit.issues.listLabelsForRepo.endpoint.merge({ ...info });
      return octokit.paginate(options);
    });
  }
  async getOrFetchMilestones(info) {
    return this._getOrFetch("milestone", info, async () => {
      const octokit = await this.octokitProvider.lib();
      const options = octokit.issues.listMilestones.endpoint.merge({ ...info, state: "all", sort: "due_on" });
      return octokit.paginate(options);
    });
  }
  async getOrFetchUsers(info) {
    return this._getOrFetch("user", info, async () => {
      const octokit = await this.octokitProvider.lib();
      const options = octokit.repos.listContributors.endpoint.merge({ ...info });
      return octokit.paginate(options);
    });
  }
};

// src/extension/parser/scanner.ts
var Scanner = class {
  constructor() {
    this._rules = /* @__PURE__ */ new Map([
      // the sorting here is important because some regular expression
      // are more relaxed than others and would "eat away too much" if 
      // they come early
      ["LineComment" /* LineComment */, /\/\/[^\r\n]*/y],
      ["NewLine" /* NewLine */, /\r\n|\n/y],
      ["Whitespace" /* Whitespace */, /[ \t]+/y],
      ["DateTime" /* DateTime */, /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(Z|\+\d{2}:\d{2})\b/y],
      ["Date" /* Date */, /\d{4}-\d{2}-\d{2}\b/y],
      ["SHA" /* SHA */, /[a-fA-F0-9]{7,40}\b/y],
      ["Number" /* Number */, /\d+\b/y],
      ["QuotedLiteral" /* QuotedLiteral */, /"[^"]+"/y],
      ["Colon" /* Colon */, /:/y],
      ["Comma" /* Comma */, /,/y],
      ["Dash" /* Dash */, /-/y],
      ["Equals" /* Equals */, /=/y],
      ["LessThanEqual" /* LessThanEqual */, /<=/y],
      ["LessThan" /* LessThan */, /</y],
      ["GreaterThanEqual" /* GreaterThanEqual */, />=/y],
      ["GreaterThan" /* GreaterThan */, />/y],
      ["Not" /* Not */, /\bNOT\b/y],
      ["OR" /* OR */, /\bOR\b/y],
      ["VariableName" /* VariableName */, /\$[_a-zA-Z][_a-zA-Z0-9]*/y],
      ["RangeFixedStart" /* RangeFixedStart */, new RegExp("\\.\\.\\*", "y")],
      ["RangeFixedEnd" /* RangeFixedEnd */, new RegExp("\\*\\.\\.", "y")],
      ["Range" /* Range */, new RegExp("\\.\\.", "y")],
      ["Literal" /* Literal */, /[^\s:"=,]+/y],
      ["Unknown" /* Unknown */, /.+/y]
    ]);
    this._value = "";
    this._pos = 0;
  }
  get pos() {
    return this._pos;
  }
  reset(value) {
    this._value = value;
    this._pos = 0;
    return this;
  }
  next() {
    if (this._pos < this._value.length) {
      let match;
      for (let [type, regexp] of this._rules) {
        regexp.lastIndex = this._pos;
        match = regexp.exec(this._value);
        if (match) {
          const token = {
            type,
            start: this._pos,
            end: this._pos + match[0].length
          };
          this._pos = token.end;
          return token;
        }
      }
      throw new Error(`BAD scanner state at ${this._pos} in ${this._value}`);
    }
    return { type: "EOF" /* EOF */, start: this._value.length, end: this._value.length };
  }
  resetPosition(token) {
    if (token) {
      this._pos = token.start;
    }
  }
  value(token) {
    return this._value.substring(token.start, token.end);
  }
  *[Symbol.iterator]() {
    while (true) {
      let token = this.next();
      yield token;
      if (token?.type === "EOF" /* EOF */) {
        break;
      }
    }
  }
};

// src/extension/parser/validation.ts
function validateQueryDocument(doc, symbols) {
  const result = [];
  Utils.walk(doc, (node) => {
    switch (node._type) {
      case "VariableDefinition" /* VariableDefinition */:
        _validateVariableDefinition(node, result);
        break;
      case "Query" /* Query */:
        _validateQuery(node, result, symbols);
        break;
    }
  });
  return result;
}
function _validateVariableDefinition(defNode, bucket) {
  if (defNode.value._type === "Missing" /* Missing */) {
    bucket.push({ node: defNode, code: "NodeMissing" /* NodeMissing */, expected: defNode.value.expected, hint: false });
    return;
  }
  Utils.walk(defNode.value, (node) => {
    if (node._type === "Any" /* Any */ && node.tokenType === "OR" /* OR */) {
      bucket.push({ node, code: "OrNotAllowed" /* OrNotAllowed */ });
    }
    if (node._type === "VariableName" /* VariableName */ && node.value === defNode.name.value) {
      bucket.push({ node, code: "VariableDefinedRecursive" /* VariableDefinedRecursive */ });
    }
  });
}
function _validateQuery(query, bucket, symbols) {
  const mutual = /* @__PURE__ */ new Map();
  for (let node of query.nodes) {
    if (node._type === "QualifiedValue" /* QualifiedValue */) {
      _validateQualifiedValue(node, bucket, symbols, mutual);
    } else if (node._type === "VariableName" /* VariableName */) {
      const info = symbols.getFirst(node.value);
      if (!info) {
        bucket.push({ node, code: "VariableUnknown" /* VariableUnknown */ });
      }
    }
  }
}
function _validateQualifiedValue(node, bucket, symbols, conflicts) {
  const info = QualifiedValueNodeSchema.get(node.qualifier.value);
  if (!info && node.value._type === "Missing" /* Missing */) {
    return;
  }
  if (!info) {
    bucket.push({ node: node.qualifier, code: "QualifierUnknown" /* QualifierUnknown */ });
    return;
  }
  if (info.repeatable === 0 /* No */ || !node.not && info.repeatable === 2 /* RepeatNegated */) {
    const key = `${node.not ? "-" : ""}${node.qualifier.value}`;
    if (conflicts.has(key)) {
      bucket.push({ node, code: "ValueConflict" /* ValueConflict */, conflictNode: conflicts.get(key) });
    } else {
      conflicts.set(key, node);
    }
  }
  if (node.value._type === "Range" /* Range */) {
    _validateRange(node.value, bucket, symbols);
  }
  const validateValue = (valueNode) => {
    if (valueNode._type === "Compare" /* Compare */) {
      valueNode = valueNode.value;
    } else if (valueNode._type === "Range" /* Range */) {
      valueNode = valueNode.open || valueNode.close || valueNode;
    }
    if (info && valueNode._type === "Missing" /* Missing */) {
      bucket.push({ node: valueNode, code: "NodeMissing" /* NodeMissing */, expected: valueNode.expected, hint: true });
      return;
    }
    let valueType;
    let value;
    if (valueNode._type === "VariableName" /* VariableName */) {
      const symbol = symbols.getFirst(valueNode.value);
      valueType = symbol?.type;
      value = symbol?.value;
    } else if (valueNode._type === "Date" /* Date */) {
      valueType = "date" /* Date */;
      value = valueNode.value;
    } else if (valueNode._type === "Number" /* Number */) {
      valueType = "number" /* Number */;
      value = String(valueNode.value);
    } else if (valueNode._type === "Literal" /* Literal */) {
      value = valueNode.value;
      valueType = "literal" /* Literal */;
    }
    if (info.type !== valueType) {
      bucket.push({ node: valueNode, code: "ValueTypeUnknown" /* ValueTypeUnknown */, actual: value, expected: info.type });
      return;
    }
    if (info.enumValues && info.placeholderType === void 0) {
      let set = value && info.enumValues.find((set2) => set2.entries.has(value) ? set2 : void 0);
      if (!set) {
        bucket.push({ node: valueNode, code: "ValueUnknown" /* ValueUnknown */, actual: value, expected: info.enumValues });
      } else if (conflicts.has(set) && set.exclusive) {
        bucket.push({ node, code: "ValueConflict" /* ValueConflict */, conflictNode: conflicts.get(set) });
      } else {
        conflicts.set(set, node);
      }
    }
  };
  if (node.value._type === "LiteralSequence" /* LiteralSequence */) {
    if (!info.valueSequence) {
      bucket.push({ node: node.value, code: "SequenceNotAllowed" /* SequenceNotAllowed */ });
    }
    node.value.nodes.forEach(validateValue);
  } else {
    validateValue(node.value);
  }
}
function _validateRange(node, bucket, symbol) {
  if (node.open && node.close) {
    const typeOpen = Utils.getTypeOfNode(node.open, symbol);
    const typeClose = Utils.getTypeOfNode(node.close, symbol);
    if (typeOpen !== typeClose) {
      bucket.push({ node, code: "RangeMixesTypes" /* RangeMixesTypes */, valueA: typeOpen, valueB: typeClose });
    }
  }
}

// src/extension/languageProvider.ts
var selector = { language: "github-issues" };
var HoverProvider = class {
  constructor(container) {
    this.container = container;
  }
  async provideHover(document, position) {
    const offset = document.offsetAt(position);
    const project = this.container.lookupProject(document.uri);
    const query = project.getOrCreate(document);
    const parents = [];
    const node = Utils.nodeAt(query, offset, parents);
    if (node?._type === "VariableName" /* VariableName */) {
      let info;
      for (let candidate of project.symbols.getAll(node.value)) {
        if (!info) {
          info = candidate;
          continue;
        }
        if (project.getLocation(info.def).uri.toString() === document.uri.toString()) {
          if (project.getLocation(candidate.def).uri.toString() !== document.uri.toString()) {
            break;
          }
        }
        if (candidate.timestamp > info.timestamp) {
          info = candidate;
        }
      }
      return new vscode3.Hover(`\`${info?.value}\`${info?.type ? ` (${info.type})` : ""}`, project.rangeOf(node));
    }
    if (node?._type === "Literal" /* Literal */ && parents[parents.length - 2]?._type === "QualifiedValue" /* QualifiedValue */) {
      const info = QualifiedValueNodeSchema.get(node.value);
      return info?.description && new vscode3.Hover(info.description) || void 0;
    }
    return void 0;
  }
};
var SelectionRangeProvider = class {
  constructor(container) {
    this.container = container;
  }
  async provideSelectionRanges(document, positions) {
    const result = [];
    const project = this.container.lookupProject(document.uri);
    const query = project.getOrCreate(document);
    for (let position of positions) {
      const offset = document.offsetAt(position);
      const parents = [];
      if (Utils.nodeAt(query, offset, parents)) {
        let last;
        for (let node of parents) {
          let selRange = new vscode3.SelectionRange(project.rangeOf(node), last);
          last = selRange;
        }
        if (last) {
          result.push(last);
        }
      }
    }
    return result;
  }
};
var DocumentHighlightProvider = class {
  constructor(container) {
    this.container = container;
  }
  provideDocumentHighlights(document, position) {
    const project = this.container.lookupProject(document.uri);
    const query = project.getOrCreate(document);
    const offset = document.offsetAt(position);
    const node = Utils.nodeAt(query, offset);
    if (node?._type !== "VariableName" /* VariableName */) {
      return;
    }
    const result = [];
    Utils.walk(query, (candidate, parent) => {
      if (candidate._type === "VariableName" /* VariableName */ && candidate.value === node.value) {
        result.push(new vscode3.DocumentHighlight(
          project.rangeOf(candidate, document.uri),
          parent?._type === "VariableDefinition" /* VariableDefinition */ ? vscode3.DocumentHighlightKind.Write : vscode3.DocumentHighlightKind.Read
        ));
      }
    });
    return Promise.all(result);
  }
};
var DefinitionProvider = class {
  constructor(container) {
    this.container = container;
  }
  async provideDefinition(document, position) {
    const project = this.container.lookupProject(document.uri);
    const query = project.getOrCreate(document);
    const offset = document.offsetAt(position);
    const node = Utils.nodeAt(query, offset);
    if (node?._type !== "VariableName" /* VariableName */) {
      return;
    }
    const result = [];
    for (const symbol of project.symbols.getAll(node.value)) {
      result.push(project.getLocation(symbol.def));
    }
    return result;
  }
};
var ReferenceProvider = class {
  constructor(container) {
    this.container = container;
  }
  provideReferences(document, position, context) {
    const project = this.container.lookupProject(document.uri);
    const query = project.getOrCreate(document);
    const offset = document.offsetAt(position);
    const node = Utils.nodeAt(query, offset);
    if (node?._type !== "VariableName" /* VariableName */) {
      return;
    }
    let result = [];
    for (let entry of project.all()) {
      Utils.walk(entry.node, (candidate, parent) => {
        if (candidate._type === "VariableName" /* VariableName */ && candidate.value === node.value) {
          if (context.includeDeclaration || parent?._type !== "VariableDefinition" /* VariableDefinition */) {
            result.push(new vscode3.Location(entry.doc.uri, project.rangeOf(candidate)));
          }
        }
      });
    }
    return Promise.all(result);
  }
};
var RenameProvider = class {
  constructor(container) {
    this.container = container;
  }
  prepareRename(document, position) {
    const project = this.container.lookupProject(document.uri);
    const query = project.getOrCreate(document);
    const offset = document.offsetAt(position);
    const node = Utils.nodeAt(query, offset);
    if (node?._type !== "VariableName" /* VariableName */) {
      throw Error("Only variables names can be renamed");
    }
    return project.rangeOf(node, document.uri);
  }
  async provideRenameEdits(document, position, newName) {
    const project = this.container.lookupProject(document.uri);
    const query = project.getOrCreate(document);
    const offset = document.offsetAt(position);
    const node = Utils.nodeAt(query, offset);
    if (node?._type === "VariableName" /* VariableName */) {
      if (!newName.startsWith("$")) {
        newName = "$" + newName;
      }
      const scanner = new Scanner().reset(newName);
      if (scanner.next().type !== "VariableName" /* VariableName */ || scanner.next().type !== "EOF" /* EOF */) {
        throw new Error(`invalid name: ${newName}`);
      }
      const edit = new vscode3.WorkspaceEdit();
      for (let entry of project.all()) {
        Utils.walk(entry.node, (candidate) => {
          if (candidate._type === "VariableName" /* VariableName */ && candidate.value === node.value) {
            edit.replace(entry.doc.uri, project.rangeOf(candidate), newName);
          }
        });
      }
      return edit;
    }
  }
};
var FormattingProvider = class {
  constructor(container) {
    this.container = container;
  }
  provideOnTypeFormattingEdits(document, position, ch) {
    const project = this.container.lookupProject(document.uri);
    const query = project.getOrCreate(document);
    const nodes = [];
    Utils.nodeAt(query, document.offsetAt(position) - ch.length, nodes);
    const target = nodes.find((node) => node._type === "Query" /* Query */ || node._type === "VariableDefinition" /* VariableDefinition */ || node._type === "OrExpression" /* OrExpression */);
    if (target) {
      return this._formatNode(project, query, target);
    }
  }
  provideDocumentRangeFormattingEdits(document, range) {
    const project = this.container.lookupProject(document.uri);
    const query = project.getOrCreate(document);
    let target = query;
    const nodesStart = [];
    const nodesEnd = [];
    Utils.nodeAt(query, document.offsetAt(range.start), nodesStart);
    Utils.nodeAt(query, document.offsetAt(range.end), nodesEnd);
    for (let node of nodesStart) {
      if (nodesEnd.includes(node)) {
        target = node;
        break;
      }
    }
    return this._formatNode(project, query, target);
  }
  _formatNode(project, query, node) {
    if (node._type !== "QueryDocument" /* QueryDocument */) {
      return [vscode3.TextEdit.replace(
        project.rangeOf(node),
        this._printForFormatting(query, node)
      )];
    }
    let result = [];
    for (let child of node.nodes) {
      const range = project.rangeOf(child);
      const newText = this._printForFormatting(query, child);
      result.push(vscode3.TextEdit.replace(range, newText));
    }
    return result;
  }
  _printForFormatting(query, node) {
    if (node._type === "OrExpression" /* OrExpression */) {
      return `${this._printForFormatting(query, node.left)} OR ${this._printForFormatting(query, node.right)}`;
    } else if (node._type === "VariableDefinition" /* VariableDefinition */) {
      return `${this._printForFormatting(query, node.name)}=${this._printForFormatting(query, node.value)}`;
    } else {
      return Utils.print(node, query.text, () => void 0);
    }
  }
};
var DocumentSemanticTokensProvider = class {
  constructor(container) {
    this.container = container;
  }
  provideDocumentSemanticTokens(document) {
    const project = this.container.lookupProject(document.uri);
    const query = project.getOrCreate(document);
    const builder = new vscode3.SemanticTokensBuilder();
    Utils.walk(query, (node) => {
      let token;
      if (node._type === "OrExpression" /* OrExpression */) {
        token = node.or;
      }
      if (token) {
        const { line, character } = document.positionAt(token.start);
        builder.push(line, character, token.end - token.start, 0);
      }
    });
    return builder.build();
  }
};
DocumentSemanticTokensProvider.legend = new vscode3.SemanticTokensLegend(["keyword"]);
var CompletionItemProvider = class {
  constructor(container) {
    this.container = container;
  }
  provideCompletionItems(document, position) {
    const project = this.container.lookupProject(document.uri);
    const query = project.getOrCreate(document);
    const offset = document.offsetAt(position);
    const parents = [];
    const node = Utils.nodeAt(query, offset, parents) ?? query;
    const parent = parents[parents.length - 2];
    if (parent?._type === "LiteralSequence" /* LiteralSequence */) {
      return;
    }
    if (parent?._type === "QualifiedValue" /* QualifiedValue */ && (node._type === "Literal" /* Literal */ || node._type === "Missing" /* Missing */) && node === parent.value) {
      const replacing = project.rangeOf(node);
      const inserting = replacing.with(void 0, position);
      const result = [];
      const info = QualifiedValueNodeSchema.get(parent.qualifier.value);
      if (info?.enumValues) {
        for (let set of info.enumValues) {
          for (let value of set.entries) {
            result.push({
              label: value,
              kind: vscode3.CompletionItemKind.EnumMember,
              range: { inserting, replacing }
            });
          }
        }
      }
      return result;
    }
    if (node?._type === "QueryDocument" /* QueryDocument */ || node?._type === "Query" /* Query */ || node._type === "Literal" /* Literal */ || node._type === "VariableName" /* VariableName */) {
      const result = [];
      for (let [key, value] of QualifiedValueNodeSchema) {
        result.push({
          label: key,
          kind: vscode3.CompletionItemKind.Enum,
          documentation: value.description
        });
      }
      for (let symbol of project.symbols.all()) {
        result.push({
          label: { label: symbol.name, description: symbol.type ? `${symbol.value} (${symbol.type})` : symbol.value },
          kind: vscode3.CompletionItemKind.Variable
        });
      }
      return result;
    }
  }
};
CompletionItemProvider.triggerCharacters = [":", "$"];
var QuickFixProvider = class {
  provideCodeActions(document, _range, context) {
    const result = [];
    for (let diag of context.diagnostics) {
      if (diag instanceof LanguageValidationDiagnostic && document.version === diag.docVersion) {
        if (diag.code === "ValueConflict" /* ValueConflict */) {
          const action = new vscode3.CodeAction("Remove This", vscode3.CodeActionKind.QuickFix);
          action.diagnostics = [diag];
          action.edit = new vscode3.WorkspaceEdit();
          action.edit.delete(document.uri, diag.range);
          result.push(action);
        }
        if (diag.error.code === "ValueUnknown" /* ValueUnknown */) {
          const action = new vscode3.CodeAction("Replace with Valid Value", vscode3.CodeActionKind.QuickFix);
          action.diagnostics = [diag];
          action.edit = new vscode3.WorkspaceEdit();
          action.edit.set(document.uri, [vscode3.SnippetTextEdit.replace(diag.range, new vscode3.SnippetString().appendChoice(Array.from(diag.error.expected).map((set) => [...set.entries]).flat()))]);
          result.push(action);
        }
      }
      if (diag.code === "GitHubLoginNeeded" /* GitHubLoginNeeded */) {
        const loginForAtMe = vscode3.l10n.t("Login for {0}", "@me");
        const action = new vscode3.CodeAction(loginForAtMe, vscode3.CodeActionKind.QuickFix);
        action.diagnostics = [diag];
        action.command = { command: "github-issues.authNow", title: loginForAtMe };
        result.push(action);
      }
    }
    return result;
  }
};
var ExtractVariableProvider = class {
  constructor(container) {
    this.container = container;
  }
  provideCodeActions(document, range, context) {
    if (context.triggerKind !== vscode3.CodeActionTriggerKind.Invoke || range.isEmpty) {
      return;
    }
    const project = this.container.lookupProject(document.uri);
    const query = project.getOrCreate(document);
    const start = document.offsetAt(range.start);
    const end = document.offsetAt(range.end);
    const startStack = [];
    const endStack = [];
    Utils.nodeAt(query, start, startStack);
    Utils.nodeAt(query, end, endStack);
    let ancestor = void 0;
    for (let i = 0; i < startStack.length && endStack.length; i++) {
      if (startStack[i] !== endStack[i]) {
        break;
      }
      ancestor = startStack[i];
    }
    if (!ancestor || ancestor._type !== "QualifiedValue" /* QualifiedValue */) {
      return;
    }
    const action = new vscode3.CodeAction("Extract As Variable", vscode3.CodeActionKind.RefactorExtract);
    action.edit = new vscode3.WorkspaceEdit();
    action.edit.set(document.uri, [
      vscode3.SnippetTextEdit.insert(project.rangeOf(query, document.uri).start, new vscode3.SnippetString().appendText("$").appendPlaceholder(ancestor.qualifier.value.toUpperCase(), 1).appendText(`=${Utils.print(ancestor, query.text, () => void 0)}

`)),
      vscode3.SnippetTextEdit.replace(project.rangeOf(ancestor, document.uri), new vscode3.SnippetString().appendText("$").appendTabstop(1))
    ]);
    return [action];
  }
};
var NotebookSplitOrIntoCellProvider = class {
  constructor(container) {
    this.container = container;
  }
  provideCodeActions(document, _range, _context) {
    let cell;
    for (let candidate of vscode3.workspace.notebookDocuments) {
      for (let item of candidate.getCells()) {
        if (item.document === document) {
          cell = item;
        }
      }
    }
    if (!cell) {
      return void 0;
    }
    const project = this.container.lookupProject(document.uri);
    const query = project.getOrCreate(document);
    const result = [];
    for (const node of query.nodes) {
      if (node._type === "OrExpression" /* OrExpression */) {
        const orNodeRange = project.rangeOf(node, document.uri);
        if (!_range.intersection(orNodeRange)) {
          continue;
        }
        const nodes = [];
        const stack = [node];
        while (stack.length > 0) {
          let s = stack.pop();
          nodes.push(s.left);
          if (s.right._type === "OrExpression" /* OrExpression */) {
            stack.push(s.right);
          } else {
            nodes.push(s.right);
          }
        }
        const action1 = new vscode3.CodeAction(vscode3.l10n.t("Split OR into Cells"), vscode3.CodeActionKind.RefactorRewrite);
        action1.edit = new vscode3.WorkspaceEdit();
        action1.edit.set(document.uri, [vscode3.TextEdit.delete(orNodeRange)]);
        action1.edit.set(cell.notebook.uri, [vscode3.NotebookEdit.insertCells(
          cell.index + 1,
          nodes.map((node2) => ({
            kind: vscode3.NotebookCellKind.Code,
            languageId: document.languageId,
            value: Utils.print(node2, query.text, (_name) => void 0)
          }))
        )]);
        const action2 = new vscode3.CodeAction(vscode3.l10n.t("Split OR into Statements"), vscode3.CodeActionKind.RefactorRewrite);
        action2.edit = new vscode3.WorkspaceEdit();
        action2.edit.set(document.uri, [vscode3.TextEdit.replace(
          orNodeRange,
          nodes.map((node2) => Utils.print(node2, query.text, (_name) => void 0)).join("\n")
        )]);
        result.push(action1);
        result.push(action2);
      }
    }
    return result;
  }
};
var NotebookExtractCellProvider = class {
  constructor(container) {
    this.container = container;
  }
  provideCodeActions(document, _range, context) {
    if (context.triggerKind !== vscode3.CodeActionTriggerKind.Invoke) {
      return void 0;
    }
    let cell;
    for (let candidate of vscode3.workspace.notebookDocuments) {
      for (let item of candidate.getCells()) {
        if (item.document === document) {
          cell = item;
        }
      }
    }
    if (!cell) {
      return void 0;
    }
    const project = this.container.lookupProject(document.uri);
    const query = project.getOrCreate(document);
    let usesVariables = false;
    let definesVariables = false;
    Utils.walk(query, (node, parent) => {
      usesVariables = usesVariables || node._type === "VariableName" /* VariableName */ && parent?._type !== "VariableDefinition" /* VariableDefinition */;
      definesVariables = definesVariables || node._type === "VariableDefinition" /* VariableDefinition */;
    });
    if (usesVariables) {
      return;
    }
    const filename = `${cell.notebook.uri.path.substring(cell.notebook.uri.path.lastIndexOf("/") + 1)}-cell-${Math.random().toString(16).slice(2, 7)}.github-issues`;
    const newNotebookUri = vscode3.Uri.joinPath(cell.notebook.uri, `../${filename}`);
    const action = new vscode3.CodeAction(
      definesVariables ? vscode3.l10n.t("Copy Cell Into New Notebook") : vscode3.l10n.t("Move Cell Into New Notebook"),
      vscode3.CodeActionKind.RefactorMove
    );
    action.edit = new vscode3.WorkspaceEdit();
    action.edit.createFile(newNotebookUri, { ignoreIfExists: false });
    action.edit.set(newNotebookUri, [vscode3.NotebookEdit.insertCells(0, [{ kind: vscode3.NotebookCellKind.Code, languageId: document.languageId, value: cell.document.getText() }])]);
    action.command = { command: "vscode.open", title: "Show Notebook", arguments: [newNotebookUri] };
    if (!definesVariables) {
      action.edit.set(cell.notebook.uri, [vscode3.NotebookEdit.deleteCells(new vscode3.NotebookRange(cell.index, cell.index + 1))]);
    }
    return [action];
  }
};
var _VariableNamesSourceAction = class _VariableNamesSourceAction {
  constructor(container) {
    this.container = container;
  }
  provideCodeActions(document, _range, _context) {
    const project = this.container.lookupProject(document.uri);
    const defs = /* @__PURE__ */ new Map();
    for (let entry of project.all()) {
      Utils.walk(entry.node, (node) => {
        switch (node._type) {
          case "VariableDefinition" /* VariableDefinition */:
            const newName = node.name.value.toUpperCase();
            if (node.name.value !== newName) {
              defs.set(node.name.value, newName);
            }
            break;
        }
      });
    }
    let counter = 1;
    for (const [oldName, newName] of defs) {
      if (defs.has(newName)) {
        defs.set(oldName, `${newName}${counter++}`);
      }
    }
    const edit = new vscode3.WorkspaceEdit();
    for (let entry of project.all()) {
      Utils.walk(entry.node, (candidate) => {
        if (candidate._type === "VariableName" /* VariableName */) {
          const newName = defs.get(candidate.value);
          if (newName && newName !== candidate.value) {
            edit.replace(entry.doc.uri, project.rangeOf(candidate), newName);
          }
        }
      });
    }
    if (edit.entries().length === 0) {
      return;
    }
    const codeAction = new vscode3.CodeAction("Normalize Variable Names");
    codeAction.kind = _VariableNamesSourceAction.kind;
    codeAction.edit = edit;
    return [codeAction];
  }
};
_VariableNamesSourceAction.kind = vscode3.CodeActionKind.Notebook.append("source.normalizeVariableNames");
var VariableNamesSourceAction = _VariableNamesSourceAction;
var GithubOrgCompletions = class {
  constructor(container, octokitProvider) {
    this.container = container;
    this.octokitProvider = octokitProvider;
  }
  async provideCompletionItems(document, position) {
    const project = this.container.lookupProject(document.uri);
    const doc = project.getOrCreate(document);
    const offset = document.offsetAt(position);
    const parents = [];
    const node = Utils.nodeAt(doc, offset, parents) ?? doc;
    const qualified = parents[parents.length - 2];
    const query = parents[parents.length - 3];
    if (query?._type !== "Query" /* Query */ || qualified?._type !== "QualifiedValue" /* QualifiedValue */ || node !== qualified.value) {
      return;
    }
    const inserting = new vscode3.Range(document.positionAt(qualified.value.start), position);
    const replacing = new vscode3.Range(document.positionAt(qualified.value.start), document.positionAt(qualified.value.end));
    const range = { inserting, replacing };
    const octokit = await this.octokitProvider.lib();
    if (!this.octokitProvider.isAuthenticated) {
      return;
    }
    const info = QualifiedValueNodeSchema.get(qualified.qualifier.value);
    if (info?.placeholderType === "orgname" /* Orgname */) {
      const user = await octokit.users.getAuthenticated();
      const options = octokit.orgs.listForUser.endpoint.merge({ username: user.data.login });
      return octokit.paginate(options).then((values) => values.map((value) => new vscode3.CompletionItem(value.login)));
    }
    if (info?.placeholderType === "repository" /* Repository */) {
      const response = await octokit.repos.listForAuthenticatedUser({ per_page: 100, sort: "pushed", affiliation: "owner,collaborator" });
      return response.data.map((value) => ({ label: value.full_name, range, documentation: new vscode3.MarkdownString().appendMarkdown(`${value.description ?? value.full_name}

${value.html_url}`) }));
    }
  }
};
GithubOrgCompletions.triggerCharacters = [":"];
var GithubRepoSearchCompletions = class {
  constructor(container, octokitProvider) {
    this.container = container;
    this.octokitProvider = octokitProvider;
  }
  async provideCompletionItems(document, position) {
    const project = this.container.lookupProject(document.uri);
    const doc = project.getOrCreate(document);
    const offset = document.offsetAt(position);
    const parents = [];
    const node = Utils.nodeAt(doc, offset, parents) ?? doc;
    const qualified = parents[parents.length - 2];
    const query = parents[parents.length - 3];
    if (query?._type !== "Query" /* Query */ || qualified?._type !== "QualifiedValue" /* QualifiedValue */ || node !== qualified.value) {
      return;
    }
    const info = QualifiedValueNodeSchema.get(qualified.qualifier.value);
    if (info?.placeholderType !== "repository" /* Repository */) {
      return;
    }
    const inserting = new vscode3.Range(document.positionAt(qualified.value.start), position);
    const replacing = new vscode3.Range(document.positionAt(qualified.value.start), document.positionAt(qualified.value.end));
    const range = { inserting, replacing };
    const len = document.offsetAt(position) - qualified.value.start;
    let q = Utils.print(qualified.value, doc.text, (name) => project.symbols.getFirst(name)?.value).substr(0, len);
    if (!q) {
      return new vscode3.CompletionList([], true);
    }
    const idx = q.indexOf("/");
    if (idx > 0) {
      q = `org:${q.substr(0, idx)} ${q.substr(idx + 1)}`;
    }
    const octokit = await this.octokitProvider.lib();
    const repos = await octokit.search.repos({ q, per_page: 10 });
    const items = repos.data.items.map((item) => {
      return {
        label: item.full_name,
        description: new vscode3.MarkdownString().appendMarkdown(`${item.description ?? item.full_name}

${item.html_url}`),
        range
      };
    });
    const incomplete = repos.data.total_count > repos.data.items.length;
    const result = new vscode3.CompletionList(items, incomplete);
    return result;
  }
};
GithubRepoSearchCompletions.triggerCharacters = [":", "/"];
var GithubPlaceholderCompletions = class {
  constructor(container, _githubData) {
    this.container = container;
    this._githubData = _githubData;
  }
  async provideCompletionItems(document, position) {
    const project = this.container.lookupProject(document.uri);
    const doc = project.getOrCreate(document);
    const offset = document.offsetAt(position);
    const parents = [];
    Utils.nodeAt(doc, offset, parents) ?? doc;
    let query;
    let qualified;
    let sequence;
    let literal;
    for (const node of parents) {
      switch (node._type) {
        case "Query" /* Query */:
          query = node;
          break;
        case "QualifiedValue" /* QualifiedValue */:
          qualified = node;
          break;
        case "LiteralSequence" /* LiteralSequence */:
          sequence = node;
          break;
        case "Literal" /* Literal */:
        case "Missing" /* Missing */:
          literal = node;
          break;
      }
    }
    if (!query || !qualified) {
      return;
    }
    if (!sequence && qualified.value !== literal) {
      return;
    }
    const repos = getAllRepos(project);
    const info = QualifiedValueNodeSchema.get(qualified.qualifier.value);
    let range = { inserting: new vscode3.Range(position, position), replacing: new vscode3.Range(position, position) };
    if (literal) {
      const inserting = new vscode3.Range(document.positionAt(literal.start), position);
      const replacing = new vscode3.Range(document.positionAt(literal.start), document.positionAt(literal.end));
      range = { inserting, replacing };
    }
    if (info?.placeholderType === "label" /* Label */ || sequence) {
      return this._completeLabels(repos, literal ? void 0 : sequence, range);
    } else if (info?.placeholderType === "milestone" /* Milestone */) {
      return this._completeMilestones(repos, range);
    } else if (info?.placeholderType === "username" /* Username */) {
      return this._completeUsernames(repos, range);
    }
  }
  async _completeLabels(repos, sequence, range) {
    const result = /* @__PURE__ */ new Map();
    const isUseInSequence = sequence && new Set(sequence.nodes.map((node) => node.value));
    for (let info of repos) {
      const labels = await this._githubData.getOrFetchLabels(info);
      for (const label of labels) {
        if (isUseInSequence?.has(label.name)) {
          continue;
        }
        let existing = result.get(label.name);
        if (existing) {
          existing.detail = void 0;
          existing.kind = vscode3.CompletionItemKind.Constant;
          existing.documentation = void 0;
          existing.sortText = String.fromCharCode(0) + existing.label;
        } else {
          result.set(label.name, {
            label: { label: withEmoji(label.name), description: label.description },
            range,
            kind: vscode3.CompletionItemKind.Color,
            documentation: `#${label.color}`,
            insertText: label.name.match(/\s/) ? `"${label.name}"` : void 0,
            filterText: label.name.match(/\s/) ? `"${label.name}"` : void 0
          });
        }
      }
    }
    return [...result.values()];
  }
  async _completeMilestones(repos, range) {
    const result = /* @__PURE__ */ new Map();
    for (let info of repos) {
      const milestones = await this._githubData.getOrFetchMilestones(info);
      for (let milestone of milestones) {
        if (milestone.state === "closed") {
          continue;
        }
        let existing = result.get(milestone.title);
        if (existing) {
          existing.documentation = void 0;
          existing.sortText = String.fromCharCode(0) + existing.sortText;
        } else {
          result.set(milestone.title, {
            label: { label: milestone.title, description: milestone.description },
            range,
            kind: vscode3.CompletionItemKind.Event,
            insertText: milestone.title.match(/\s/) ? `"${milestone.title}"` : void 0,
            filterText: milestone.title.match(/\s/) ? `"${milestone.title}"` : void 0,
            sortText: milestone.due_on
          });
        }
      }
    }
    return [...result.values()];
  }
  async _completeUsernames(repos, range) {
    const result = /* @__PURE__ */ new Map();
    for (let info of repos) {
      for (let user of await this._githubData.getOrFetchUsers(info)) {
        if (!result.has(user.login)) {
          result.set(user.login, {
            label: user.login,
            kind: vscode3.CompletionItemKind.User,
            range
          });
        }
      }
    }
    return [...result.values()];
  }
};
GithubPlaceholderCompletions.triggerCharacters = [":", ","];
var IProjectValidation = class {
  constructor() {
    this._collections = /* @__PURE__ */ new Map();
  }
  clearProject(project) {
    let collection = this._collections.get(project);
    if (collection) {
      collection.dispose();
      this._collections.delete(project);
    }
  }
};
var LanguageValidationDiagnostic = class _LanguageValidationDiagnostic extends vscode3.Diagnostic {
  constructor(error, project, doc) {
    super(project.rangeOf(error.node), _LanguageValidationDiagnostic.asMessage(error));
    this.error = error;
    this.code = error.code;
    this.docVersion = doc.version;
    if (error.code === "ValueConflict" /* ValueConflict */ && error.conflictNode) {
      this.relatedInformation = [new vscode3.DiagnosticRelatedInformation(
        new vscode3.Location(doc.uri, project.rangeOf(error.conflictNode)),
        project.textOf(error.conflictNode)
      )];
      this.tags = [vscode3.DiagnosticTag.Unnecessary];
    }
    if (error.code === "NodeMissing" /* NodeMissing */ && error.hint) {
      this.severity = vscode3.DiagnosticSeverity.Information;
    }
  }
  static asMessage(error) {
    switch (error.code) {
      case "NodeMissing" /* NodeMissing */:
        return vscode3.l10n.t("Expected {0}", error.expected.join(", "));
      case "OrNotAllowed" /* OrNotAllowed */:
        return vscode3.l10n.t("OR is not supported when defining a variable");
      case "VariableDefinedRecursive" /* VariableDefinedRecursive */:
        return vscode3.l10n.t("Cannot reference a variable from its definition");
      case "VariableUnknown" /* VariableUnknown */:
        return vscode3.l10n.t(`Unknown variable`);
      case "QualifierUnknown" /* QualifierUnknown */:
        return vscode3.l10n.t("Unknown qualifier: '{0}'", error.node.value);
      case "ValueConflict" /* ValueConflict */:
        return vscode3.l10n.t("This conflicts with another usage");
      case "ValueTypeUnknown" /* ValueTypeUnknown */:
        return vscode3.l10n.t("Unknown value '{0}', expected type '{1}'", error.actual, error.expected);
      case "ValueUnknown" /* ValueUnknown */:
        return vscode3.l10n.t("Unknown value '{0}', expected one of '{1}'", error.actual, Array.from(error.expected).map((set) => [...set.entries]).flat().join(", "));
      case "SequenceNotAllowed" /* SequenceNotAllowed */:
        return vscode3.l10n.t(`Sequence of values is not allowed`);
      case "RangeMixesTypes" /* RangeMixesTypes */:
        return vscode3.l10n.t("This range uses mixed values: {0} and {1}`", error.valueA, error.valueB);
    }
  }
};
var LanguageValidation = class extends IProjectValidation {
  validateProject(project) {
    let collection = this._collections.get(project);
    if (!collection) {
      collection = vscode3.languages.createDiagnosticCollection();
      this._collections.set(project, collection);
    } else {
      collection.clear();
    }
    for (let { node, doc } of project.all()) {
      const newDiagnostics = [];
      for (let error of validateQueryDocument(node, project.symbols)) {
        newDiagnostics.push(new LanguageValidationDiagnostic(error, project, doc));
      }
      collection.set(doc.uri, newDiagnostics);
    }
  }
};
var GithubValidation = class extends IProjectValidation {
  constructor(githubData, octokit) {
    super();
    this.githubData = githubData;
    this.octokit = octokit;
  }
  validateProject(project, token) {
    let collection = this._collections.get(project);
    if (!collection) {
      collection = vscode3.languages.createDiagnosticCollection();
      this._collections.set(project, collection);
    } else {
      collection.clear();
    }
    const repos = Array.from(getAllRepos(project));
    if (repos.length === 0) {
      return;
    }
    for (let { node: queryDoc, doc } of project.all()) {
      const newDiagnostics = [];
      const work = [];
      Utils.walk(queryDoc, async (node, parent) => {
        if (parent?._type !== "Query" /* Query */ || node._type !== "QualifiedValue" /* QualifiedValue */ || node.value._type === "Missing" /* Missing */) {
          return;
        }
        const info = QualifiedValueNodeSchema.get(node.qualifier.value);
        const validateValue = async (valueNode) => {
          const value = Utils.print(valueNode, queryDoc.text, (name) => project.symbols.getFirst(name)?.value).replace(/^"(.*)"$/, "$1");
          if (info?.placeholderType === "label" /* Label */) {
            work.push(this._checkLabels(value, repos).then((missing) => {
              if (missing.length === repos.length) {
                const diag = new vscode3.Diagnostic(project.rangeOf(valueNode), vscode3.l10n.t("Label '{0}' is unknown", value), vscode3.DiagnosticSeverity.Warning);
                newDiagnostics.push(diag);
              } else if (missing.length > 0) {
                const diag = new vscode3.Diagnostic(project.rangeOf(valueNode), vscode3.l10n.t("Label '{0}' is unknown in these repositories: {1}", value, missing.map((info2) => `${info2.owner}/${info2.repo}`).join(", ")), vscode3.DiagnosticSeverity.Hint);
                newDiagnostics.push(diag);
              }
            }));
          } else if (info?.placeholderType === "milestone" /* Milestone */) {
            work.push(this._checkMilestones(value, repos).then((missing) => {
              if (missing.length === repos.length) {
                const diag = new vscode3.Diagnostic(project.rangeOf(valueNode), vscode3.l10n.t("Milestone '{0}' is unknown", value), vscode3.DiagnosticSeverity.Warning);
                newDiagnostics.push(diag);
              } else if (missing.length > 0) {
                const diag = new vscode3.Diagnostic(project.rangeOf(valueNode), vscode3.l10n.t("Milestone '{0}' is unknown in these repositories: {1}", value, missing.map((info2) => `${info2.owner}/${info2.repo}`).join(", ")), vscode3.DiagnosticSeverity.Hint);
                newDiagnostics.push(diag);
              }
            }));
          } else if (info?.placeholderType === "username" /* Username */) {
            if (value === "@me") {
              work.push(this.octokit.lib().then(() => {
                if (!this.octokit.isAuthenticated) {
                  const diag = new vscode3.Diagnostic(project.rangeOf(valueNode), vscode3.l10n.t("{0} requires that you are logged in", "@me"), vscode3.DiagnosticSeverity.Warning);
                  diag.code = "GitHubLoginNeeded" /* GitHubLoginNeeded */;
                  newDiagnostics.push(diag);
                }
              }));
            }
          }
        };
        if (node.value._type === "LiteralSequence" /* LiteralSequence */) {
          node.value.nodes.forEach(validateValue);
        } else {
          validateValue(node.value);
        }
      });
      Promise.all(work).then(() => {
        if (token.isCancellationRequested) {
          return;
        }
        let collection2 = this._collections.get(project);
        if (collection2 && project.has(doc)) {
          collection2.set(doc.uri, newDiagnostics);
        }
      });
    }
  }
  async _checkLabels(label, repos) {
    let result = [];
    for (const info of repos) {
      const labels = await this.githubData.getOrFetchLabels(info);
      const found = labels.find((info2) => info2.name === label);
      if (!found) {
        result.push(info);
      }
    }
    return result;
  }
  async _checkMilestones(milestone, repos) {
    let result = [];
    for (let info of repos) {
      const labels = await this.githubData.getOrFetchMilestones(info);
      const found = labels.find((info2) => info2.title === milestone);
      if (!found) {
        result.push(info);
      }
    }
    return result;
  }
};
var Validation = class {
  constructor(container, octokit, validation) {
    this.container = container;
    this.octokit = octokit;
    this.validation = validation;
    this._disposables = [];
    let cts = new vscode3.CancellationTokenSource();
    function validateAllSoon(delay = 300) {
      cts.cancel();
      cts = new vscode3.CancellationTokenSource();
      let handle = setTimeout(() => {
        for (let project of container.all()) {
          for (let strategy of validation) {
            strategy.validateProject(project, cts.token);
          }
        }
      }, delay);
      cts.token.onCancellationRequested(() => clearTimeout(handle));
    }
    validateAllSoon();
    this._disposables.push(vscode3.workspace.onDidChangeTextDocument((e) => {
      if (vscode3.languages.match(selector, e.document)) {
        validateAllSoon(500);
      }
    }));
    this._disposables.push(vscode3.authentication.onDidChangeSessions((e) => {
      if (e.provider.id === "github") {
        validateAllSoon();
      }
    }));
    this._disposables.push(container.onDidChange(() => {
      validateAllSoon();
    }));
    this._disposables.push(container.onDidRemove((project) => {
      for (let strategy of validation) {
        strategy.clearProject(project);
      }
    }));
    this._disposables.push(octokit.onDidChange(() => {
      validateAllSoon();
    }));
  }
  dispose() {
    this._disposables.forEach((d) => d.dispose());
  }
};
function registerLanguageProvider(container, octokit) {
  const disposables = [];
  const githubData = new GithubData(octokit);
  vscode3.languages.setLanguageConfiguration(selector.language, {
    wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
    comments: { lineComment: "//" }
  });
  disposables.push(vscode3.languages.registerHoverProvider(selector, new HoverProvider(container)));
  disposables.push(vscode3.languages.registerSelectionRangeProvider(selector, new SelectionRangeProvider(container)));
  disposables.push(vscode3.languages.registerDocumentHighlightProvider(selector, new DocumentHighlightProvider(container)));
  disposables.push(vscode3.languages.registerDefinitionProvider(selector, new DefinitionProvider(container)));
  disposables.push(vscode3.languages.registerReferenceProvider(selector, new ReferenceProvider(container)));
  disposables.push(vscode3.languages.registerRenameProvider(selector, new RenameProvider(container)));
  disposables.push(vscode3.languages.registerCodeActionsProvider(selector, new QuickFixProvider(), { providedCodeActionKinds: [vscode3.CodeActionKind.QuickFix] }));
  disposables.push(vscode3.languages.registerCodeActionsProvider(selector, new ExtractVariableProvider(container), { providedCodeActionKinds: [vscode3.CodeActionKind.RefactorExtract] }));
  disposables.push(vscode3.languages.registerCodeActionsProvider({ ...selector, scheme: "vscode-notebook-cell" }, new NotebookSplitOrIntoCellProvider(container), { providedCodeActionKinds: [vscode3.CodeActionKind.Refactor] }));
  disposables.push(vscode3.languages.registerCodeActionsProvider({ ...selector, scheme: "vscode-notebook-cell" }, new NotebookExtractCellProvider(container), { providedCodeActionKinds: [vscode3.CodeActionKind.Refactor] }));
  disposables.push(vscode3.languages.registerCodeActionsProvider({ notebookType: "github-issues" }, new VariableNamesSourceAction(container), { providedCodeActionKinds: [VariableNamesSourceAction.kind] }));
  disposables.push(vscode3.languages.registerDocumentSemanticTokensProvider(selector, new DocumentSemanticTokensProvider(container), DocumentSemanticTokensProvider.legend));
  disposables.push(vscode3.languages.registerDocumentRangeFormattingEditProvider(selector, new FormattingProvider(container)));
  disposables.push(vscode3.languages.registerOnTypeFormattingEditProvider(selector, new FormattingProvider(container), "\n"));
  disposables.push(vscode3.languages.registerCompletionItemProvider(selector, new CompletionItemProvider(container), ...CompletionItemProvider.triggerCharacters));
  disposables.push(vscode3.languages.registerCompletionItemProvider(selector, new GithubOrgCompletions(container, octokit), ...GithubOrgCompletions.triggerCharacters));
  disposables.push(vscode3.languages.registerCompletionItemProvider(selector, new GithubRepoSearchCompletions(container, octokit), ...GithubRepoSearchCompletions.triggerCharacters));
  disposables.push(vscode3.languages.registerCompletionItemProvider(selector, new GithubPlaceholderCompletions(container, githubData), ...GithubPlaceholderCompletions.triggerCharacters));
  disposables.push(new Validation(container, octokit, [
    new LanguageValidation(),
    new GithubValidation(githubData, octokit)
  ]));
  return vscode3.Disposable.from(...disposables);
}

// node_modules/universal-user-agent/index.js
function getUserAgent() {
  if (typeof navigator === "object" && "userAgent" in navigator) {
    return navigator.userAgent;
  }
  if (typeof process === "object" && process.version !== void 0) {
    return `Node.js/${process.version.substr(1)} (${process.platform}; ${process.arch})`;
  }
  return "<environment undetectable>";
}

// node_modules/before-after-hook/lib/register.js
function register(state, name, method, options) {
  if (typeof method !== "function") {
    throw new Error("method for before hook must be a function");
  }
  if (!options) {
    options = {};
  }
  if (Array.isArray(name)) {
    return name.reverse().reduce((callback, name2) => {
      return register.bind(null, state, name2, callback, options);
    }, method)();
  }
  return Promise.resolve().then(() => {
    if (!state.registry[name]) {
      return method(options);
    }
    return state.registry[name].reduce((method2, registered) => {
      return registered.hook.bind(null, method2, options);
    }, method)();
  });
}

// node_modules/before-after-hook/lib/add.js
function addHook(state, kind, name, hook2) {
  const orig = hook2;
  if (!state.registry[name]) {
    state.registry[name] = [];
  }
  if (kind === "before") {
    hook2 = (method, options) => {
      return Promise.resolve().then(orig.bind(null, options)).then(method.bind(null, options));
    };
  }
  if (kind === "after") {
    hook2 = (method, options) => {
      let result;
      return Promise.resolve().then(method.bind(null, options)).then((result_) => {
        result = result_;
        return orig(result, options);
      }).then(() => {
        return result;
      });
    };
  }
  if (kind === "error") {
    hook2 = (method, options) => {
      return Promise.resolve().then(method.bind(null, options)).catch((error) => {
        return orig(error, options);
      });
    };
  }
  state.registry[name].push({
    hook: hook2,
    orig
  });
}

// node_modules/before-after-hook/lib/remove.js
function removeHook(state, name, method) {
  if (!state.registry[name]) {
    return;
  }
  const index = state.registry[name].map((registered) => {
    return registered.orig;
  }).indexOf(method);
  if (index === -1) {
    return;
  }
  state.registry[name].splice(index, 1);
}

// node_modules/before-after-hook/index.js
var bind = Function.bind;
var bindable = bind.bind(bind);
function bindApi(hook2, state, name) {
  const removeHookRef = bindable(removeHook, null).apply(
    null,
    name ? [state, name] : [state]
  );
  hook2.api = { remove: removeHookRef };
  hook2.remove = removeHookRef;
  ["before", "error", "after", "wrap"].forEach((kind) => {
    const args = name ? [state, kind, name] : [state, kind];
    hook2[kind] = hook2.api[kind] = bindable(addHook, null).apply(null, args);
  });
}
function Singular() {
  const singularHookName = Symbol("Singular");
  const singularHookState = {
    registry: {}
  };
  const singularHook = register.bind(null, singularHookState, singularHookName);
  bindApi(singularHook, singularHookState, singularHookName);
  return singularHook;
}
function Collection() {
  const state = {
    registry: {}
  };
  const hook2 = register.bind(null, state);
  bindApi(hook2, state);
  return hook2;
}
var before_after_hook_default = { Singular, Collection };

// node_modules/@octokit/endpoint/dist-bundle/index.js
var VERSION = "0.0.0-development";
var userAgent = `octokit-endpoint.js/${VERSION} ${getUserAgent()}`;
var DEFAULTS = {
  method: "GET",
  baseUrl: "https://api.github.com",
  headers: {
    accept: "application/vnd.github.v3+json",
    "user-agent": userAgent
  },
  mediaType: {
    format: ""
  }
};
function lowercaseKeys(object) {
  if (!object) {
    return {};
  }
  return Object.keys(object).reduce((newObj, key) => {
    newObj[key.toLowerCase()] = object[key];
    return newObj;
  }, {});
}
function isPlainObject(value) {
  if (typeof value !== "object" || value === null) return false;
  if (Object.prototype.toString.call(value) !== "[object Object]") return false;
  const proto = Object.getPrototypeOf(value);
  if (proto === null) return true;
  const Ctor = Object.prototype.hasOwnProperty.call(proto, "constructor") && proto.constructor;
  return typeof Ctor === "function" && Ctor instanceof Ctor && Function.prototype.call(Ctor) === Function.prototype.call(value);
}
function mergeDeep(defaults, options) {
  const result = Object.assign({}, defaults);
  Object.keys(options).forEach((key) => {
    if (isPlainObject(options[key])) {
      if (!(key in defaults)) Object.assign(result, { [key]: options[key] });
      else result[key] = mergeDeep(defaults[key], options[key]);
    } else {
      Object.assign(result, { [key]: options[key] });
    }
  });
  return result;
}
function removeUndefinedProperties(obj) {
  for (const key in obj) {
    if (obj[key] === void 0) {
      delete obj[key];
    }
  }
  return obj;
}
function merge(defaults, route, options) {
  if (typeof route === "string") {
    let [method, url] = route.split(" ");
    options = Object.assign(url ? { method, url } : { url: method }, options);
  } else {
    options = Object.assign({}, route);
  }
  options.headers = lowercaseKeys(options.headers);
  removeUndefinedProperties(options);
  removeUndefinedProperties(options.headers);
  const mergedOptions = mergeDeep(defaults || {}, options);
  if (options.url === "/graphql") {
    if (defaults && defaults.mediaType.previews?.length) {
      mergedOptions.mediaType.previews = defaults.mediaType.previews.filter(
        (preview) => !mergedOptions.mediaType.previews.includes(preview)
      ).concat(mergedOptions.mediaType.previews);
    }
    mergedOptions.mediaType.previews = (mergedOptions.mediaType.previews || []).map((preview) => preview.replace(/-preview/, ""));
  }
  return mergedOptions;
}
function addQueryParameters(url, parameters) {
  const separator = /\?/.test(url) ? "&" : "?";
  const names = Object.keys(parameters);
  if (names.length === 0) {
    return url;
  }
  return url + separator + names.map((name) => {
    if (name === "q") {
      return "q=" + parameters.q.split("+").map(encodeURIComponent).join("+");
    }
    return `${name}=${encodeURIComponent(parameters[name])}`;
  }).join("&");
}
var urlVariableRegex = /\{[^{}}]+\}/g;
function removeNonChars(variableName) {
  return variableName.replace(/(?:^\W+)|(?:(?<!\W)\W+$)/g, "").split(/,/);
}
function extractUrlVariableNames(url) {
  const matches = url.match(urlVariableRegex);
  if (!matches) {
    return [];
  }
  return matches.map(removeNonChars).reduce((a, b) => a.concat(b), []);
}
function omit(object, keysToOmit) {
  const result = { __proto__: null };
  for (const key of Object.keys(object)) {
    if (keysToOmit.indexOf(key) === -1) {
      result[key] = object[key];
    }
  }
  return result;
}
function encodeReserved(str) {
  return str.split(/(%[0-9A-Fa-f]{2})/g).map(function(part) {
    if (!/%[0-9A-Fa-f]/.test(part)) {
      part = encodeURI(part).replace(/%5B/g, "[").replace(/%5D/g, "]");
    }
    return part;
  }).join("");
}
function encodeUnreserved(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
    return "%" + c.charCodeAt(0).toString(16).toUpperCase();
  });
}
function encodeValue(operator, value, key) {
  value = operator === "+" || operator === "#" ? encodeReserved(value) : encodeUnreserved(value);
  if (key) {
    return encodeUnreserved(key) + "=" + value;
  } else {
    return value;
  }
}
function isDefined(value) {
  return value !== void 0 && value !== null;
}
function isKeyOperator(operator) {
  return operator === ";" || operator === "&" || operator === "?";
}
function getValues(context, operator, key, modifier) {
  var value = context[key], result = [];
  if (isDefined(value) && value !== "") {
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      value = value.toString();
      if (modifier && modifier !== "*") {
        value = value.substring(0, parseInt(modifier, 10));
      }
      result.push(
        encodeValue(operator, value, isKeyOperator(operator) ? key : "")
      );
    } else {
      if (modifier === "*") {
        if (Array.isArray(value)) {
          value.filter(isDefined).forEach(function(value2) {
            result.push(
              encodeValue(operator, value2, isKeyOperator(operator) ? key : "")
            );
          });
        } else {
          Object.keys(value).forEach(function(k) {
            if (isDefined(value[k])) {
              result.push(encodeValue(operator, value[k], k));
            }
          });
        }
      } else {
        const tmp = [];
        if (Array.isArray(value)) {
          value.filter(isDefined).forEach(function(value2) {
            tmp.push(encodeValue(operator, value2));
          });
        } else {
          Object.keys(value).forEach(function(k) {
            if (isDefined(value[k])) {
              tmp.push(encodeUnreserved(k));
              tmp.push(encodeValue(operator, value[k].toString()));
            }
          });
        }
        if (isKeyOperator(operator)) {
          result.push(encodeUnreserved(key) + "=" + tmp.join(","));
        } else if (tmp.length !== 0) {
          result.push(tmp.join(","));
        }
      }
    }
  } else {
    if (operator === ";") {
      if (isDefined(value)) {
        result.push(encodeUnreserved(key));
      }
    } else if (value === "" && (operator === "&" || operator === "?")) {
      result.push(encodeUnreserved(key) + "=");
    } else if (value === "") {
      result.push("");
    }
  }
  return result;
}
function parseUrl(template) {
  return {
    expand: expand.bind(null, template)
  };
}
function expand(template, context) {
  var operators = ["+", "#", ".", "/", ";", "?", "&"];
  template = template.replace(
    /\{([^\{\}]+)\}|([^\{\}]+)/g,
    function(_, expression, literal) {
      if (expression) {
        let operator = "";
        const values = [];
        if (operators.indexOf(expression.charAt(0)) !== -1) {
          operator = expression.charAt(0);
          expression = expression.substr(1);
        }
        expression.split(/,/g).forEach(function(variable) {
          var tmp = /([^:\*]*)(?::(\d+)|(\*))?/.exec(variable);
          values.push(getValues(context, operator, tmp[1], tmp[2] || tmp[3]));
        });
        if (operator && operator !== "+") {
          var separator = ",";
          if (operator === "?") {
            separator = "&";
          } else if (operator !== "#") {
            separator = operator;
          }
          return (values.length !== 0 ? operator : "") + values.join(separator);
        } else {
          return values.join(",");
        }
      } else {
        return encodeReserved(literal);
      }
    }
  );
  if (template === "/") {
    return template;
  } else {
    return template.replace(/\/$/, "");
  }
}
function parse(options) {
  let method = options.method.toUpperCase();
  let url = (options.url || "/").replace(/:([a-z]\w+)/g, "{$1}");
  let headers = Object.assign({}, options.headers);
  let body;
  let parameters = omit(options, [
    "method",
    "baseUrl",
    "url",
    "headers",
    "request",
    "mediaType"
  ]);
  const urlVariableNames = extractUrlVariableNames(url);
  url = parseUrl(url).expand(parameters);
  if (!/^http/.test(url)) {
    url = options.baseUrl + url;
  }
  const omittedParameters = Object.keys(options).filter((option) => urlVariableNames.includes(option)).concat("baseUrl");
  const remainingParameters = omit(parameters, omittedParameters);
  const isBinaryRequest = /application\/octet-stream/i.test(headers.accept);
  if (!isBinaryRequest) {
    if (options.mediaType.format) {
      headers.accept = headers.accept.split(/,/).map(
        (format) => format.replace(
          /application\/vnd(\.\w+)(\.v3)?(\.\w+)?(\+json)?$/,
          `application/vnd$1$2.${options.mediaType.format}`
        )
      ).join(",");
    }
    if (url.endsWith("/graphql")) {
      if (options.mediaType.previews?.length) {
        const previewsFromAcceptHeader = headers.accept.match(/(?<![\w-])[\w-]+(?=-preview)/g) || [];
        headers.accept = previewsFromAcceptHeader.concat(options.mediaType.previews).map((preview) => {
          const format = options.mediaType.format ? `.${options.mediaType.format}` : "+json";
          return `application/vnd.github.${preview}-preview${format}`;
        }).join(",");
      }
    }
  }
  if (["GET", "HEAD"].includes(method)) {
    url = addQueryParameters(url, remainingParameters);
  } else {
    if ("data" in remainingParameters) {
      body = remainingParameters.data;
    } else {
      if (Object.keys(remainingParameters).length) {
        body = remainingParameters;
      }
    }
  }
  if (!headers["content-type"] && typeof body !== "undefined") {
    headers["content-type"] = "application/json; charset=utf-8";
  }
  if (["PATCH", "PUT"].includes(method) && typeof body === "undefined") {
    body = "";
  }
  return Object.assign(
    { method, url, headers },
    typeof body !== "undefined" ? { body } : null,
    options.request ? { request: options.request } : null
  );
}
function endpointWithDefaults(defaults, route, options) {
  return parse(merge(defaults, route, options));
}
function withDefaults(oldDefaults, newDefaults) {
  const DEFAULTS2 = merge(oldDefaults, newDefaults);
  const endpoint2 = endpointWithDefaults.bind(null, DEFAULTS2);
  return Object.assign(endpoint2, {
    DEFAULTS: DEFAULTS2,
    defaults: withDefaults.bind(null, DEFAULTS2),
    merge: merge.bind(null, DEFAULTS2),
    parse
  });
}
var endpoint = withDefaults(null, DEFAULTS);

// node_modules/@octokit/request/dist-bundle/index.js
var import_fast_content_type_parse = __toESM(require_fast_content_type_parse(), 1);

// node_modules/@octokit/request-error/dist-src/index.js
var RequestError = class extends Error {
  constructor(message, statusCode, options) {
    super(message);
    __publicField(this, "name");
    /**
     * http status code
     */
    __publicField(this, "status");
    /**
     * Request options that lead to the error.
     */
    __publicField(this, "request");
    /**
     * Response object if a response was received
     */
    __publicField(this, "response");
    this.name = "HttpError";
    this.status = Number.parseInt(statusCode);
    if (Number.isNaN(this.status)) {
      this.status = 0;
    }
    if ("response" in options) {
      this.response = options.response;
    }
    const requestCopy = Object.assign({}, options.request);
    if (options.request.headers.authorization) {
      requestCopy.headers = Object.assign({}, options.request.headers, {
        authorization: options.request.headers.authorization.replace(
          /(?<! ) .*$/,
          " [REDACTED]"
        )
      });
    }
    requestCopy.url = requestCopy.url.replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]").replace(/\baccess_token=\w+/g, "access_token=[REDACTED]");
    this.request = requestCopy;
  }
};

// node_modules/@octokit/request/dist-bundle/index.js
var VERSION2 = "0.0.0-development";
var defaults_default = {
  headers: {
    "user-agent": `octokit-request.js/${VERSION2} ${getUserAgent()}`
  }
};
function isPlainObject2(value) {
  if (typeof value !== "object" || value === null) return false;
  if (Object.prototype.toString.call(value) !== "[object Object]") return false;
  const proto = Object.getPrototypeOf(value);
  if (proto === null) return true;
  const Ctor = Object.prototype.hasOwnProperty.call(proto, "constructor") && proto.constructor;
  return typeof Ctor === "function" && Ctor instanceof Ctor && Function.prototype.call(Ctor) === Function.prototype.call(value);
}
async function fetchWrapper(requestOptions) {
  const fetch = requestOptions.request?.fetch || globalThis.fetch;
  if (!fetch) {
    throw new Error(
      "fetch is not set. Please pass a fetch implementation as new Octokit({ request: { fetch }}). Learn more at https://github.com/octokit/octokit.js/#fetch-missing"
    );
  }
  const log = requestOptions.request?.log || console;
  const parseSuccessResponseBody = requestOptions.request?.parseSuccessResponseBody !== false;
  const body = isPlainObject2(requestOptions.body) || Array.isArray(requestOptions.body) ? JSON.stringify(requestOptions.body) : requestOptions.body;
  const requestHeaders = Object.fromEntries(
    Object.entries(requestOptions.headers).map(([name, value]) => [
      name,
      String(value)
    ])
  );
  let fetchResponse;
  try {
    fetchResponse = await fetch(requestOptions.url, {
      method: requestOptions.method,
      body,
      redirect: requestOptions.request?.redirect,
      headers: requestHeaders,
      signal: requestOptions.request?.signal,
      // duplex must be set if request.body is ReadableStream or Async Iterables.
      // See https://fetch.spec.whatwg.org/#dom-requestinit-duplex.
      ...requestOptions.body && { duplex: "half" }
    });
  } catch (error) {
    let message = "Unknown Error";
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        error.status = 500;
        throw error;
      }
      message = error.message;
      if (error.name === "TypeError" && "cause" in error) {
        if (error.cause instanceof Error) {
          message = error.cause.message;
        } else if (typeof error.cause === "string") {
          message = error.cause;
        }
      }
    }
    const requestError = new RequestError(message, 500, {
      request: requestOptions
    });
    requestError.cause = error;
    throw requestError;
  }
  const status = fetchResponse.status;
  const url = fetchResponse.url;
  const responseHeaders = {};
  for (const [key, value] of fetchResponse.headers) {
    responseHeaders[key] = value;
  }
  const octokitResponse = {
    url,
    status,
    headers: responseHeaders,
    data: ""
  };
  if ("deprecation" in responseHeaders) {
    const matches = responseHeaders.link && responseHeaders.link.match(/<([^<>]+)>; rel="deprecation"/);
    const deprecationLink = matches && matches.pop();
    log.warn(
      `[@octokit/request] "${requestOptions.method} ${requestOptions.url}" is deprecated. It is scheduled to be removed on ${responseHeaders.sunset}${deprecationLink ? `. See ${deprecationLink}` : ""}`
    );
  }
  if (status === 204 || status === 205) {
    return octokitResponse;
  }
  if (requestOptions.method === "HEAD") {
    if (status < 400) {
      return octokitResponse;
    }
    throw new RequestError(fetchResponse.statusText, status, {
      response: octokitResponse,
      request: requestOptions
    });
  }
  if (status === 304) {
    octokitResponse.data = await getResponseData(fetchResponse);
    throw new RequestError("Not modified", status, {
      response: octokitResponse,
      request: requestOptions
    });
  }
  if (status >= 400) {
    octokitResponse.data = await getResponseData(fetchResponse);
    throw new RequestError(toErrorMessage(octokitResponse.data), status, {
      response: octokitResponse,
      request: requestOptions
    });
  }
  octokitResponse.data = parseSuccessResponseBody ? await getResponseData(fetchResponse) : fetchResponse.body;
  return octokitResponse;
}
async function getResponseData(response) {
  const contentType = response.headers.get("content-type");
  if (!contentType) {
    return response.text().catch(() => "");
  }
  const mimetype = (0, import_fast_content_type_parse.safeParse)(contentType);
  if (isJSONResponse(mimetype)) {
    let text = "";
    try {
      text = await response.text();
      return JSON.parse(text);
    } catch (err) {
      return text;
    }
  } else if (mimetype.type.startsWith("text/") || mimetype.parameters.charset?.toLowerCase() === "utf-8") {
    return response.text().catch(() => "");
  } else {
    return response.arrayBuffer().catch(() => new ArrayBuffer(0));
  }
}
function isJSONResponse(mimetype) {
  return mimetype.type === "application/json" || mimetype.type === "application/scim+json";
}
function toErrorMessage(data) {
  if (typeof data === "string") {
    return data;
  }
  if (data instanceof ArrayBuffer) {
    return "Unknown error";
  }
  if ("message" in data) {
    const suffix = "documentation_url" in data ? ` - ${data.documentation_url}` : "";
    return Array.isArray(data.errors) ? `${data.message}: ${data.errors.map((v) => JSON.stringify(v)).join(", ")}${suffix}` : `${data.message}${suffix}`;
  }
  return `Unknown error: ${JSON.stringify(data)}`;
}
function withDefaults2(oldEndpoint, newDefaults) {
  const endpoint2 = oldEndpoint.defaults(newDefaults);
  const newApi = function(route, parameters) {
    const endpointOptions = endpoint2.merge(route, parameters);
    if (!endpointOptions.request || !endpointOptions.request.hook) {
      return fetchWrapper(endpoint2.parse(endpointOptions));
    }
    const request2 = (route2, parameters2) => {
      return fetchWrapper(
        endpoint2.parse(endpoint2.merge(route2, parameters2))
      );
    };
    Object.assign(request2, {
      endpoint: endpoint2,
      defaults: withDefaults2.bind(null, endpoint2)
    });
    return endpointOptions.request.hook(request2, endpointOptions);
  };
  return Object.assign(newApi, {
    endpoint: endpoint2,
    defaults: withDefaults2.bind(null, endpoint2)
  });
}
var request = withDefaults2(endpoint, defaults_default);

// node_modules/@octokit/graphql/dist-bundle/index.js
var VERSION3 = "0.0.0-development";
function _buildMessageForResponseErrors(data) {
  return `Request failed due to following response errors:
` + data.errors.map((e) => ` - ${e.message}`).join("\n");
}
var GraphqlResponseError = class extends Error {
  constructor(request2, headers, response) {
    super(_buildMessageForResponseErrors(response));
    __publicField(this, "name", "GraphqlResponseError");
    __publicField(this, "errors");
    __publicField(this, "data");
    this.request = request2;
    this.headers = headers;
    this.response = response;
    this.errors = response.errors;
    this.data = response.data;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};
var NON_VARIABLE_OPTIONS = [
  "method",
  "baseUrl",
  "url",
  "headers",
  "request",
  "query",
  "mediaType",
  "operationName"
];
var FORBIDDEN_VARIABLE_OPTIONS = ["query", "method", "url"];
var GHES_V3_SUFFIX_REGEX = /\/api\/v3\/?$/;
function graphql(request2, query, options) {
  if (options) {
    if (typeof query === "string" && "query" in options) {
      return Promise.reject(
        new Error(`[@octokit/graphql] "query" cannot be used as variable name`)
      );
    }
    for (const key in options) {
      if (!FORBIDDEN_VARIABLE_OPTIONS.includes(key)) continue;
      return Promise.reject(
        new Error(
          `[@octokit/graphql] "${key}" cannot be used as variable name`
        )
      );
    }
  }
  const parsedOptions = typeof query === "string" ? Object.assign({ query }, options) : query;
  const requestOptions = Object.keys(
    parsedOptions
  ).reduce((result, key) => {
    if (NON_VARIABLE_OPTIONS.includes(key)) {
      result[key] = parsedOptions[key];
      return result;
    }
    if (!result.variables) {
      result.variables = {};
    }
    result.variables[key] = parsedOptions[key];
    return result;
  }, {});
  const baseUrl = parsedOptions.baseUrl || request2.endpoint.DEFAULTS.baseUrl;
  if (GHES_V3_SUFFIX_REGEX.test(baseUrl)) {
    requestOptions.url = baseUrl.replace(GHES_V3_SUFFIX_REGEX, "/api/graphql");
  }
  return request2(requestOptions).then((response) => {
    if (response.data.errors) {
      const headers = {};
      for (const key of Object.keys(response.headers)) {
        headers[key] = response.headers[key];
      }
      throw new GraphqlResponseError(
        requestOptions,
        headers,
        response.data
      );
    }
    return response.data.data;
  });
}
function withDefaults3(request2, newDefaults) {
  const newRequest = request2.defaults(newDefaults);
  const newApi = (query, options) => {
    return graphql(newRequest, query, options);
  };
  return Object.assign(newApi, {
    defaults: withDefaults3.bind(null, newRequest),
    endpoint: newRequest.endpoint
  });
}
var graphql2 = withDefaults3(request, {
  headers: {
    "user-agent": `octokit-graphql.js/${VERSION3} ${getUserAgent()}`
  },
  method: "POST",
  url: "/graphql"
});
function withCustomRequest(customRequest) {
  return withDefaults3(customRequest, {
    method: "POST",
    url: "/graphql"
  });
}

// node_modules/@octokit/auth-token/dist-bundle/index.js
var b64url = "(?:[a-zA-Z0-9_-]+)";
var sep = "\\.";
var jwtRE = new RegExp(`^${b64url}${sep}${b64url}${sep}${b64url}$`);
var isJWT = jwtRE.test.bind(jwtRE);
async function auth(token) {
  const isApp = isJWT(token);
  const isInstallation = token.startsWith("v1.") || token.startsWith("ghs_");
  const isUserToServer = token.startsWith("ghu_");
  const tokenType = isApp ? "app" : isInstallation ? "installation" : isUserToServer ? "user-to-server" : "oauth";
  return {
    type: "token",
    token,
    tokenType
  };
}
function withAuthorizationPrefix(token) {
  if (token.split(/\./).length === 3) {
    return `bearer ${token}`;
  }
  return `token ${token}`;
}
async function hook(token, request2, route, parameters) {
  const endpoint2 = request2.endpoint.merge(
    route,
    parameters
  );
  endpoint2.headers.authorization = withAuthorizationPrefix(token);
  return request2(endpoint2);
}
var createTokenAuth = function createTokenAuth2(token) {
  if (!token) {
    throw new Error("[@octokit/auth-token] No token passed to createTokenAuth");
  }
  if (typeof token !== "string") {
    throw new Error(
      "[@octokit/auth-token] Token passed to createTokenAuth is not a string"
    );
  }
  token = token.replace(/^(token|bearer) +/i, "");
  return Object.assign(auth.bind(null, token), {
    hook: hook.bind(null, token)
  });
};

// node_modules/@octokit/core/dist-src/version.js
var VERSION4 = "6.1.5";

// node_modules/@octokit/core/dist-src/index.js
var noop = () => {
};
var consoleWarn = console.warn.bind(console);
var consoleError = console.error.bind(console);
var userAgentTrail = `octokit-core.js/${VERSION4} ${getUserAgent()}`;
var Octokit = class {
  constructor(options = {}) {
    // assigned during constructor
    __publicField(this, "request");
    __publicField(this, "graphql");
    __publicField(this, "log");
    __publicField(this, "hook");
    // TODO: type `octokit.auth` based on passed options.authStrategy
    __publicField(this, "auth");
    const hook2 = new before_after_hook_default.Collection();
    const requestDefaults = {
      baseUrl: request.endpoint.DEFAULTS.baseUrl,
      headers: {},
      request: Object.assign({}, options.request, {
        // @ts-ignore internal usage only, no need to type
        hook: hook2.bind(null, "request")
      }),
      mediaType: {
        previews: [],
        format: ""
      }
    };
    requestDefaults.headers["user-agent"] = options.userAgent ? `${options.userAgent} ${userAgentTrail}` : userAgentTrail;
    if (options.baseUrl) {
      requestDefaults.baseUrl = options.baseUrl;
    }
    if (options.previews) {
      requestDefaults.mediaType.previews = options.previews;
    }
    if (options.timeZone) {
      requestDefaults.headers["time-zone"] = options.timeZone;
    }
    this.request = request.defaults(requestDefaults);
    this.graphql = withCustomRequest(this.request).defaults(requestDefaults);
    this.log = Object.assign(
      {
        debug: noop,
        info: noop,
        warn: consoleWarn,
        error: consoleError
      },
      options.log
    );
    this.hook = hook2;
    if (!options.authStrategy) {
      if (!options.auth) {
        this.auth = async () => ({
          type: "unauthenticated"
        });
      } else {
        const auth2 = createTokenAuth(options.auth);
        hook2.wrap("request", auth2.hook);
        this.auth = auth2;
      }
    } else {
      const { authStrategy, ...otherOptions } = options;
      const auth2 = authStrategy(
        Object.assign(
          {
            request: this.request,
            log: this.log,
            // we pass the current octokit instance as well as its constructor options
            // to allow for authentication strategies that return a new octokit instance
            // that shares the same internal state as the current one. The original
            // requirement for this was the "event-octokit" authentication strategy
            // of https://github.com/probot/octokit-auth-probot.
            octokit: this,
            octokitOptions: otherOptions
          },
          options.auth
        )
      );
      hook2.wrap("request", auth2.hook);
      this.auth = auth2;
    }
    const classConstructor = this.constructor;
    for (let i = 0; i < classConstructor.plugins.length; ++i) {
      Object.assign(this, classConstructor.plugins[i](this, options));
    }
  }
  static defaults(defaults) {
    const OctokitWithDefaults = class extends this {
      constructor(...args) {
        const options = args[0] || {};
        if (typeof defaults === "function") {
          super(defaults(options));
          return;
        }
        super(
          Object.assign(
            {},
            defaults,
            options,
            options.userAgent && defaults.userAgent ? {
              userAgent: `${options.userAgent} ${defaults.userAgent}`
            } : null
          )
        );
      }
    };
    return OctokitWithDefaults;
  }
  /**
   * Attach a plugin (or many) to your Octokit instance.
   *
   * @example
   * const API = Octokit.plugin(plugin1, plugin2, plugin3, ...)
   */
  static plugin(...newPlugins) {
    var _a;
    const currentPlugins = this.plugins;
    const NewOctokit = (_a = class extends this {
    }, __publicField(_a, "plugins", currentPlugins.concat(
      newPlugins.filter((plugin) => !currentPlugins.includes(plugin))
    )), _a);
    return NewOctokit;
  }
};
__publicField(Octokit, "VERSION", VERSION4);
__publicField(Octokit, "plugins", []);

// node_modules/@octokit/plugin-request-log/dist-src/version.js
var VERSION5 = "5.3.1";

// node_modules/@octokit/plugin-request-log/dist-src/index.js
function requestLog(octokit) {
  octokit.hook.wrap("request", (request2, options) => {
    octokit.log.debug("request", options);
    const start = Date.now();
    const requestOptions = octokit.request.endpoint.parse(options);
    const path = requestOptions.url.replace(options.baseUrl, "");
    return request2(options).then((response) => {
      const requestId = response.headers["x-github-request-id"];
      octokit.log.info(
        `${requestOptions.method} ${path} - ${response.status} with id ${requestId} in ${Date.now() - start}ms`
      );
      return response;
    }).catch((error) => {
      const requestId = error.response?.headers["x-github-request-id"] || "UNKNOWN";
      octokit.log.error(
        `${requestOptions.method} ${path} - ${error.status} with id ${requestId} in ${Date.now() - start}ms`
      );
      throw error;
    });
  });
}
requestLog.VERSION = VERSION5;

// node_modules/@octokit/plugin-paginate-rest/dist-bundle/index.js
var VERSION6 = "0.0.0-development";
function normalizePaginatedListResponse(response) {
  if (!response.data) {
    return {
      ...response,
      data: []
    };
  }
  const responseNeedsNormalization = "total_count" in response.data && !("url" in response.data);
  if (!responseNeedsNormalization) return response;
  const incompleteResults = response.data.incomplete_results;
  const repositorySelection = response.data.repository_selection;
  const totalCount = response.data.total_count;
  delete response.data.incomplete_results;
  delete response.data.repository_selection;
  delete response.data.total_count;
  const namespaceKey = Object.keys(response.data)[0];
  const data = response.data[namespaceKey];
  response.data = data;
  if (typeof incompleteResults !== "undefined") {
    response.data.incomplete_results = incompleteResults;
  }
  if (typeof repositorySelection !== "undefined") {
    response.data.repository_selection = repositorySelection;
  }
  response.data.total_count = totalCount;
  return response;
}
function iterator(octokit, route, parameters) {
  const options = typeof route === "function" ? route.endpoint(parameters) : octokit.request.endpoint(route, parameters);
  const requestMethod = typeof route === "function" ? route : octokit.request;
  const method = options.method;
  const headers = options.headers;
  let url = options.url;
  return {
    [Symbol.asyncIterator]: () => ({
      async next() {
        if (!url) return { done: true };
        try {
          const response = await requestMethod({ method, url, headers });
          const normalizedResponse = normalizePaginatedListResponse(response);
          url = ((normalizedResponse.headers.link || "").match(
            /<([^<>]+)>;\s*rel="next"/
          ) || [])[1];
          return { value: normalizedResponse };
        } catch (error) {
          if (error.status !== 409) throw error;
          url = "";
          return {
            value: {
              status: 200,
              headers: {},
              data: []
            }
          };
        }
      }
    })
  };
}
function paginate(octokit, route, parameters, mapFn) {
  if (typeof parameters === "function") {
    mapFn = parameters;
    parameters = void 0;
  }
  return gather(
    octokit,
    [],
    iterator(octokit, route, parameters)[Symbol.asyncIterator](),
    mapFn
  );
}
function gather(octokit, results, iterator2, mapFn) {
  return iterator2.next().then((result) => {
    if (result.done) {
      return results;
    }
    let earlyExit = false;
    function done() {
      earlyExit = true;
    }
    results = results.concat(
      mapFn ? mapFn(result.value, done) : result.value.data
    );
    if (earlyExit) {
      return results;
    }
    return gather(octokit, results, iterator2, mapFn);
  });
}
var composePaginateRest = Object.assign(paginate, {
  iterator
});
function paginateRest(octokit) {
  return {
    paginate: Object.assign(paginate.bind(null, octokit), {
      iterator: iterator.bind(null, octokit)
    })
  };
}
paginateRest.VERSION = VERSION6;

// node_modules/@octokit/plugin-rest-endpoint-methods/dist-src/version.js
var VERSION7 = "13.5.0";

// node_modules/@octokit/plugin-rest-endpoint-methods/dist-src/generated/endpoints.js
var Endpoints = {
  actions: {
    addCustomLabelsToSelfHostedRunnerForOrg: [
      "POST /orgs/{org}/actions/runners/{runner_id}/labels"
    ],
    addCustomLabelsToSelfHostedRunnerForRepo: [
      "POST /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"
    ],
    addRepoAccessToSelfHostedRunnerGroupInOrg: [
      "PUT /orgs/{org}/actions/runner-groups/{runner_group_id}/repositories/{repository_id}"
    ],
    addSelectedRepoToOrgSecret: [
      "PUT /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}"
    ],
    addSelectedRepoToOrgVariable: [
      "PUT /orgs/{org}/actions/variables/{name}/repositories/{repository_id}"
    ],
    approveWorkflowRun: [
      "POST /repos/{owner}/{repo}/actions/runs/{run_id}/approve"
    ],
    cancelWorkflowRun: [
      "POST /repos/{owner}/{repo}/actions/runs/{run_id}/cancel"
    ],
    createEnvironmentVariable: [
      "POST /repos/{owner}/{repo}/environments/{environment_name}/variables"
    ],
    createHostedRunnerForOrg: ["POST /orgs/{org}/actions/hosted-runners"],
    createOrUpdateEnvironmentSecret: [
      "PUT /repos/{owner}/{repo}/environments/{environment_name}/secrets/{secret_name}"
    ],
    createOrUpdateOrgSecret: ["PUT /orgs/{org}/actions/secrets/{secret_name}"],
    createOrUpdateRepoSecret: [
      "PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}"
    ],
    createOrgVariable: ["POST /orgs/{org}/actions/variables"],
    createRegistrationTokenForOrg: [
      "POST /orgs/{org}/actions/runners/registration-token"
    ],
    createRegistrationTokenForRepo: [
      "POST /repos/{owner}/{repo}/actions/runners/registration-token"
    ],
    createRemoveTokenForOrg: ["POST /orgs/{org}/actions/runners/remove-token"],
    createRemoveTokenForRepo: [
      "POST /repos/{owner}/{repo}/actions/runners/remove-token"
    ],
    createRepoVariable: ["POST /repos/{owner}/{repo}/actions/variables"],
    createWorkflowDispatch: [
      "POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches"
    ],
    deleteActionsCacheById: [
      "DELETE /repos/{owner}/{repo}/actions/caches/{cache_id}"
    ],
    deleteActionsCacheByKey: [
      "DELETE /repos/{owner}/{repo}/actions/caches{?key,ref}"
    ],
    deleteArtifact: [
      "DELETE /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"
    ],
    deleteEnvironmentSecret: [
      "DELETE /repos/{owner}/{repo}/environments/{environment_name}/secrets/{secret_name}"
    ],
    deleteEnvironmentVariable: [
      "DELETE /repos/{owner}/{repo}/environments/{environment_name}/variables/{name}"
    ],
    deleteHostedRunnerForOrg: [
      "DELETE /orgs/{org}/actions/hosted-runners/{hosted_runner_id}"
    ],
    deleteOrgSecret: ["DELETE /orgs/{org}/actions/secrets/{secret_name}"],
    deleteOrgVariable: ["DELETE /orgs/{org}/actions/variables/{name}"],
    deleteRepoSecret: [
      "DELETE /repos/{owner}/{repo}/actions/secrets/{secret_name}"
    ],
    deleteRepoVariable: [
      "DELETE /repos/{owner}/{repo}/actions/variables/{name}"
    ],
    deleteSelfHostedRunnerFromOrg: [
      "DELETE /orgs/{org}/actions/runners/{runner_id}"
    ],
    deleteSelfHostedRunnerFromRepo: [
      "DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}"
    ],
    deleteWorkflowRun: ["DELETE /repos/{owner}/{repo}/actions/runs/{run_id}"],
    deleteWorkflowRunLogs: [
      "DELETE /repos/{owner}/{repo}/actions/runs/{run_id}/logs"
    ],
    disableSelectedRepositoryGithubActionsOrganization: [
      "DELETE /orgs/{org}/actions/permissions/repositories/{repository_id}"
    ],
    disableWorkflow: [
      "PUT /repos/{owner}/{repo}/actions/workflows/{workflow_id}/disable"
    ],
    downloadArtifact: [
      "GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}/{archive_format}"
    ],
    downloadJobLogsForWorkflowRun: [
      "GET /repos/{owner}/{repo}/actions/jobs/{job_id}/logs"
    ],
    downloadWorkflowRunAttemptLogs: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}/logs"
    ],
    downloadWorkflowRunLogs: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/logs"
    ],
    enableSelectedRepositoryGithubActionsOrganization: [
      "PUT /orgs/{org}/actions/permissions/repositories/{repository_id}"
    ],
    enableWorkflow: [
      "PUT /repos/{owner}/{repo}/actions/workflows/{workflow_id}/enable"
    ],
    forceCancelWorkflowRun: [
      "POST /repos/{owner}/{repo}/actions/runs/{run_id}/force-cancel"
    ],
    generateRunnerJitconfigForOrg: [
      "POST /orgs/{org}/actions/runners/generate-jitconfig"
    ],
    generateRunnerJitconfigForRepo: [
      "POST /repos/{owner}/{repo}/actions/runners/generate-jitconfig"
    ],
    getActionsCacheList: ["GET /repos/{owner}/{repo}/actions/caches"],
    getActionsCacheUsage: ["GET /repos/{owner}/{repo}/actions/cache/usage"],
    getActionsCacheUsageByRepoForOrg: [
      "GET /orgs/{org}/actions/cache/usage-by-repository"
    ],
    getActionsCacheUsageForOrg: ["GET /orgs/{org}/actions/cache/usage"],
    getAllowedActionsOrganization: [
      "GET /orgs/{org}/actions/permissions/selected-actions"
    ],
    getAllowedActionsRepository: [
      "GET /repos/{owner}/{repo}/actions/permissions/selected-actions"
    ],
    getArtifact: ["GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"],
    getCustomOidcSubClaimForRepo: [
      "GET /repos/{owner}/{repo}/actions/oidc/customization/sub"
    ],
    getEnvironmentPublicKey: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/secrets/public-key"
    ],
    getEnvironmentSecret: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/secrets/{secret_name}"
    ],
    getEnvironmentVariable: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/variables/{name}"
    ],
    getGithubActionsDefaultWorkflowPermissionsOrganization: [
      "GET /orgs/{org}/actions/permissions/workflow"
    ],
    getGithubActionsDefaultWorkflowPermissionsRepository: [
      "GET /repos/{owner}/{repo}/actions/permissions/workflow"
    ],
    getGithubActionsPermissionsOrganization: [
      "GET /orgs/{org}/actions/permissions"
    ],
    getGithubActionsPermissionsRepository: [
      "GET /repos/{owner}/{repo}/actions/permissions"
    ],
    getHostedRunnerForOrg: [
      "GET /orgs/{org}/actions/hosted-runners/{hosted_runner_id}"
    ],
    getHostedRunnersGithubOwnedImagesForOrg: [
      "GET /orgs/{org}/actions/hosted-runners/images/github-owned"
    ],
    getHostedRunnersLimitsForOrg: [
      "GET /orgs/{org}/actions/hosted-runners/limits"
    ],
    getHostedRunnersMachineSpecsForOrg: [
      "GET /orgs/{org}/actions/hosted-runners/machine-sizes"
    ],
    getHostedRunnersPartnerImagesForOrg: [
      "GET /orgs/{org}/actions/hosted-runners/images/partner"
    ],
    getHostedRunnersPlatformsForOrg: [
      "GET /orgs/{org}/actions/hosted-runners/platforms"
    ],
    getJobForWorkflowRun: ["GET /repos/{owner}/{repo}/actions/jobs/{job_id}"],
    getOrgPublicKey: ["GET /orgs/{org}/actions/secrets/public-key"],
    getOrgSecret: ["GET /orgs/{org}/actions/secrets/{secret_name}"],
    getOrgVariable: ["GET /orgs/{org}/actions/variables/{name}"],
    getPendingDeploymentsForRun: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/pending_deployments"
    ],
    getRepoPermissions: [
      "GET /repos/{owner}/{repo}/actions/permissions",
      {},
      { renamed: ["actions", "getGithubActionsPermissionsRepository"] }
    ],
    getRepoPublicKey: ["GET /repos/{owner}/{repo}/actions/secrets/public-key"],
    getRepoSecret: ["GET /repos/{owner}/{repo}/actions/secrets/{secret_name}"],
    getRepoVariable: ["GET /repos/{owner}/{repo}/actions/variables/{name}"],
    getReviewsForRun: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/approvals"
    ],
    getSelfHostedRunnerForOrg: ["GET /orgs/{org}/actions/runners/{runner_id}"],
    getSelfHostedRunnerForRepo: [
      "GET /repos/{owner}/{repo}/actions/runners/{runner_id}"
    ],
    getWorkflow: ["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}"],
    getWorkflowAccessToRepository: [
      "GET /repos/{owner}/{repo}/actions/permissions/access"
    ],
    getWorkflowRun: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}"],
    getWorkflowRunAttempt: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}"
    ],
    getWorkflowRunUsage: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/timing"
    ],
    getWorkflowUsage: [
      "GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/timing"
    ],
    listArtifactsForRepo: ["GET /repos/{owner}/{repo}/actions/artifacts"],
    listEnvironmentSecrets: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/secrets"
    ],
    listEnvironmentVariables: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/variables"
    ],
    listGithubHostedRunnersInGroupForOrg: [
      "GET /orgs/{org}/actions/runner-groups/{runner_group_id}/hosted-runners"
    ],
    listHostedRunnersForOrg: ["GET /orgs/{org}/actions/hosted-runners"],
    listJobsForWorkflowRun: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs"
    ],
    listJobsForWorkflowRunAttempt: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}/jobs"
    ],
    listLabelsForSelfHostedRunnerForOrg: [
      "GET /orgs/{org}/actions/runners/{runner_id}/labels"
    ],
    listLabelsForSelfHostedRunnerForRepo: [
      "GET /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"
    ],
    listOrgSecrets: ["GET /orgs/{org}/actions/secrets"],
    listOrgVariables: ["GET /orgs/{org}/actions/variables"],
    listRepoOrganizationSecrets: [
      "GET /repos/{owner}/{repo}/actions/organization-secrets"
    ],
    listRepoOrganizationVariables: [
      "GET /repos/{owner}/{repo}/actions/organization-variables"
    ],
    listRepoSecrets: ["GET /repos/{owner}/{repo}/actions/secrets"],
    listRepoVariables: ["GET /repos/{owner}/{repo}/actions/variables"],
    listRepoWorkflows: ["GET /repos/{owner}/{repo}/actions/workflows"],
    listRunnerApplicationsForOrg: ["GET /orgs/{org}/actions/runners/downloads"],
    listRunnerApplicationsForRepo: [
      "GET /repos/{owner}/{repo}/actions/runners/downloads"
    ],
    listSelectedReposForOrgSecret: [
      "GET /orgs/{org}/actions/secrets/{secret_name}/repositories"
    ],
    listSelectedReposForOrgVariable: [
      "GET /orgs/{org}/actions/variables/{name}/repositories"
    ],
    listSelectedRepositoriesEnabledGithubActionsOrganization: [
      "GET /orgs/{org}/actions/permissions/repositories"
    ],
    listSelfHostedRunnersForOrg: ["GET /orgs/{org}/actions/runners"],
    listSelfHostedRunnersForRepo: ["GET /repos/{owner}/{repo}/actions/runners"],
    listWorkflowRunArtifacts: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts"
    ],
    listWorkflowRuns: [
      "GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs"
    ],
    listWorkflowRunsForRepo: ["GET /repos/{owner}/{repo}/actions/runs"],
    reRunJobForWorkflowRun: [
      "POST /repos/{owner}/{repo}/actions/jobs/{job_id}/rerun"
    ],
    reRunWorkflow: ["POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun"],
    reRunWorkflowFailedJobs: [
      "POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun-failed-jobs"
    ],
    removeAllCustomLabelsFromSelfHostedRunnerForOrg: [
      "DELETE /orgs/{org}/actions/runners/{runner_id}/labels"
    ],
    removeAllCustomLabelsFromSelfHostedRunnerForRepo: [
      "DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"
    ],
    removeCustomLabelFromSelfHostedRunnerForOrg: [
      "DELETE /orgs/{org}/actions/runners/{runner_id}/labels/{name}"
    ],
    removeCustomLabelFromSelfHostedRunnerForRepo: [
      "DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}/labels/{name}"
    ],
    removeSelectedRepoFromOrgSecret: [
      "DELETE /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}"
    ],
    removeSelectedRepoFromOrgVariable: [
      "DELETE /orgs/{org}/actions/variables/{name}/repositories/{repository_id}"
    ],
    reviewCustomGatesForRun: [
      "POST /repos/{owner}/{repo}/actions/runs/{run_id}/deployment_protection_rule"
    ],
    reviewPendingDeploymentsForRun: [
      "POST /repos/{owner}/{repo}/actions/runs/{run_id}/pending_deployments"
    ],
    setAllowedActionsOrganization: [
      "PUT /orgs/{org}/actions/permissions/selected-actions"
    ],
    setAllowedActionsRepository: [
      "PUT /repos/{owner}/{repo}/actions/permissions/selected-actions"
    ],
    setCustomLabelsForSelfHostedRunnerForOrg: [
      "PUT /orgs/{org}/actions/runners/{runner_id}/labels"
    ],
    setCustomLabelsForSelfHostedRunnerForRepo: [
      "PUT /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"
    ],
    setCustomOidcSubClaimForRepo: [
      "PUT /repos/{owner}/{repo}/actions/oidc/customization/sub"
    ],
    setGithubActionsDefaultWorkflowPermissionsOrganization: [
      "PUT /orgs/{org}/actions/permissions/workflow"
    ],
    setGithubActionsDefaultWorkflowPermissionsRepository: [
      "PUT /repos/{owner}/{repo}/actions/permissions/workflow"
    ],
    setGithubActionsPermissionsOrganization: [
      "PUT /orgs/{org}/actions/permissions"
    ],
    setGithubActionsPermissionsRepository: [
      "PUT /repos/{owner}/{repo}/actions/permissions"
    ],
    setSelectedReposForOrgSecret: [
      "PUT /orgs/{org}/actions/secrets/{secret_name}/repositories"
    ],
    setSelectedReposForOrgVariable: [
      "PUT /orgs/{org}/actions/variables/{name}/repositories"
    ],
    setSelectedRepositoriesEnabledGithubActionsOrganization: [
      "PUT /orgs/{org}/actions/permissions/repositories"
    ],
    setWorkflowAccessToRepository: [
      "PUT /repos/{owner}/{repo}/actions/permissions/access"
    ],
    updateEnvironmentVariable: [
      "PATCH /repos/{owner}/{repo}/environments/{environment_name}/variables/{name}"
    ],
    updateHostedRunnerForOrg: [
      "PATCH /orgs/{org}/actions/hosted-runners/{hosted_runner_id}"
    ],
    updateOrgVariable: ["PATCH /orgs/{org}/actions/variables/{name}"],
    updateRepoVariable: [
      "PATCH /repos/{owner}/{repo}/actions/variables/{name}"
    ]
  },
  activity: {
    checkRepoIsStarredByAuthenticatedUser: ["GET /user/starred/{owner}/{repo}"],
    deleteRepoSubscription: ["DELETE /repos/{owner}/{repo}/subscription"],
    deleteThreadSubscription: [
      "DELETE /notifications/threads/{thread_id}/subscription"
    ],
    getFeeds: ["GET /feeds"],
    getRepoSubscription: ["GET /repos/{owner}/{repo}/subscription"],
    getThread: ["GET /notifications/threads/{thread_id}"],
    getThreadSubscriptionForAuthenticatedUser: [
      "GET /notifications/threads/{thread_id}/subscription"
    ],
    listEventsForAuthenticatedUser: ["GET /users/{username}/events"],
    listNotificationsForAuthenticatedUser: ["GET /notifications"],
    listOrgEventsForAuthenticatedUser: [
      "GET /users/{username}/events/orgs/{org}"
    ],
    listPublicEvents: ["GET /events"],
    listPublicEventsForRepoNetwork: ["GET /networks/{owner}/{repo}/events"],
    listPublicEventsForUser: ["GET /users/{username}/events/public"],
    listPublicOrgEvents: ["GET /orgs/{org}/events"],
    listReceivedEventsForUser: ["GET /users/{username}/received_events"],
    listReceivedPublicEventsForUser: [
      "GET /users/{username}/received_events/public"
    ],
    listRepoEvents: ["GET /repos/{owner}/{repo}/events"],
    listRepoNotificationsForAuthenticatedUser: [
      "GET /repos/{owner}/{repo}/notifications"
    ],
    listReposStarredByAuthenticatedUser: ["GET /user/starred"],
    listReposStarredByUser: ["GET /users/{username}/starred"],
    listReposWatchedByUser: ["GET /users/{username}/subscriptions"],
    listStargazersForRepo: ["GET /repos/{owner}/{repo}/stargazers"],
    listWatchedReposForAuthenticatedUser: ["GET /user/subscriptions"],
    listWatchersForRepo: ["GET /repos/{owner}/{repo}/subscribers"],
    markNotificationsAsRead: ["PUT /notifications"],
    markRepoNotificationsAsRead: ["PUT /repos/{owner}/{repo}/notifications"],
    markThreadAsDone: ["DELETE /notifications/threads/{thread_id}"],
    markThreadAsRead: ["PATCH /notifications/threads/{thread_id}"],
    setRepoSubscription: ["PUT /repos/{owner}/{repo}/subscription"],
    setThreadSubscription: [
      "PUT /notifications/threads/{thread_id}/subscription"
    ],
    starRepoForAuthenticatedUser: ["PUT /user/starred/{owner}/{repo}"],
    unstarRepoForAuthenticatedUser: ["DELETE /user/starred/{owner}/{repo}"]
  },
  apps: {
    addRepoToInstallation: [
      "PUT /user/installations/{installation_id}/repositories/{repository_id}",
      {},
      { renamed: ["apps", "addRepoToInstallationForAuthenticatedUser"] }
    ],
    addRepoToInstallationForAuthenticatedUser: [
      "PUT /user/installations/{installation_id}/repositories/{repository_id}"
    ],
    checkToken: ["POST /applications/{client_id}/token"],
    createFromManifest: ["POST /app-manifests/{code}/conversions"],
    createInstallationAccessToken: [
      "POST /app/installations/{installation_id}/access_tokens"
    ],
    deleteAuthorization: ["DELETE /applications/{client_id}/grant"],
    deleteInstallation: ["DELETE /app/installations/{installation_id}"],
    deleteToken: ["DELETE /applications/{client_id}/token"],
    getAuthenticated: ["GET /app"],
    getBySlug: ["GET /apps/{app_slug}"],
    getInstallation: ["GET /app/installations/{installation_id}"],
    getOrgInstallation: ["GET /orgs/{org}/installation"],
    getRepoInstallation: ["GET /repos/{owner}/{repo}/installation"],
    getSubscriptionPlanForAccount: [
      "GET /marketplace_listing/accounts/{account_id}"
    ],
    getSubscriptionPlanForAccountStubbed: [
      "GET /marketplace_listing/stubbed/accounts/{account_id}"
    ],
    getUserInstallation: ["GET /users/{username}/installation"],
    getWebhookConfigForApp: ["GET /app/hook/config"],
    getWebhookDelivery: ["GET /app/hook/deliveries/{delivery_id}"],
    listAccountsForPlan: ["GET /marketplace_listing/plans/{plan_id}/accounts"],
    listAccountsForPlanStubbed: [
      "GET /marketplace_listing/stubbed/plans/{plan_id}/accounts"
    ],
    listInstallationReposForAuthenticatedUser: [
      "GET /user/installations/{installation_id}/repositories"
    ],
    listInstallationRequestsForAuthenticatedApp: [
      "GET /app/installation-requests"
    ],
    listInstallations: ["GET /app/installations"],
    listInstallationsForAuthenticatedUser: ["GET /user/installations"],
    listPlans: ["GET /marketplace_listing/plans"],
    listPlansStubbed: ["GET /marketplace_listing/stubbed/plans"],
    listReposAccessibleToInstallation: ["GET /installation/repositories"],
    listSubscriptionsForAuthenticatedUser: ["GET /user/marketplace_purchases"],
    listSubscriptionsForAuthenticatedUserStubbed: [
      "GET /user/marketplace_purchases/stubbed"
    ],
    listWebhookDeliveries: ["GET /app/hook/deliveries"],
    redeliverWebhookDelivery: [
      "POST /app/hook/deliveries/{delivery_id}/attempts"
    ],
    removeRepoFromInstallation: [
      "DELETE /user/installations/{installation_id}/repositories/{repository_id}",
      {},
      { renamed: ["apps", "removeRepoFromInstallationForAuthenticatedUser"] }
    ],
    removeRepoFromInstallationForAuthenticatedUser: [
      "DELETE /user/installations/{installation_id}/repositories/{repository_id}"
    ],
    resetToken: ["PATCH /applications/{client_id}/token"],
    revokeInstallationAccessToken: ["DELETE /installation/token"],
    scopeToken: ["POST /applications/{client_id}/token/scoped"],
    suspendInstallation: ["PUT /app/installations/{installation_id}/suspended"],
    unsuspendInstallation: [
      "DELETE /app/installations/{installation_id}/suspended"
    ],
    updateWebhookConfigForApp: ["PATCH /app/hook/config"]
  },
  billing: {
    getGithubActionsBillingOrg: ["GET /orgs/{org}/settings/billing/actions"],
    getGithubActionsBillingUser: [
      "GET /users/{username}/settings/billing/actions"
    ],
    getGithubBillingUsageReportOrg: [
      "GET /organizations/{org}/settings/billing/usage"
    ],
    getGithubPackagesBillingOrg: ["GET /orgs/{org}/settings/billing/packages"],
    getGithubPackagesBillingUser: [
      "GET /users/{username}/settings/billing/packages"
    ],
    getSharedStorageBillingOrg: [
      "GET /orgs/{org}/settings/billing/shared-storage"
    ],
    getSharedStorageBillingUser: [
      "GET /users/{username}/settings/billing/shared-storage"
    ]
  },
  checks: {
    create: ["POST /repos/{owner}/{repo}/check-runs"],
    createSuite: ["POST /repos/{owner}/{repo}/check-suites"],
    get: ["GET /repos/{owner}/{repo}/check-runs/{check_run_id}"],
    getSuite: ["GET /repos/{owner}/{repo}/check-suites/{check_suite_id}"],
    listAnnotations: [
      "GET /repos/{owner}/{repo}/check-runs/{check_run_id}/annotations"
    ],
    listForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/check-runs"],
    listForSuite: [
      "GET /repos/{owner}/{repo}/check-suites/{check_suite_id}/check-runs"
    ],
    listSuitesForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/check-suites"],
    rerequestRun: [
      "POST /repos/{owner}/{repo}/check-runs/{check_run_id}/rerequest"
    ],
    rerequestSuite: [
      "POST /repos/{owner}/{repo}/check-suites/{check_suite_id}/rerequest"
    ],
    setSuitesPreferences: [
      "PATCH /repos/{owner}/{repo}/check-suites/preferences"
    ],
    update: ["PATCH /repos/{owner}/{repo}/check-runs/{check_run_id}"]
  },
  codeScanning: {
    commitAutofix: [
      "POST /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/autofix/commits"
    ],
    createAutofix: [
      "POST /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/autofix"
    ],
    createVariantAnalysis: [
      "POST /repos/{owner}/{repo}/code-scanning/codeql/variant-analyses"
    ],
    deleteAnalysis: [
      "DELETE /repos/{owner}/{repo}/code-scanning/analyses/{analysis_id}{?confirm_delete}"
    ],
    deleteCodeqlDatabase: [
      "DELETE /repos/{owner}/{repo}/code-scanning/codeql/databases/{language}"
    ],
    getAlert: [
      "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}",
      {},
      { renamedParameters: { alert_id: "alert_number" } }
    ],
    getAnalysis: [
      "GET /repos/{owner}/{repo}/code-scanning/analyses/{analysis_id}"
    ],
    getAutofix: [
      "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/autofix"
    ],
    getCodeqlDatabase: [
      "GET /repos/{owner}/{repo}/code-scanning/codeql/databases/{language}"
    ],
    getDefaultSetup: ["GET /repos/{owner}/{repo}/code-scanning/default-setup"],
    getSarif: ["GET /repos/{owner}/{repo}/code-scanning/sarifs/{sarif_id}"],
    getVariantAnalysis: [
      "GET /repos/{owner}/{repo}/code-scanning/codeql/variant-analyses/{codeql_variant_analysis_id}"
    ],
    getVariantAnalysisRepoTask: [
      "GET /repos/{owner}/{repo}/code-scanning/codeql/variant-analyses/{codeql_variant_analysis_id}/repos/{repo_owner}/{repo_name}"
    ],
    listAlertInstances: [
      "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances"
    ],
    listAlertsForOrg: ["GET /orgs/{org}/code-scanning/alerts"],
    listAlertsForRepo: ["GET /repos/{owner}/{repo}/code-scanning/alerts"],
    listAlertsInstances: [
      "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances",
      {},
      { renamed: ["codeScanning", "listAlertInstances"] }
    ],
    listCodeqlDatabases: [
      "GET /repos/{owner}/{repo}/code-scanning/codeql/databases"
    ],
    listRecentAnalyses: ["GET /repos/{owner}/{repo}/code-scanning/analyses"],
    updateAlert: [
      "PATCH /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}"
    ],
    updateDefaultSetup: [
      "PATCH /repos/{owner}/{repo}/code-scanning/default-setup"
    ],
    uploadSarif: ["POST /repos/{owner}/{repo}/code-scanning/sarifs"]
  },
  codeSecurity: {
    attachConfiguration: [
      "POST /orgs/{org}/code-security/configurations/{configuration_id}/attach"
    ],
    attachEnterpriseConfiguration: [
      "POST /enterprises/{enterprise}/code-security/configurations/{configuration_id}/attach"
    ],
    createConfiguration: ["POST /orgs/{org}/code-security/configurations"],
    createConfigurationForEnterprise: [
      "POST /enterprises/{enterprise}/code-security/configurations"
    ],
    deleteConfiguration: [
      "DELETE /orgs/{org}/code-security/configurations/{configuration_id}"
    ],
    deleteConfigurationForEnterprise: [
      "DELETE /enterprises/{enterprise}/code-security/configurations/{configuration_id}"
    ],
    detachConfiguration: [
      "DELETE /orgs/{org}/code-security/configurations/detach"
    ],
    getConfiguration: [
      "GET /orgs/{org}/code-security/configurations/{configuration_id}"
    ],
    getConfigurationForRepository: [
      "GET /repos/{owner}/{repo}/code-security-configuration"
    ],
    getConfigurationsForEnterprise: [
      "GET /enterprises/{enterprise}/code-security/configurations"
    ],
    getConfigurationsForOrg: ["GET /orgs/{org}/code-security/configurations"],
    getDefaultConfigurations: [
      "GET /orgs/{org}/code-security/configurations/defaults"
    ],
    getDefaultConfigurationsForEnterprise: [
      "GET /enterprises/{enterprise}/code-security/configurations/defaults"
    ],
    getRepositoriesForConfiguration: [
      "GET /orgs/{org}/code-security/configurations/{configuration_id}/repositories"
    ],
    getRepositoriesForEnterpriseConfiguration: [
      "GET /enterprises/{enterprise}/code-security/configurations/{configuration_id}/repositories"
    ],
    getSingleConfigurationForEnterprise: [
      "GET /enterprises/{enterprise}/code-security/configurations/{configuration_id}"
    ],
    setConfigurationAsDefault: [
      "PUT /orgs/{org}/code-security/configurations/{configuration_id}/defaults"
    ],
    setConfigurationAsDefaultForEnterprise: [
      "PUT /enterprises/{enterprise}/code-security/configurations/{configuration_id}/defaults"
    ],
    updateConfiguration: [
      "PATCH /orgs/{org}/code-security/configurations/{configuration_id}"
    ],
    updateEnterpriseConfiguration: [
      "PATCH /enterprises/{enterprise}/code-security/configurations/{configuration_id}"
    ]
  },
  codesOfConduct: {
    getAllCodesOfConduct: ["GET /codes_of_conduct"],
    getConductCode: ["GET /codes_of_conduct/{key}"]
  },
  codespaces: {
    addRepositoryForSecretForAuthenticatedUser: [
      "PUT /user/codespaces/secrets/{secret_name}/repositories/{repository_id}"
    ],
    addSelectedRepoToOrgSecret: [
      "PUT /orgs/{org}/codespaces/secrets/{secret_name}/repositories/{repository_id}"
    ],
    checkPermissionsForDevcontainer: [
      "GET /repos/{owner}/{repo}/codespaces/permissions_check"
    ],
    codespaceMachinesForAuthenticatedUser: [
      "GET /user/codespaces/{codespace_name}/machines"
    ],
    createForAuthenticatedUser: ["POST /user/codespaces"],
    createOrUpdateOrgSecret: [
      "PUT /orgs/{org}/codespaces/secrets/{secret_name}"
    ],
    createOrUpdateRepoSecret: [
      "PUT /repos/{owner}/{repo}/codespaces/secrets/{secret_name}"
    ],
    createOrUpdateSecretForAuthenticatedUser: [
      "PUT /user/codespaces/secrets/{secret_name}"
    ],
    createWithPrForAuthenticatedUser: [
      "POST /repos/{owner}/{repo}/pulls/{pull_number}/codespaces"
    ],
    createWithRepoForAuthenticatedUser: [
      "POST /repos/{owner}/{repo}/codespaces"
    ],
    deleteForAuthenticatedUser: ["DELETE /user/codespaces/{codespace_name}"],
    deleteFromOrganization: [
      "DELETE /orgs/{org}/members/{username}/codespaces/{codespace_name}"
    ],
    deleteOrgSecret: ["DELETE /orgs/{org}/codespaces/secrets/{secret_name}"],
    deleteRepoSecret: [
      "DELETE /repos/{owner}/{repo}/codespaces/secrets/{secret_name}"
    ],
    deleteSecretForAuthenticatedUser: [
      "DELETE /user/codespaces/secrets/{secret_name}"
    ],
    exportForAuthenticatedUser: [
      "POST /user/codespaces/{codespace_name}/exports"
    ],
    getCodespacesForUserInOrg: [
      "GET /orgs/{org}/members/{username}/codespaces"
    ],
    getExportDetailsForAuthenticatedUser: [
      "GET /user/codespaces/{codespace_name}/exports/{export_id}"
    ],
    getForAuthenticatedUser: ["GET /user/codespaces/{codespace_name}"],
    getOrgPublicKey: ["GET /orgs/{org}/codespaces/secrets/public-key"],
    getOrgSecret: ["GET /orgs/{org}/codespaces/secrets/{secret_name}"],
    getPublicKeyForAuthenticatedUser: [
      "GET /user/codespaces/secrets/public-key"
    ],
    getRepoPublicKey: [
      "GET /repos/{owner}/{repo}/codespaces/secrets/public-key"
    ],
    getRepoSecret: [
      "GET /repos/{owner}/{repo}/codespaces/secrets/{secret_name}"
    ],
    getSecretForAuthenticatedUser: [
      "GET /user/codespaces/secrets/{secret_name}"
    ],
    listDevcontainersInRepositoryForAuthenticatedUser: [
      "GET /repos/{owner}/{repo}/codespaces/devcontainers"
    ],
    listForAuthenticatedUser: ["GET /user/codespaces"],
    listInOrganization: [
      "GET /orgs/{org}/codespaces",
      {},
      { renamedParameters: { org_id: "org" } }
    ],
    listInRepositoryForAuthenticatedUser: [
      "GET /repos/{owner}/{repo}/codespaces"
    ],
    listOrgSecrets: ["GET /orgs/{org}/codespaces/secrets"],
    listRepoSecrets: ["GET /repos/{owner}/{repo}/codespaces/secrets"],
    listRepositoriesForSecretForAuthenticatedUser: [
      "GET /user/codespaces/secrets/{secret_name}/repositories"
    ],
    listSecretsForAuthenticatedUser: ["GET /user/codespaces/secrets"],
    listSelectedReposForOrgSecret: [
      "GET /orgs/{org}/codespaces/secrets/{secret_name}/repositories"
    ],
    preFlightWithRepoForAuthenticatedUser: [
      "GET /repos/{owner}/{repo}/codespaces/new"
    ],
    publishForAuthenticatedUser: [
      "POST /user/codespaces/{codespace_name}/publish"
    ],
    removeRepositoryForSecretForAuthenticatedUser: [
      "DELETE /user/codespaces/secrets/{secret_name}/repositories/{repository_id}"
    ],
    removeSelectedRepoFromOrgSecret: [
      "DELETE /orgs/{org}/codespaces/secrets/{secret_name}/repositories/{repository_id}"
    ],
    repoMachinesForAuthenticatedUser: [
      "GET /repos/{owner}/{repo}/codespaces/machines"
    ],
    setRepositoriesForSecretForAuthenticatedUser: [
      "PUT /user/codespaces/secrets/{secret_name}/repositories"
    ],
    setSelectedReposForOrgSecret: [
      "PUT /orgs/{org}/codespaces/secrets/{secret_name}/repositories"
    ],
    startForAuthenticatedUser: ["POST /user/codespaces/{codespace_name}/start"],
    stopForAuthenticatedUser: ["POST /user/codespaces/{codespace_name}/stop"],
    stopInOrganization: [
      "POST /orgs/{org}/members/{username}/codespaces/{codespace_name}/stop"
    ],
    updateForAuthenticatedUser: ["PATCH /user/codespaces/{codespace_name}"]
  },
  copilot: {
    addCopilotSeatsForTeams: [
      "POST /orgs/{org}/copilot/billing/selected_teams"
    ],
    addCopilotSeatsForUsers: [
      "POST /orgs/{org}/copilot/billing/selected_users"
    ],
    cancelCopilotSeatAssignmentForTeams: [
      "DELETE /orgs/{org}/copilot/billing/selected_teams"
    ],
    cancelCopilotSeatAssignmentForUsers: [
      "DELETE /orgs/{org}/copilot/billing/selected_users"
    ],
    copilotMetricsForOrganization: ["GET /orgs/{org}/copilot/metrics"],
    copilotMetricsForTeam: ["GET /orgs/{org}/team/{team_slug}/copilot/metrics"],
    getCopilotOrganizationDetails: ["GET /orgs/{org}/copilot/billing"],
    getCopilotSeatDetailsForUser: [
      "GET /orgs/{org}/members/{username}/copilot"
    ],
    listCopilotSeats: ["GET /orgs/{org}/copilot/billing/seats"],
    usageMetricsForOrg: ["GET /orgs/{org}/copilot/usage"],
    usageMetricsForTeam: ["GET /orgs/{org}/team/{team_slug}/copilot/usage"]
  },
  dependabot: {
    addSelectedRepoToOrgSecret: [
      "PUT /orgs/{org}/dependabot/secrets/{secret_name}/repositories/{repository_id}"
    ],
    createOrUpdateOrgSecret: [
      "PUT /orgs/{org}/dependabot/secrets/{secret_name}"
    ],
    createOrUpdateRepoSecret: [
      "PUT /repos/{owner}/{repo}/dependabot/secrets/{secret_name}"
    ],
    deleteOrgSecret: ["DELETE /orgs/{org}/dependabot/secrets/{secret_name}"],
    deleteRepoSecret: [
      "DELETE /repos/{owner}/{repo}/dependabot/secrets/{secret_name}"
    ],
    getAlert: ["GET /repos/{owner}/{repo}/dependabot/alerts/{alert_number}"],
    getOrgPublicKey: ["GET /orgs/{org}/dependabot/secrets/public-key"],
    getOrgSecret: ["GET /orgs/{org}/dependabot/secrets/{secret_name}"],
    getRepoPublicKey: [
      "GET /repos/{owner}/{repo}/dependabot/secrets/public-key"
    ],
    getRepoSecret: [
      "GET /repos/{owner}/{repo}/dependabot/secrets/{secret_name}"
    ],
    listAlertsForEnterprise: [
      "GET /enterprises/{enterprise}/dependabot/alerts"
    ],
    listAlertsForOrg: ["GET /orgs/{org}/dependabot/alerts"],
    listAlertsForRepo: ["GET /repos/{owner}/{repo}/dependabot/alerts"],
    listOrgSecrets: ["GET /orgs/{org}/dependabot/secrets"],
    listRepoSecrets: ["GET /repos/{owner}/{repo}/dependabot/secrets"],
    listSelectedReposForOrgSecret: [
      "GET /orgs/{org}/dependabot/secrets/{secret_name}/repositories"
    ],
    removeSelectedRepoFromOrgSecret: [
      "DELETE /orgs/{org}/dependabot/secrets/{secret_name}/repositories/{repository_id}"
    ],
    setSelectedReposForOrgSecret: [
      "PUT /orgs/{org}/dependabot/secrets/{secret_name}/repositories"
    ],
    updateAlert: [
      "PATCH /repos/{owner}/{repo}/dependabot/alerts/{alert_number}"
    ]
  },
  dependencyGraph: {
    createRepositorySnapshot: [
      "POST /repos/{owner}/{repo}/dependency-graph/snapshots"
    ],
    diffRange: [
      "GET /repos/{owner}/{repo}/dependency-graph/compare/{basehead}"
    ],
    exportSbom: ["GET /repos/{owner}/{repo}/dependency-graph/sbom"]
  },
  emojis: { get: ["GET /emojis"] },
  gists: {
    checkIsStarred: ["GET /gists/{gist_id}/star"],
    create: ["POST /gists"],
    createComment: ["POST /gists/{gist_id}/comments"],
    delete: ["DELETE /gists/{gist_id}"],
    deleteComment: ["DELETE /gists/{gist_id}/comments/{comment_id}"],
    fork: ["POST /gists/{gist_id}/forks"],
    get: ["GET /gists/{gist_id}"],
    getComment: ["GET /gists/{gist_id}/comments/{comment_id}"],
    getRevision: ["GET /gists/{gist_id}/{sha}"],
    list: ["GET /gists"],
    listComments: ["GET /gists/{gist_id}/comments"],
    listCommits: ["GET /gists/{gist_id}/commits"],
    listForUser: ["GET /users/{username}/gists"],
    listForks: ["GET /gists/{gist_id}/forks"],
    listPublic: ["GET /gists/public"],
    listStarred: ["GET /gists/starred"],
    star: ["PUT /gists/{gist_id}/star"],
    unstar: ["DELETE /gists/{gist_id}/star"],
    update: ["PATCH /gists/{gist_id}"],
    updateComment: ["PATCH /gists/{gist_id}/comments/{comment_id}"]
  },
  git: {
    createBlob: ["POST /repos/{owner}/{repo}/git/blobs"],
    createCommit: ["POST /repos/{owner}/{repo}/git/commits"],
    createRef: ["POST /repos/{owner}/{repo}/git/refs"],
    createTag: ["POST /repos/{owner}/{repo}/git/tags"],
    createTree: ["POST /repos/{owner}/{repo}/git/trees"],
    deleteRef: ["DELETE /repos/{owner}/{repo}/git/refs/{ref}"],
    getBlob: ["GET /repos/{owner}/{repo}/git/blobs/{file_sha}"],
    getCommit: ["GET /repos/{owner}/{repo}/git/commits/{commit_sha}"],
    getRef: ["GET /repos/{owner}/{repo}/git/ref/{ref}"],
    getTag: ["GET /repos/{owner}/{repo}/git/tags/{tag_sha}"],
    getTree: ["GET /repos/{owner}/{repo}/git/trees/{tree_sha}"],
    listMatchingRefs: ["GET /repos/{owner}/{repo}/git/matching-refs/{ref}"],
    updateRef: ["PATCH /repos/{owner}/{repo}/git/refs/{ref}"]
  },
  gitignore: {
    getAllTemplates: ["GET /gitignore/templates"],
    getTemplate: ["GET /gitignore/templates/{name}"]
  },
  hostedCompute: {
    createNetworkConfigurationForOrg: [
      "POST /orgs/{org}/settings/network-configurations"
    ],
    deleteNetworkConfigurationFromOrg: [
      "DELETE /orgs/{org}/settings/network-configurations/{network_configuration_id}"
    ],
    getNetworkConfigurationForOrg: [
      "GET /orgs/{org}/settings/network-configurations/{network_configuration_id}"
    ],
    getNetworkSettingsForOrg: [
      "GET /orgs/{org}/settings/network-settings/{network_settings_id}"
    ],
    listNetworkConfigurationsForOrg: [
      "GET /orgs/{org}/settings/network-configurations"
    ],
    updateNetworkConfigurationForOrg: [
      "PATCH /orgs/{org}/settings/network-configurations/{network_configuration_id}"
    ]
  },
  interactions: {
    getRestrictionsForAuthenticatedUser: ["GET /user/interaction-limits"],
    getRestrictionsForOrg: ["GET /orgs/{org}/interaction-limits"],
    getRestrictionsForRepo: ["GET /repos/{owner}/{repo}/interaction-limits"],
    getRestrictionsForYourPublicRepos: [
      "GET /user/interaction-limits",
      {},
      { renamed: ["interactions", "getRestrictionsForAuthenticatedUser"] }
    ],
    removeRestrictionsForAuthenticatedUser: ["DELETE /user/interaction-limits"],
    removeRestrictionsForOrg: ["DELETE /orgs/{org}/interaction-limits"],
    removeRestrictionsForRepo: [
      "DELETE /repos/{owner}/{repo}/interaction-limits"
    ],
    removeRestrictionsForYourPublicRepos: [
      "DELETE /user/interaction-limits",
      {},
      { renamed: ["interactions", "removeRestrictionsForAuthenticatedUser"] }
    ],
    setRestrictionsForAuthenticatedUser: ["PUT /user/interaction-limits"],
    setRestrictionsForOrg: ["PUT /orgs/{org}/interaction-limits"],
    setRestrictionsForRepo: ["PUT /repos/{owner}/{repo}/interaction-limits"],
    setRestrictionsForYourPublicRepos: [
      "PUT /user/interaction-limits",
      {},
      { renamed: ["interactions", "setRestrictionsForAuthenticatedUser"] }
    ]
  },
  issues: {
    addAssignees: [
      "POST /repos/{owner}/{repo}/issues/{issue_number}/assignees"
    ],
    addLabels: ["POST /repos/{owner}/{repo}/issues/{issue_number}/labels"],
    addSubIssue: [
      "POST /repos/{owner}/{repo}/issues/{issue_number}/sub_issues"
    ],
    checkUserCanBeAssigned: ["GET /repos/{owner}/{repo}/assignees/{assignee}"],
    checkUserCanBeAssignedToIssue: [
      "GET /repos/{owner}/{repo}/issues/{issue_number}/assignees/{assignee}"
    ],
    create: ["POST /repos/{owner}/{repo}/issues"],
    createComment: [
      "POST /repos/{owner}/{repo}/issues/{issue_number}/comments"
    ],
    createLabel: ["POST /repos/{owner}/{repo}/labels"],
    createMilestone: ["POST /repos/{owner}/{repo}/milestones"],
    deleteComment: [
      "DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}"
    ],
    deleteLabel: ["DELETE /repos/{owner}/{repo}/labels/{name}"],
    deleteMilestone: [
      "DELETE /repos/{owner}/{repo}/milestones/{milestone_number}"
    ],
    get: ["GET /repos/{owner}/{repo}/issues/{issue_number}"],
    getComment: ["GET /repos/{owner}/{repo}/issues/comments/{comment_id}"],
    getEvent: ["GET /repos/{owner}/{repo}/issues/events/{event_id}"],
    getLabel: ["GET /repos/{owner}/{repo}/labels/{name}"],
    getMilestone: ["GET /repos/{owner}/{repo}/milestones/{milestone_number}"],
    list: ["GET /issues"],
    listAssignees: ["GET /repos/{owner}/{repo}/assignees"],
    listComments: ["GET /repos/{owner}/{repo}/issues/{issue_number}/comments"],
    listCommentsForRepo: ["GET /repos/{owner}/{repo}/issues/comments"],
    listEvents: ["GET /repos/{owner}/{repo}/issues/{issue_number}/events"],
    listEventsForRepo: ["GET /repos/{owner}/{repo}/issues/events"],
    listEventsForTimeline: [
      "GET /repos/{owner}/{repo}/issues/{issue_number}/timeline"
    ],
    listForAuthenticatedUser: ["GET /user/issues"],
    listForOrg: ["GET /orgs/{org}/issues"],
    listForRepo: ["GET /repos/{owner}/{repo}/issues"],
    listLabelsForMilestone: [
      "GET /repos/{owner}/{repo}/milestones/{milestone_number}/labels"
    ],
    listLabelsForRepo: ["GET /repos/{owner}/{repo}/labels"],
    listLabelsOnIssue: [
      "GET /repos/{owner}/{repo}/issues/{issue_number}/labels"
    ],
    listMilestones: ["GET /repos/{owner}/{repo}/milestones"],
    listSubIssues: [
      "GET /repos/{owner}/{repo}/issues/{issue_number}/sub_issues"
    ],
    lock: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/lock"],
    removeAllLabels: [
      "DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels"
    ],
    removeAssignees: [
      "DELETE /repos/{owner}/{repo}/issues/{issue_number}/assignees"
    ],
    removeLabel: [
      "DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels/{name}"
    ],
    removeSubIssue: [
      "DELETE /repos/{owner}/{repo}/issues/{issue_number}/sub_issue"
    ],
    reprioritizeSubIssue: [
      "PATCH /repos/{owner}/{repo}/issues/{issue_number}/sub_issues/priority"
    ],
    setLabels: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/labels"],
    unlock: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/lock"],
    update: ["PATCH /repos/{owner}/{repo}/issues/{issue_number}"],
    updateComment: ["PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}"],
    updateLabel: ["PATCH /repos/{owner}/{repo}/labels/{name}"],
    updateMilestone: [
      "PATCH /repos/{owner}/{repo}/milestones/{milestone_number}"
    ]
  },
  licenses: {
    get: ["GET /licenses/{license}"],
    getAllCommonlyUsed: ["GET /licenses"],
    getForRepo: ["GET /repos/{owner}/{repo}/license"]
  },
  markdown: {
    render: ["POST /markdown"],
    renderRaw: [
      "POST /markdown/raw",
      { headers: { "content-type": "text/plain; charset=utf-8" } }
    ]
  },
  meta: {
    get: ["GET /meta"],
    getAllVersions: ["GET /versions"],
    getOctocat: ["GET /octocat"],
    getZen: ["GET /zen"],
    root: ["GET /"]
  },
  migrations: {
    deleteArchiveForAuthenticatedUser: [
      "DELETE /user/migrations/{migration_id}/archive"
    ],
    deleteArchiveForOrg: [
      "DELETE /orgs/{org}/migrations/{migration_id}/archive"
    ],
    downloadArchiveForOrg: [
      "GET /orgs/{org}/migrations/{migration_id}/archive"
    ],
    getArchiveForAuthenticatedUser: [
      "GET /user/migrations/{migration_id}/archive"
    ],
    getStatusForAuthenticatedUser: ["GET /user/migrations/{migration_id}"],
    getStatusForOrg: ["GET /orgs/{org}/migrations/{migration_id}"],
    listForAuthenticatedUser: ["GET /user/migrations"],
    listForOrg: ["GET /orgs/{org}/migrations"],
    listReposForAuthenticatedUser: [
      "GET /user/migrations/{migration_id}/repositories"
    ],
    listReposForOrg: ["GET /orgs/{org}/migrations/{migration_id}/repositories"],
    listReposForUser: [
      "GET /user/migrations/{migration_id}/repositories",
      {},
      { renamed: ["migrations", "listReposForAuthenticatedUser"] }
    ],
    startForAuthenticatedUser: ["POST /user/migrations"],
    startForOrg: ["POST /orgs/{org}/migrations"],
    unlockRepoForAuthenticatedUser: [
      "DELETE /user/migrations/{migration_id}/repos/{repo_name}/lock"
    ],
    unlockRepoForOrg: [
      "DELETE /orgs/{org}/migrations/{migration_id}/repos/{repo_name}/lock"
    ]
  },
  oidc: {
    getOidcCustomSubTemplateForOrg: [
      "GET /orgs/{org}/actions/oidc/customization/sub"
    ],
    updateOidcCustomSubTemplateForOrg: [
      "PUT /orgs/{org}/actions/oidc/customization/sub"
    ]
  },
  orgs: {
    addSecurityManagerTeam: [
      "PUT /orgs/{org}/security-managers/teams/{team_slug}",
      {},
      {
        deprecated: "octokit.rest.orgs.addSecurityManagerTeam() is deprecated, see https://docs.github.com/rest/orgs/security-managers#add-a-security-manager-team"
      }
    ],
    assignTeamToOrgRole: [
      "PUT /orgs/{org}/organization-roles/teams/{team_slug}/{role_id}"
    ],
    assignUserToOrgRole: [
      "PUT /orgs/{org}/organization-roles/users/{username}/{role_id}"
    ],
    blockUser: ["PUT /orgs/{org}/blocks/{username}"],
    cancelInvitation: ["DELETE /orgs/{org}/invitations/{invitation_id}"],
    checkBlockedUser: ["GET /orgs/{org}/blocks/{username}"],
    checkMembershipForUser: ["GET /orgs/{org}/members/{username}"],
    checkPublicMembershipForUser: ["GET /orgs/{org}/public_members/{username}"],
    convertMemberToOutsideCollaborator: [
      "PUT /orgs/{org}/outside_collaborators/{username}"
    ],
    createInvitation: ["POST /orgs/{org}/invitations"],
    createIssueType: ["POST /orgs/{org}/issue-types"],
    createOrUpdateCustomProperties: ["PATCH /orgs/{org}/properties/schema"],
    createOrUpdateCustomPropertiesValuesForRepos: [
      "PATCH /orgs/{org}/properties/values"
    ],
    createOrUpdateCustomProperty: [
      "PUT /orgs/{org}/properties/schema/{custom_property_name}"
    ],
    createWebhook: ["POST /orgs/{org}/hooks"],
    delete: ["DELETE /orgs/{org}"],
    deleteIssueType: ["DELETE /orgs/{org}/issue-types/{issue_type_id}"],
    deleteWebhook: ["DELETE /orgs/{org}/hooks/{hook_id}"],
    enableOrDisableSecurityProductOnAllOrgRepos: [
      "POST /orgs/{org}/{security_product}/{enablement}",
      {},
      {
        deprecated: "octokit.rest.orgs.enableOrDisableSecurityProductOnAllOrgRepos() is deprecated, see https://docs.github.com/rest/orgs/orgs#enable-or-disable-a-security-feature-for-an-organization"
      }
    ],
    get: ["GET /orgs/{org}"],
    getAllCustomProperties: ["GET /orgs/{org}/properties/schema"],
    getCustomProperty: [
      "GET /orgs/{org}/properties/schema/{custom_property_name}"
    ],
    getMembershipForAuthenticatedUser: ["GET /user/memberships/orgs/{org}"],
    getMembershipForUser: ["GET /orgs/{org}/memberships/{username}"],
    getOrgRole: ["GET /orgs/{org}/organization-roles/{role_id}"],
    getOrgRulesetHistory: ["GET /orgs/{org}/rulesets/{ruleset_id}/history"],
    getOrgRulesetVersion: [
      "GET /orgs/{org}/rulesets/{ruleset_id}/history/{version_id}"
    ],
    getWebhook: ["GET /orgs/{org}/hooks/{hook_id}"],
    getWebhookConfigForOrg: ["GET /orgs/{org}/hooks/{hook_id}/config"],
    getWebhookDelivery: [
      "GET /orgs/{org}/hooks/{hook_id}/deliveries/{delivery_id}"
    ],
    list: ["GET /organizations"],
    listAppInstallations: ["GET /orgs/{org}/installations"],
    listAttestations: ["GET /orgs/{org}/attestations/{subject_digest}"],
    listBlockedUsers: ["GET /orgs/{org}/blocks"],
    listCustomPropertiesValuesForRepos: ["GET /orgs/{org}/properties/values"],
    listFailedInvitations: ["GET /orgs/{org}/failed_invitations"],
    listForAuthenticatedUser: ["GET /user/orgs"],
    listForUser: ["GET /users/{username}/orgs"],
    listInvitationTeams: ["GET /orgs/{org}/invitations/{invitation_id}/teams"],
    listIssueTypes: ["GET /orgs/{org}/issue-types"],
    listMembers: ["GET /orgs/{org}/members"],
    listMembershipsForAuthenticatedUser: ["GET /user/memberships/orgs"],
    listOrgRoleTeams: ["GET /orgs/{org}/organization-roles/{role_id}/teams"],
    listOrgRoleUsers: ["GET /orgs/{org}/organization-roles/{role_id}/users"],
    listOrgRoles: ["GET /orgs/{org}/organization-roles"],
    listOrganizationFineGrainedPermissions: [
      "GET /orgs/{org}/organization-fine-grained-permissions"
    ],
    listOutsideCollaborators: ["GET /orgs/{org}/outside_collaborators"],
    listPatGrantRepositories: [
      "GET /orgs/{org}/personal-access-tokens/{pat_id}/repositories"
    ],
    listPatGrantRequestRepositories: [
      "GET /orgs/{org}/personal-access-token-requests/{pat_request_id}/repositories"
    ],
    listPatGrantRequests: ["GET /orgs/{org}/personal-access-token-requests"],
    listPatGrants: ["GET /orgs/{org}/personal-access-tokens"],
    listPendingInvitations: ["GET /orgs/{org}/invitations"],
    listPublicMembers: ["GET /orgs/{org}/public_members"],
    listSecurityManagerTeams: [
      "GET /orgs/{org}/security-managers",
      {},
      {
        deprecated: "octokit.rest.orgs.listSecurityManagerTeams() is deprecated, see https://docs.github.com/rest/orgs/security-managers#list-security-manager-teams"
      }
    ],
    listWebhookDeliveries: ["GET /orgs/{org}/hooks/{hook_id}/deliveries"],
    listWebhooks: ["GET /orgs/{org}/hooks"],
    pingWebhook: ["POST /orgs/{org}/hooks/{hook_id}/pings"],
    redeliverWebhookDelivery: [
      "POST /orgs/{org}/hooks/{hook_id}/deliveries/{delivery_id}/attempts"
    ],
    removeCustomProperty: [
      "DELETE /orgs/{org}/properties/schema/{custom_property_name}"
    ],
    removeMember: ["DELETE /orgs/{org}/members/{username}"],
    removeMembershipForUser: ["DELETE /orgs/{org}/memberships/{username}"],
    removeOutsideCollaborator: [
      "DELETE /orgs/{org}/outside_collaborators/{username}"
    ],
    removePublicMembershipForAuthenticatedUser: [
      "DELETE /orgs/{org}/public_members/{username}"
    ],
    removeSecurityManagerTeam: [
      "DELETE /orgs/{org}/security-managers/teams/{team_slug}",
      {},
      {
        deprecated: "octokit.rest.orgs.removeSecurityManagerTeam() is deprecated, see https://docs.github.com/rest/orgs/security-managers#remove-a-security-manager-team"
      }
    ],
    reviewPatGrantRequest: [
      "POST /orgs/{org}/personal-access-token-requests/{pat_request_id}"
    ],
    reviewPatGrantRequestsInBulk: [
      "POST /orgs/{org}/personal-access-token-requests"
    ],
    revokeAllOrgRolesTeam: [
      "DELETE /orgs/{org}/organization-roles/teams/{team_slug}"
    ],
    revokeAllOrgRolesUser: [
      "DELETE /orgs/{org}/organization-roles/users/{username}"
    ],
    revokeOrgRoleTeam: [
      "DELETE /orgs/{org}/organization-roles/teams/{team_slug}/{role_id}"
    ],
    revokeOrgRoleUser: [
      "DELETE /orgs/{org}/organization-roles/users/{username}/{role_id}"
    ],
    setMembershipForUser: ["PUT /orgs/{org}/memberships/{username}"],
    setPublicMembershipForAuthenticatedUser: [
      "PUT /orgs/{org}/public_members/{username}"
    ],
    unblockUser: ["DELETE /orgs/{org}/blocks/{username}"],
    update: ["PATCH /orgs/{org}"],
    updateIssueType: ["PUT /orgs/{org}/issue-types/{issue_type_id}"],
    updateMembershipForAuthenticatedUser: [
      "PATCH /user/memberships/orgs/{org}"
    ],
    updatePatAccess: ["POST /orgs/{org}/personal-access-tokens/{pat_id}"],
    updatePatAccesses: ["POST /orgs/{org}/personal-access-tokens"],
    updateWebhook: ["PATCH /orgs/{org}/hooks/{hook_id}"],
    updateWebhookConfigForOrg: ["PATCH /orgs/{org}/hooks/{hook_id}/config"]
  },
  packages: {
    deletePackageForAuthenticatedUser: [
      "DELETE /user/packages/{package_type}/{package_name}"
    ],
    deletePackageForOrg: [
      "DELETE /orgs/{org}/packages/{package_type}/{package_name}"
    ],
    deletePackageForUser: [
      "DELETE /users/{username}/packages/{package_type}/{package_name}"
    ],
    deletePackageVersionForAuthenticatedUser: [
      "DELETE /user/packages/{package_type}/{package_name}/versions/{package_version_id}"
    ],
    deletePackageVersionForOrg: [
      "DELETE /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}"
    ],
    deletePackageVersionForUser: [
      "DELETE /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}"
    ],
    getAllPackageVersionsForAPackageOwnedByAnOrg: [
      "GET /orgs/{org}/packages/{package_type}/{package_name}/versions",
      {},
      { renamed: ["packages", "getAllPackageVersionsForPackageOwnedByOrg"] }
    ],
    getAllPackageVersionsForAPackageOwnedByTheAuthenticatedUser: [
      "GET /user/packages/{package_type}/{package_name}/versions",
      {},
      {
        renamed: [
          "packages",
          "getAllPackageVersionsForPackageOwnedByAuthenticatedUser"
        ]
      }
    ],
    getAllPackageVersionsForPackageOwnedByAuthenticatedUser: [
      "GET /user/packages/{package_type}/{package_name}/versions"
    ],
    getAllPackageVersionsForPackageOwnedByOrg: [
      "GET /orgs/{org}/packages/{package_type}/{package_name}/versions"
    ],
    getAllPackageVersionsForPackageOwnedByUser: [
      "GET /users/{username}/packages/{package_type}/{package_name}/versions"
    ],
    getPackageForAuthenticatedUser: [
      "GET /user/packages/{package_type}/{package_name}"
    ],
    getPackageForOrganization: [
      "GET /orgs/{org}/packages/{package_type}/{package_name}"
    ],
    getPackageForUser: [
      "GET /users/{username}/packages/{package_type}/{package_name}"
    ],
    getPackageVersionForAuthenticatedUser: [
      "GET /user/packages/{package_type}/{package_name}/versions/{package_version_id}"
    ],
    getPackageVersionForOrganization: [
      "GET /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}"
    ],
    getPackageVersionForUser: [
      "GET /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}"
    ],
    listDockerMigrationConflictingPackagesForAuthenticatedUser: [
      "GET /user/docker/conflicts"
    ],
    listDockerMigrationConflictingPackagesForOrganization: [
      "GET /orgs/{org}/docker/conflicts"
    ],
    listDockerMigrationConflictingPackagesForUser: [
      "GET /users/{username}/docker/conflicts"
    ],
    listPackagesForAuthenticatedUser: ["GET /user/packages"],
    listPackagesForOrganization: ["GET /orgs/{org}/packages"],
    listPackagesForUser: ["GET /users/{username}/packages"],
    restorePackageForAuthenticatedUser: [
      "POST /user/packages/{package_type}/{package_name}/restore{?token}"
    ],
    restorePackageForOrg: [
      "POST /orgs/{org}/packages/{package_type}/{package_name}/restore{?token}"
    ],
    restorePackageForUser: [
      "POST /users/{username}/packages/{package_type}/{package_name}/restore{?token}"
    ],
    restorePackageVersionForAuthenticatedUser: [
      "POST /user/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"
    ],
    restorePackageVersionForOrg: [
      "POST /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"
    ],
    restorePackageVersionForUser: [
      "POST /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"
    ]
  },
  privateRegistries: {
    createOrgPrivateRegistry: ["POST /orgs/{org}/private-registries"],
    deleteOrgPrivateRegistry: [
      "DELETE /orgs/{org}/private-registries/{secret_name}"
    ],
    getOrgPrivateRegistry: ["GET /orgs/{org}/private-registries/{secret_name}"],
    getOrgPublicKey: ["GET /orgs/{org}/private-registries/public-key"],
    listOrgPrivateRegistries: ["GET /orgs/{org}/private-registries"],
    updateOrgPrivateRegistry: [
      "PATCH /orgs/{org}/private-registries/{secret_name}"
    ]
  },
  projects: {
    addCollaborator: [
      "PUT /projects/{project_id}/collaborators/{username}",
      {},
      {
        deprecated: "octokit.rest.projects.addCollaborator() is deprecated, see https://docs.github.com/rest/projects/collaborators#add-project-collaborator"
      }
    ],
    createCard: [
      "POST /projects/columns/{column_id}/cards",
      {},
      {
        deprecated: "octokit.rest.projects.createCard() is deprecated, see https://docs.github.com/rest/projects/cards#create-a-project-card"
      }
    ],
    createColumn: [
      "POST /projects/{project_id}/columns",
      {},
      {
        deprecated: "octokit.rest.projects.createColumn() is deprecated, see https://docs.github.com/rest/projects/columns#create-a-project-column"
      }
    ],
    createForAuthenticatedUser: [
      "POST /user/projects",
      {},
      {
        deprecated: "octokit.rest.projects.createForAuthenticatedUser() is deprecated, see https://docs.github.com/rest/projects/projects#create-a-user-project"
      }
    ],
    createForOrg: [
      "POST /orgs/{org}/projects",
      {},
      {
        deprecated: "octokit.rest.projects.createForOrg() is deprecated, see https://docs.github.com/rest/projects/projects#create-an-organization-project"
      }
    ],
    createForRepo: [
      "POST /repos/{owner}/{repo}/projects",
      {},
      {
        deprecated: "octokit.rest.projects.createForRepo() is deprecated, see https://docs.github.com/rest/projects/projects#create-a-repository-project"
      }
    ],
    delete: [
      "DELETE /projects/{project_id}",
      {},
      {
        deprecated: "octokit.rest.projects.delete() is deprecated, see https://docs.github.com/rest/projects/projects#delete-a-project"
      }
    ],
    deleteCard: [
      "DELETE /projects/columns/cards/{card_id}",
      {},
      {
        deprecated: "octokit.rest.projects.deleteCard() is deprecated, see https://docs.github.com/rest/projects/cards#delete-a-project-card"
      }
    ],
    deleteColumn: [
      "DELETE /projects/columns/{column_id}",
      {},
      {
        deprecated: "octokit.rest.projects.deleteColumn() is deprecated, see https://docs.github.com/rest/projects/columns#delete-a-project-column"
      }
    ],
    get: [
      "GET /projects/{project_id}",
      {},
      {
        deprecated: "octokit.rest.projects.get() is deprecated, see https://docs.github.com/rest/projects/projects#get-a-project"
      }
    ],
    getCard: [
      "GET /projects/columns/cards/{card_id}",
      {},
      {
        deprecated: "octokit.rest.projects.getCard() is deprecated, see https://docs.github.com/rest/projects/cards#get-a-project-card"
      }
    ],
    getColumn: [
      "GET /projects/columns/{column_id}",
      {},
      {
        deprecated: "octokit.rest.projects.getColumn() is deprecated, see https://docs.github.com/rest/projects/columns#get-a-project-column"
      }
    ],
    getPermissionForUser: [
      "GET /projects/{project_id}/collaborators/{username}/permission",
      {},
      {
        deprecated: "octokit.rest.projects.getPermissionForUser() is deprecated, see https://docs.github.com/rest/projects/collaborators#get-project-permission-for-a-user"
      }
    ],
    listCards: [
      "GET /projects/columns/{column_id}/cards",
      {},
      {
        deprecated: "octokit.rest.projects.listCards() is deprecated, see https://docs.github.com/rest/projects/cards#list-project-cards"
      }
    ],
    listCollaborators: [
      "GET /projects/{project_id}/collaborators",
      {},
      {
        deprecated: "octokit.rest.projects.listCollaborators() is deprecated, see https://docs.github.com/rest/projects/collaborators#list-project-collaborators"
      }
    ],
    listColumns: [
      "GET /projects/{project_id}/columns",
      {},
      {
        deprecated: "octokit.rest.projects.listColumns() is deprecated, see https://docs.github.com/rest/projects/columns#list-project-columns"
      }
    ],
    listForOrg: [
      "GET /orgs/{org}/projects",
      {},
      {
        deprecated: "octokit.rest.projects.listForOrg() is deprecated, see https://docs.github.com/rest/projects/projects#list-organization-projects"
      }
    ],
    listForRepo: [
      "GET /repos/{owner}/{repo}/projects",
      {},
      {
        deprecated: "octokit.rest.projects.listForRepo() is deprecated, see https://docs.github.com/rest/projects/projects#list-repository-projects"
      }
    ],
    listForUser: [
      "GET /users/{username}/projects",
      {},
      {
        deprecated: "octokit.rest.projects.listForUser() is deprecated, see https://docs.github.com/rest/projects/projects#list-user-projects"
      }
    ],
    moveCard: [
      "POST /projects/columns/cards/{card_id}/moves",
      {},
      {
        deprecated: "octokit.rest.projects.moveCard() is deprecated, see https://docs.github.com/rest/projects/cards#move-a-project-card"
      }
    ],
    moveColumn: [
      "POST /projects/columns/{column_id}/moves",
      {},
      {
        deprecated: "octokit.rest.projects.moveColumn() is deprecated, see https://docs.github.com/rest/projects/columns#move-a-project-column"
      }
    ],
    removeCollaborator: [
      "DELETE /projects/{project_id}/collaborators/{username}",
      {},
      {
        deprecated: "octokit.rest.projects.removeCollaborator() is deprecated, see https://docs.github.com/rest/projects/collaborators#remove-user-as-a-collaborator"
      }
    ],
    update: [
      "PATCH /projects/{project_id}",
      {},
      {
        deprecated: "octokit.rest.projects.update() is deprecated, see https://docs.github.com/rest/projects/projects#update-a-project"
      }
    ],
    updateCard: [
      "PATCH /projects/columns/cards/{card_id}",
      {},
      {
        deprecated: "octokit.rest.projects.updateCard() is deprecated, see https://docs.github.com/rest/projects/cards#update-an-existing-project-card"
      }
    ],
    updateColumn: [
      "PATCH /projects/columns/{column_id}",
      {},
      {
        deprecated: "octokit.rest.projects.updateColumn() is deprecated, see https://docs.github.com/rest/projects/columns#update-an-existing-project-column"
      }
    ]
  },
  pulls: {
    checkIfMerged: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/merge"],
    create: ["POST /repos/{owner}/{repo}/pulls"],
    createReplyForReviewComment: [
      "POST /repos/{owner}/{repo}/pulls/{pull_number}/comments/{comment_id}/replies"
    ],
    createReview: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],
    createReviewComment: [
      "POST /repos/{owner}/{repo}/pulls/{pull_number}/comments"
    ],
    deletePendingReview: [
      "DELETE /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"
    ],
    deleteReviewComment: [
      "DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}"
    ],
    dismissReview: [
      "PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/dismissals"
    ],
    get: ["GET /repos/{owner}/{repo}/pulls/{pull_number}"],
    getReview: [
      "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"
    ],
    getReviewComment: ["GET /repos/{owner}/{repo}/pulls/comments/{comment_id}"],
    list: ["GET /repos/{owner}/{repo}/pulls"],
    listCommentsForReview: [
      "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/comments"
    ],
    listCommits: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/commits"],
    listFiles: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/files"],
    listRequestedReviewers: [
      "GET /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"
    ],
    listReviewComments: [
      "GET /repos/{owner}/{repo}/pulls/{pull_number}/comments"
    ],
    listReviewCommentsForRepo: ["GET /repos/{owner}/{repo}/pulls/comments"],
    listReviews: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],
    merge: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge"],
    removeRequestedReviewers: [
      "DELETE /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"
    ],
    requestReviewers: [
      "POST /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"
    ],
    submitReview: [
      "POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/events"
    ],
    update: ["PATCH /repos/{owner}/{repo}/pulls/{pull_number}"],
    updateBranch: [
      "PUT /repos/{owner}/{repo}/pulls/{pull_number}/update-branch"
    ],
    updateReview: [
      "PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"
    ],
    updateReviewComment: [
      "PATCH /repos/{owner}/{repo}/pulls/comments/{comment_id}"
    ]
  },
  rateLimit: { get: ["GET /rate_limit"] },
  reactions: {
    createForCommitComment: [
      "POST /repos/{owner}/{repo}/comments/{comment_id}/reactions"
    ],
    createForIssue: [
      "POST /repos/{owner}/{repo}/issues/{issue_number}/reactions"
    ],
    createForIssueComment: [
      "POST /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions"
    ],
    createForPullRequestReviewComment: [
      "POST /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions"
    ],
    createForRelease: [
      "POST /repos/{owner}/{repo}/releases/{release_id}/reactions"
    ],
    createForTeamDiscussionCommentInOrg: [
      "POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions"
    ],
    createForTeamDiscussionInOrg: [
      "POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions"
    ],
    deleteForCommitComment: [
      "DELETE /repos/{owner}/{repo}/comments/{comment_id}/reactions/{reaction_id}"
    ],
    deleteForIssue: [
      "DELETE /repos/{owner}/{repo}/issues/{issue_number}/reactions/{reaction_id}"
    ],
    deleteForIssueComment: [
      "DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions/{reaction_id}"
    ],
    deleteForPullRequestComment: [
      "DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions/{reaction_id}"
    ],
    deleteForRelease: [
      "DELETE /repos/{owner}/{repo}/releases/{release_id}/reactions/{reaction_id}"
    ],
    deleteForTeamDiscussion: [
      "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions/{reaction_id}"
    ],
    deleteForTeamDiscussionComment: [
      "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions/{reaction_id}"
    ],
    listForCommitComment: [
      "GET /repos/{owner}/{repo}/comments/{comment_id}/reactions"
    ],
    listForIssue: ["GET /repos/{owner}/{repo}/issues/{issue_number}/reactions"],
    listForIssueComment: [
      "GET /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions"
    ],
    listForPullRequestReviewComment: [
      "GET /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions"
    ],
    listForRelease: [
      "GET /repos/{owner}/{repo}/releases/{release_id}/reactions"
    ],
    listForTeamDiscussionCommentInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions"
    ],
    listForTeamDiscussionInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions"
    ]
  },
  repos: {
    acceptInvitation: [
      "PATCH /user/repository_invitations/{invitation_id}",
      {},
      { renamed: ["repos", "acceptInvitationForAuthenticatedUser"] }
    ],
    acceptInvitationForAuthenticatedUser: [
      "PATCH /user/repository_invitations/{invitation_id}"
    ],
    addAppAccessRestrictions: [
      "POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
      {},
      { mapToData: "apps" }
    ],
    addCollaborator: ["PUT /repos/{owner}/{repo}/collaborators/{username}"],
    addStatusCheckContexts: [
      "POST /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
      {},
      { mapToData: "contexts" }
    ],
    addTeamAccessRestrictions: [
      "POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
      {},
      { mapToData: "teams" }
    ],
    addUserAccessRestrictions: [
      "POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
      {},
      { mapToData: "users" }
    ],
    cancelPagesDeployment: [
      "POST /repos/{owner}/{repo}/pages/deployments/{pages_deployment_id}/cancel"
    ],
    checkAutomatedSecurityFixes: [
      "GET /repos/{owner}/{repo}/automated-security-fixes"
    ],
    checkCollaborator: ["GET /repos/{owner}/{repo}/collaborators/{username}"],
    checkPrivateVulnerabilityReporting: [
      "GET /repos/{owner}/{repo}/private-vulnerability-reporting"
    ],
    checkVulnerabilityAlerts: [
      "GET /repos/{owner}/{repo}/vulnerability-alerts"
    ],
    codeownersErrors: ["GET /repos/{owner}/{repo}/codeowners/errors"],
    compareCommits: ["GET /repos/{owner}/{repo}/compare/{base}...{head}"],
    compareCommitsWithBasehead: [
      "GET /repos/{owner}/{repo}/compare/{basehead}"
    ],
    createAttestation: ["POST /repos/{owner}/{repo}/attestations"],
    createAutolink: ["POST /repos/{owner}/{repo}/autolinks"],
    createCommitComment: [
      "POST /repos/{owner}/{repo}/commits/{commit_sha}/comments"
    ],
    createCommitSignatureProtection: [
      "POST /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures"
    ],
    createCommitStatus: ["POST /repos/{owner}/{repo}/statuses/{sha}"],
    createDeployKey: ["POST /repos/{owner}/{repo}/keys"],
    createDeployment: ["POST /repos/{owner}/{repo}/deployments"],
    createDeploymentBranchPolicy: [
      "POST /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies"
    ],
    createDeploymentProtectionRule: [
      "POST /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules"
    ],
    createDeploymentStatus: [
      "POST /repos/{owner}/{repo}/deployments/{deployment_id}/statuses"
    ],
    createDispatchEvent: ["POST /repos/{owner}/{repo}/dispatches"],
    createForAuthenticatedUser: ["POST /user/repos"],
    createFork: ["POST /repos/{owner}/{repo}/forks"],
    createInOrg: ["POST /orgs/{org}/repos"],
    createOrUpdateCustomPropertiesValues: [
      "PATCH /repos/{owner}/{repo}/properties/values"
    ],
    createOrUpdateEnvironment: [
      "PUT /repos/{owner}/{repo}/environments/{environment_name}"
    ],
    createOrUpdateFileContents: ["PUT /repos/{owner}/{repo}/contents/{path}"],
    createOrgRuleset: ["POST /orgs/{org}/rulesets"],
    createPagesDeployment: ["POST /repos/{owner}/{repo}/pages/deployments"],
    createPagesSite: ["POST /repos/{owner}/{repo}/pages"],
    createRelease: ["POST /repos/{owner}/{repo}/releases"],
    createRepoRuleset: ["POST /repos/{owner}/{repo}/rulesets"],
    createUsingTemplate: [
      "POST /repos/{template_owner}/{template_repo}/generate"
    ],
    createWebhook: ["POST /repos/{owner}/{repo}/hooks"],
    declineInvitation: [
      "DELETE /user/repository_invitations/{invitation_id}",
      {},
      { renamed: ["repos", "declineInvitationForAuthenticatedUser"] }
    ],
    declineInvitationForAuthenticatedUser: [
      "DELETE /user/repository_invitations/{invitation_id}"
    ],
    delete: ["DELETE /repos/{owner}/{repo}"],
    deleteAccessRestrictions: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions"
    ],
    deleteAdminBranchProtection: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"
    ],
    deleteAnEnvironment: [
      "DELETE /repos/{owner}/{repo}/environments/{environment_name}"
    ],
    deleteAutolink: ["DELETE /repos/{owner}/{repo}/autolinks/{autolink_id}"],
    deleteBranchProtection: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection"
    ],
    deleteCommitComment: ["DELETE /repos/{owner}/{repo}/comments/{comment_id}"],
    deleteCommitSignatureProtection: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures"
    ],
    deleteDeployKey: ["DELETE /repos/{owner}/{repo}/keys/{key_id}"],
    deleteDeployment: [
      "DELETE /repos/{owner}/{repo}/deployments/{deployment_id}"
    ],
    deleteDeploymentBranchPolicy: [
      "DELETE /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}"
    ],
    deleteFile: ["DELETE /repos/{owner}/{repo}/contents/{path}"],
    deleteInvitation: [
      "DELETE /repos/{owner}/{repo}/invitations/{invitation_id}"
    ],
    deleteOrgRuleset: ["DELETE /orgs/{org}/rulesets/{ruleset_id}"],
    deletePagesSite: ["DELETE /repos/{owner}/{repo}/pages"],
    deletePullRequestReviewProtection: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"
    ],
    deleteRelease: ["DELETE /repos/{owner}/{repo}/releases/{release_id}"],
    deleteReleaseAsset: [
      "DELETE /repos/{owner}/{repo}/releases/assets/{asset_id}"
    ],
    deleteRepoRuleset: ["DELETE /repos/{owner}/{repo}/rulesets/{ruleset_id}"],
    deleteWebhook: ["DELETE /repos/{owner}/{repo}/hooks/{hook_id}"],
    disableAutomatedSecurityFixes: [
      "DELETE /repos/{owner}/{repo}/automated-security-fixes"
    ],
    disableDeploymentProtectionRule: [
      "DELETE /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/{protection_rule_id}"
    ],
    disablePrivateVulnerabilityReporting: [
      "DELETE /repos/{owner}/{repo}/private-vulnerability-reporting"
    ],
    disableVulnerabilityAlerts: [
      "DELETE /repos/{owner}/{repo}/vulnerability-alerts"
    ],
    downloadArchive: [
      "GET /repos/{owner}/{repo}/zipball/{ref}",
      {},
      { renamed: ["repos", "downloadZipballArchive"] }
    ],
    downloadTarballArchive: ["GET /repos/{owner}/{repo}/tarball/{ref}"],
    downloadZipballArchive: ["GET /repos/{owner}/{repo}/zipball/{ref}"],
    enableAutomatedSecurityFixes: [
      "PUT /repos/{owner}/{repo}/automated-security-fixes"
    ],
    enablePrivateVulnerabilityReporting: [
      "PUT /repos/{owner}/{repo}/private-vulnerability-reporting"
    ],
    enableVulnerabilityAlerts: [
      "PUT /repos/{owner}/{repo}/vulnerability-alerts"
    ],
    generateReleaseNotes: [
      "POST /repos/{owner}/{repo}/releases/generate-notes"
    ],
    get: ["GET /repos/{owner}/{repo}"],
    getAccessRestrictions: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions"
    ],
    getAdminBranchProtection: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"
    ],
    getAllDeploymentProtectionRules: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules"
    ],
    getAllEnvironments: ["GET /repos/{owner}/{repo}/environments"],
    getAllStatusCheckContexts: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts"
    ],
    getAllTopics: ["GET /repos/{owner}/{repo}/topics"],
    getAppsWithAccessToProtectedBranch: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps"
    ],
    getAutolink: ["GET /repos/{owner}/{repo}/autolinks/{autolink_id}"],
    getBranch: ["GET /repos/{owner}/{repo}/branches/{branch}"],
    getBranchProtection: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection"
    ],
    getBranchRules: ["GET /repos/{owner}/{repo}/rules/branches/{branch}"],
    getClones: ["GET /repos/{owner}/{repo}/traffic/clones"],
    getCodeFrequencyStats: ["GET /repos/{owner}/{repo}/stats/code_frequency"],
    getCollaboratorPermissionLevel: [
      "GET /repos/{owner}/{repo}/collaborators/{username}/permission"
    ],
    getCombinedStatusForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/status"],
    getCommit: ["GET /repos/{owner}/{repo}/commits/{ref}"],
    getCommitActivityStats: ["GET /repos/{owner}/{repo}/stats/commit_activity"],
    getCommitComment: ["GET /repos/{owner}/{repo}/comments/{comment_id}"],
    getCommitSignatureProtection: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures"
    ],
    getCommunityProfileMetrics: ["GET /repos/{owner}/{repo}/community/profile"],
    getContent: ["GET /repos/{owner}/{repo}/contents/{path}"],
    getContributorsStats: ["GET /repos/{owner}/{repo}/stats/contributors"],
    getCustomDeploymentProtectionRule: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/{protection_rule_id}"
    ],
    getCustomPropertiesValues: ["GET /repos/{owner}/{repo}/properties/values"],
    getDeployKey: ["GET /repos/{owner}/{repo}/keys/{key_id}"],
    getDeployment: ["GET /repos/{owner}/{repo}/deployments/{deployment_id}"],
    getDeploymentBranchPolicy: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}"
    ],
    getDeploymentStatus: [
      "GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses/{status_id}"
    ],
    getEnvironment: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}"
    ],
    getLatestPagesBuild: ["GET /repos/{owner}/{repo}/pages/builds/latest"],
    getLatestRelease: ["GET /repos/{owner}/{repo}/releases/latest"],
    getOrgRuleSuite: ["GET /orgs/{org}/rulesets/rule-suites/{rule_suite_id}"],
    getOrgRuleSuites: ["GET /orgs/{org}/rulesets/rule-suites"],
    getOrgRuleset: ["GET /orgs/{org}/rulesets/{ruleset_id}"],
    getOrgRulesets: ["GET /orgs/{org}/rulesets"],
    getPages: ["GET /repos/{owner}/{repo}/pages"],
    getPagesBuild: ["GET /repos/{owner}/{repo}/pages/builds/{build_id}"],
    getPagesDeployment: [
      "GET /repos/{owner}/{repo}/pages/deployments/{pages_deployment_id}"
    ],
    getPagesHealthCheck: ["GET /repos/{owner}/{repo}/pages/health"],
    getParticipationStats: ["GET /repos/{owner}/{repo}/stats/participation"],
    getPullRequestReviewProtection: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"
    ],
    getPunchCardStats: ["GET /repos/{owner}/{repo}/stats/punch_card"],
    getReadme: ["GET /repos/{owner}/{repo}/readme"],
    getReadmeInDirectory: ["GET /repos/{owner}/{repo}/readme/{dir}"],
    getRelease: ["GET /repos/{owner}/{repo}/releases/{release_id}"],
    getReleaseAsset: ["GET /repos/{owner}/{repo}/releases/assets/{asset_id}"],
    getReleaseByTag: ["GET /repos/{owner}/{repo}/releases/tags/{tag}"],
    getRepoRuleSuite: [
      "GET /repos/{owner}/{repo}/rulesets/rule-suites/{rule_suite_id}"
    ],
    getRepoRuleSuites: ["GET /repos/{owner}/{repo}/rulesets/rule-suites"],
    getRepoRuleset: ["GET /repos/{owner}/{repo}/rulesets/{ruleset_id}"],
    getRepoRulesetHistory: [
      "GET /repos/{owner}/{repo}/rulesets/{ruleset_id}/history"
    ],
    getRepoRulesetVersion: [
      "GET /repos/{owner}/{repo}/rulesets/{ruleset_id}/history/{version_id}"
    ],
    getRepoRulesets: ["GET /repos/{owner}/{repo}/rulesets"],
    getStatusChecksProtection: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"
    ],
    getTeamsWithAccessToProtectedBranch: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams"
    ],
    getTopPaths: ["GET /repos/{owner}/{repo}/traffic/popular/paths"],
    getTopReferrers: ["GET /repos/{owner}/{repo}/traffic/popular/referrers"],
    getUsersWithAccessToProtectedBranch: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users"
    ],
    getViews: ["GET /repos/{owner}/{repo}/traffic/views"],
    getWebhook: ["GET /repos/{owner}/{repo}/hooks/{hook_id}"],
    getWebhookConfigForRepo: [
      "GET /repos/{owner}/{repo}/hooks/{hook_id}/config"
    ],
    getWebhookDelivery: [
      "GET /repos/{owner}/{repo}/hooks/{hook_id}/deliveries/{delivery_id}"
    ],
    listActivities: ["GET /repos/{owner}/{repo}/activity"],
    listAttestations: [
      "GET /repos/{owner}/{repo}/attestations/{subject_digest}"
    ],
    listAutolinks: ["GET /repos/{owner}/{repo}/autolinks"],
    listBranches: ["GET /repos/{owner}/{repo}/branches"],
    listBranchesForHeadCommit: [
      "GET /repos/{owner}/{repo}/commits/{commit_sha}/branches-where-head"
    ],
    listCollaborators: ["GET /repos/{owner}/{repo}/collaborators"],
    listCommentsForCommit: [
      "GET /repos/{owner}/{repo}/commits/{commit_sha}/comments"
    ],
    listCommitCommentsForRepo: ["GET /repos/{owner}/{repo}/comments"],
    listCommitStatusesForRef: [
      "GET /repos/{owner}/{repo}/commits/{ref}/statuses"
    ],
    listCommits: ["GET /repos/{owner}/{repo}/commits"],
    listContributors: ["GET /repos/{owner}/{repo}/contributors"],
    listCustomDeploymentRuleIntegrations: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/apps"
    ],
    listDeployKeys: ["GET /repos/{owner}/{repo}/keys"],
    listDeploymentBranchPolicies: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies"
    ],
    listDeploymentStatuses: [
      "GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses"
    ],
    listDeployments: ["GET /repos/{owner}/{repo}/deployments"],
    listForAuthenticatedUser: ["GET /user/repos"],
    listForOrg: ["GET /orgs/{org}/repos"],
    listForUser: ["GET /users/{username}/repos"],
    listForks: ["GET /repos/{owner}/{repo}/forks"],
    listInvitations: ["GET /repos/{owner}/{repo}/invitations"],
    listInvitationsForAuthenticatedUser: ["GET /user/repository_invitations"],
    listLanguages: ["GET /repos/{owner}/{repo}/languages"],
    listPagesBuilds: ["GET /repos/{owner}/{repo}/pages/builds"],
    listPublic: ["GET /repositories"],
    listPullRequestsAssociatedWithCommit: [
      "GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls"
    ],
    listReleaseAssets: [
      "GET /repos/{owner}/{repo}/releases/{release_id}/assets"
    ],
    listReleases: ["GET /repos/{owner}/{repo}/releases"],
    listTags: ["GET /repos/{owner}/{repo}/tags"],
    listTeams: ["GET /repos/{owner}/{repo}/teams"],
    listWebhookDeliveries: [
      "GET /repos/{owner}/{repo}/hooks/{hook_id}/deliveries"
    ],
    listWebhooks: ["GET /repos/{owner}/{repo}/hooks"],
    merge: ["POST /repos/{owner}/{repo}/merges"],
    mergeUpstream: ["POST /repos/{owner}/{repo}/merge-upstream"],
    pingWebhook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/pings"],
    redeliverWebhookDelivery: [
      "POST /repos/{owner}/{repo}/hooks/{hook_id}/deliveries/{delivery_id}/attempts"
    ],
    removeAppAccessRestrictions: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
      {},
      { mapToData: "apps" }
    ],
    removeCollaborator: [
      "DELETE /repos/{owner}/{repo}/collaborators/{username}"
    ],
    removeStatusCheckContexts: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
      {},
      { mapToData: "contexts" }
    ],
    removeStatusCheckProtection: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"
    ],
    removeTeamAccessRestrictions: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
      {},
      { mapToData: "teams" }
    ],
    removeUserAccessRestrictions: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
      {},
      { mapToData: "users" }
    ],
    renameBranch: ["POST /repos/{owner}/{repo}/branches/{branch}/rename"],
    replaceAllTopics: ["PUT /repos/{owner}/{repo}/topics"],
    requestPagesBuild: ["POST /repos/{owner}/{repo}/pages/builds"],
    setAdminBranchProtection: [
      "POST /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"
    ],
    setAppAccessRestrictions: [
      "PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
      {},
      { mapToData: "apps" }
    ],
    setStatusCheckContexts: [
      "PUT /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
      {},
      { mapToData: "contexts" }
    ],
    setTeamAccessRestrictions: [
      "PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
      {},
      { mapToData: "teams" }
    ],
    setUserAccessRestrictions: [
      "PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
      {},
      { mapToData: "users" }
    ],
    testPushWebhook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/tests"],
    transfer: ["POST /repos/{owner}/{repo}/transfer"],
    update: ["PATCH /repos/{owner}/{repo}"],
    updateBranchProtection: [
      "PUT /repos/{owner}/{repo}/branches/{branch}/protection"
    ],
    updateCommitComment: ["PATCH /repos/{owner}/{repo}/comments/{comment_id}"],
    updateDeploymentBranchPolicy: [
      "PUT /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}"
    ],
    updateInformationAboutPagesSite: ["PUT /repos/{owner}/{repo}/pages"],
    updateInvitation: [
      "PATCH /repos/{owner}/{repo}/invitations/{invitation_id}"
    ],
    updateOrgRuleset: ["PUT /orgs/{org}/rulesets/{ruleset_id}"],
    updatePullRequestReviewProtection: [
      "PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"
    ],
    updateRelease: ["PATCH /repos/{owner}/{repo}/releases/{release_id}"],
    updateReleaseAsset: [
      "PATCH /repos/{owner}/{repo}/releases/assets/{asset_id}"
    ],
    updateRepoRuleset: ["PUT /repos/{owner}/{repo}/rulesets/{ruleset_id}"],
    updateStatusCheckPotection: [
      "PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks",
      {},
      { renamed: ["repos", "updateStatusCheckProtection"] }
    ],
    updateStatusCheckProtection: [
      "PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"
    ],
    updateWebhook: ["PATCH /repos/{owner}/{repo}/hooks/{hook_id}"],
    updateWebhookConfigForRepo: [
      "PATCH /repos/{owner}/{repo}/hooks/{hook_id}/config"
    ],
    uploadReleaseAsset: [
      "POST /repos/{owner}/{repo}/releases/{release_id}/assets{?name,label}",
      { baseUrl: "https://uploads.github.com" }
    ]
  },
  search: {
    code: ["GET /search/code"],
    commits: ["GET /search/commits"],
    issuesAndPullRequests: [
      "GET /search/issues",
      {},
      {
        deprecated: "octokit.rest.search.issuesAndPullRequests() is deprecated, see https://docs.github.com/rest/search/search#search-issues-and-pull-requests"
      }
    ],
    labels: ["GET /search/labels"],
    repos: ["GET /search/repositories"],
    topics: ["GET /search/topics"],
    users: ["GET /search/users"]
  },
  secretScanning: {
    createPushProtectionBypass: [
      "POST /repos/{owner}/{repo}/secret-scanning/push-protection-bypasses"
    ],
    getAlert: [
      "GET /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}"
    ],
    getScanHistory: ["GET /repos/{owner}/{repo}/secret-scanning/scan-history"],
    listAlertsForEnterprise: [
      "GET /enterprises/{enterprise}/secret-scanning/alerts"
    ],
    listAlertsForOrg: ["GET /orgs/{org}/secret-scanning/alerts"],
    listAlertsForRepo: ["GET /repos/{owner}/{repo}/secret-scanning/alerts"],
    listLocationsForAlert: [
      "GET /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}/locations"
    ],
    updateAlert: [
      "PATCH /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}"
    ]
  },
  securityAdvisories: {
    createFork: [
      "POST /repos/{owner}/{repo}/security-advisories/{ghsa_id}/forks"
    ],
    createPrivateVulnerabilityReport: [
      "POST /repos/{owner}/{repo}/security-advisories/reports"
    ],
    createRepositoryAdvisory: [
      "POST /repos/{owner}/{repo}/security-advisories"
    ],
    createRepositoryAdvisoryCveRequest: [
      "POST /repos/{owner}/{repo}/security-advisories/{ghsa_id}/cve"
    ],
    getGlobalAdvisory: ["GET /advisories/{ghsa_id}"],
    getRepositoryAdvisory: [
      "GET /repos/{owner}/{repo}/security-advisories/{ghsa_id}"
    ],
    listGlobalAdvisories: ["GET /advisories"],
    listOrgRepositoryAdvisories: ["GET /orgs/{org}/security-advisories"],
    listRepositoryAdvisories: ["GET /repos/{owner}/{repo}/security-advisories"],
    updateRepositoryAdvisory: [
      "PATCH /repos/{owner}/{repo}/security-advisories/{ghsa_id}"
    ]
  },
  teams: {
    addOrUpdateMembershipForUserInOrg: [
      "PUT /orgs/{org}/teams/{team_slug}/memberships/{username}"
    ],
    addOrUpdateProjectPermissionsInOrg: [
      "PUT /orgs/{org}/teams/{team_slug}/projects/{project_id}",
      {},
      {
        deprecated: "octokit.rest.teams.addOrUpdateProjectPermissionsInOrg() is deprecated, see https://docs.github.com/rest/teams/teams#add-or-update-team-project-permissions"
      }
    ],
    addOrUpdateProjectPermissionsLegacy: [
      "PUT /teams/{team_id}/projects/{project_id}",
      {},
      {
        deprecated: "octokit.rest.teams.addOrUpdateProjectPermissionsLegacy() is deprecated, see https://docs.github.com/rest/teams/teams#add-or-update-team-project-permissions-legacy"
      }
    ],
    addOrUpdateRepoPermissionsInOrg: [
      "PUT /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"
    ],
    checkPermissionsForProjectInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/projects/{project_id}",
      {},
      {
        deprecated: "octokit.rest.teams.checkPermissionsForProjectInOrg() is deprecated, see https://docs.github.com/rest/teams/teams#check-team-permissions-for-a-project"
      }
    ],
    checkPermissionsForProjectLegacy: [
      "GET /teams/{team_id}/projects/{project_id}",
      {},
      {
        deprecated: "octokit.rest.teams.checkPermissionsForProjectLegacy() is deprecated, see https://docs.github.com/rest/teams/teams#check-team-permissions-for-a-project-legacy"
      }
    ],
    checkPermissionsForRepoInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"
    ],
    create: ["POST /orgs/{org}/teams"],
    createDiscussionCommentInOrg: [
      "POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments"
    ],
    createDiscussionInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions"],
    deleteDiscussionCommentInOrg: [
      "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"
    ],
    deleteDiscussionInOrg: [
      "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"
    ],
    deleteInOrg: ["DELETE /orgs/{org}/teams/{team_slug}"],
    getByName: ["GET /orgs/{org}/teams/{team_slug}"],
    getDiscussionCommentInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"
    ],
    getDiscussionInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"
    ],
    getMembershipForUserInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/memberships/{username}"
    ],
    list: ["GET /orgs/{org}/teams"],
    listChildInOrg: ["GET /orgs/{org}/teams/{team_slug}/teams"],
    listDiscussionCommentsInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments"
    ],
    listDiscussionsInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions"],
    listForAuthenticatedUser: ["GET /user/teams"],
    listMembersInOrg: ["GET /orgs/{org}/teams/{team_slug}/members"],
    listPendingInvitationsInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/invitations"
    ],
    listProjectsInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/projects",
      {},
      {
        deprecated: "octokit.rest.teams.listProjectsInOrg() is deprecated, see https://docs.github.com/rest/teams/teams#list-team-projects"
      }
    ],
    listProjectsLegacy: [
      "GET /teams/{team_id}/projects",
      {},
      {
        deprecated: "octokit.rest.teams.listProjectsLegacy() is deprecated, see https://docs.github.com/rest/teams/teams#list-team-projects-legacy"
      }
    ],
    listReposInOrg: ["GET /orgs/{org}/teams/{team_slug}/repos"],
    removeMembershipForUserInOrg: [
      "DELETE /orgs/{org}/teams/{team_slug}/memberships/{username}"
    ],
    removeProjectInOrg: [
      "DELETE /orgs/{org}/teams/{team_slug}/projects/{project_id}",
      {},
      {
        deprecated: "octokit.rest.teams.removeProjectInOrg() is deprecated, see https://docs.github.com/rest/teams/teams#remove-a-project-from-a-team"
      }
    ],
    removeProjectLegacy: [
      "DELETE /teams/{team_id}/projects/{project_id}",
      {},
      {
        deprecated: "octokit.rest.teams.removeProjectLegacy() is deprecated, see https://docs.github.com/rest/teams/teams#remove-a-project-from-a-team-legacy"
      }
    ],
    removeRepoInOrg: [
      "DELETE /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"
    ],
    updateDiscussionCommentInOrg: [
      "PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"
    ],
    updateDiscussionInOrg: [
      "PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"
    ],
    updateInOrg: ["PATCH /orgs/{org}/teams/{team_slug}"]
  },
  users: {
    addEmailForAuthenticated: [
      "POST /user/emails",
      {},
      { renamed: ["users", "addEmailForAuthenticatedUser"] }
    ],
    addEmailForAuthenticatedUser: ["POST /user/emails"],
    addSocialAccountForAuthenticatedUser: ["POST /user/social_accounts"],
    block: ["PUT /user/blocks/{username}"],
    checkBlocked: ["GET /user/blocks/{username}"],
    checkFollowingForUser: ["GET /users/{username}/following/{target_user}"],
    checkPersonIsFollowedByAuthenticated: ["GET /user/following/{username}"],
    createGpgKeyForAuthenticated: [
      "POST /user/gpg_keys",
      {},
      { renamed: ["users", "createGpgKeyForAuthenticatedUser"] }
    ],
    createGpgKeyForAuthenticatedUser: ["POST /user/gpg_keys"],
    createPublicSshKeyForAuthenticated: [
      "POST /user/keys",
      {},
      { renamed: ["users", "createPublicSshKeyForAuthenticatedUser"] }
    ],
    createPublicSshKeyForAuthenticatedUser: ["POST /user/keys"],
    createSshSigningKeyForAuthenticatedUser: ["POST /user/ssh_signing_keys"],
    deleteEmailForAuthenticated: [
      "DELETE /user/emails",
      {},
      { renamed: ["users", "deleteEmailForAuthenticatedUser"] }
    ],
    deleteEmailForAuthenticatedUser: ["DELETE /user/emails"],
    deleteGpgKeyForAuthenticated: [
      "DELETE /user/gpg_keys/{gpg_key_id}",
      {},
      { renamed: ["users", "deleteGpgKeyForAuthenticatedUser"] }
    ],
    deleteGpgKeyForAuthenticatedUser: ["DELETE /user/gpg_keys/{gpg_key_id}"],
    deletePublicSshKeyForAuthenticated: [
      "DELETE /user/keys/{key_id}",
      {},
      { renamed: ["users", "deletePublicSshKeyForAuthenticatedUser"] }
    ],
    deletePublicSshKeyForAuthenticatedUser: ["DELETE /user/keys/{key_id}"],
    deleteSocialAccountForAuthenticatedUser: ["DELETE /user/social_accounts"],
    deleteSshSigningKeyForAuthenticatedUser: [
      "DELETE /user/ssh_signing_keys/{ssh_signing_key_id}"
    ],
    follow: ["PUT /user/following/{username}"],
    getAuthenticated: ["GET /user"],
    getById: ["GET /user/{account_id}"],
    getByUsername: ["GET /users/{username}"],
    getContextForUser: ["GET /users/{username}/hovercard"],
    getGpgKeyForAuthenticated: [
      "GET /user/gpg_keys/{gpg_key_id}",
      {},
      { renamed: ["users", "getGpgKeyForAuthenticatedUser"] }
    ],
    getGpgKeyForAuthenticatedUser: ["GET /user/gpg_keys/{gpg_key_id}"],
    getPublicSshKeyForAuthenticated: [
      "GET /user/keys/{key_id}",
      {},
      { renamed: ["users", "getPublicSshKeyForAuthenticatedUser"] }
    ],
    getPublicSshKeyForAuthenticatedUser: ["GET /user/keys/{key_id}"],
    getSshSigningKeyForAuthenticatedUser: [
      "GET /user/ssh_signing_keys/{ssh_signing_key_id}"
    ],
    list: ["GET /users"],
    listAttestations: ["GET /users/{username}/attestations/{subject_digest}"],
    listBlockedByAuthenticated: [
      "GET /user/blocks",
      {},
      { renamed: ["users", "listBlockedByAuthenticatedUser"] }
    ],
    listBlockedByAuthenticatedUser: ["GET /user/blocks"],
    listEmailsForAuthenticated: [
      "GET /user/emails",
      {},
      { renamed: ["users", "listEmailsForAuthenticatedUser"] }
    ],
    listEmailsForAuthenticatedUser: ["GET /user/emails"],
    listFollowedByAuthenticated: [
      "GET /user/following",
      {},
      { renamed: ["users", "listFollowedByAuthenticatedUser"] }
    ],
    listFollowedByAuthenticatedUser: ["GET /user/following"],
    listFollowersForAuthenticatedUser: ["GET /user/followers"],
    listFollowersForUser: ["GET /users/{username}/followers"],
    listFollowingForUser: ["GET /users/{username}/following"],
    listGpgKeysForAuthenticated: [
      "GET /user/gpg_keys",
      {},
      { renamed: ["users", "listGpgKeysForAuthenticatedUser"] }
    ],
    listGpgKeysForAuthenticatedUser: ["GET /user/gpg_keys"],
    listGpgKeysForUser: ["GET /users/{username}/gpg_keys"],
    listPublicEmailsForAuthenticated: [
      "GET /user/public_emails",
      {},
      { renamed: ["users", "listPublicEmailsForAuthenticatedUser"] }
    ],
    listPublicEmailsForAuthenticatedUser: ["GET /user/public_emails"],
    listPublicKeysForUser: ["GET /users/{username}/keys"],
    listPublicSshKeysForAuthenticated: [
      "GET /user/keys",
      {},
      { renamed: ["users", "listPublicSshKeysForAuthenticatedUser"] }
    ],
    listPublicSshKeysForAuthenticatedUser: ["GET /user/keys"],
    listSocialAccountsForAuthenticatedUser: ["GET /user/social_accounts"],
    listSocialAccountsForUser: ["GET /users/{username}/social_accounts"],
    listSshSigningKeysForAuthenticatedUser: ["GET /user/ssh_signing_keys"],
    listSshSigningKeysForUser: ["GET /users/{username}/ssh_signing_keys"],
    setPrimaryEmailVisibilityForAuthenticated: [
      "PATCH /user/email/visibility",
      {},
      { renamed: ["users", "setPrimaryEmailVisibilityForAuthenticatedUser"] }
    ],
    setPrimaryEmailVisibilityForAuthenticatedUser: [
      "PATCH /user/email/visibility"
    ],
    unblock: ["DELETE /user/blocks/{username}"],
    unfollow: ["DELETE /user/following/{username}"],
    updateAuthenticated: ["PATCH /user"]
  }
};
var endpoints_default = Endpoints;

// node_modules/@octokit/plugin-rest-endpoint-methods/dist-src/endpoints-to-methods.js
var endpointMethodsMap = /* @__PURE__ */ new Map();
for (const [scope, endpoints] of Object.entries(endpoints_default)) {
  for (const [methodName, endpoint2] of Object.entries(endpoints)) {
    const [route, defaults, decorations] = endpoint2;
    const [method, url] = route.split(/ /);
    const endpointDefaults = Object.assign(
      {
        method,
        url
      },
      defaults
    );
    if (!endpointMethodsMap.has(scope)) {
      endpointMethodsMap.set(scope, /* @__PURE__ */ new Map());
    }
    endpointMethodsMap.get(scope).set(methodName, {
      scope,
      methodName,
      endpointDefaults,
      decorations
    });
  }
}
var handler = {
  has({ scope }, methodName) {
    return endpointMethodsMap.get(scope).has(methodName);
  },
  getOwnPropertyDescriptor(target, methodName) {
    return {
      value: this.get(target, methodName),
      // ensures method is in the cache
      configurable: true,
      writable: true,
      enumerable: true
    };
  },
  defineProperty(target, methodName, descriptor) {
    Object.defineProperty(target.cache, methodName, descriptor);
    return true;
  },
  deleteProperty(target, methodName) {
    delete target.cache[methodName];
    return true;
  },
  ownKeys({ scope }) {
    return [...endpointMethodsMap.get(scope).keys()];
  },
  set(target, methodName, value) {
    return target.cache[methodName] = value;
  },
  get({ octokit, scope, cache }, methodName) {
    if (cache[methodName]) {
      return cache[methodName];
    }
    const method = endpointMethodsMap.get(scope).get(methodName);
    if (!method) {
      return void 0;
    }
    const { endpointDefaults, decorations } = method;
    if (decorations) {
      cache[methodName] = decorate(
        octokit,
        scope,
        methodName,
        endpointDefaults,
        decorations
      );
    } else {
      cache[methodName] = octokit.request.defaults(endpointDefaults);
    }
    return cache[methodName];
  }
};
function endpointsToMethods(octokit) {
  const newMethods = {};
  for (const scope of endpointMethodsMap.keys()) {
    newMethods[scope] = new Proxy({ octokit, scope, cache: {} }, handler);
  }
  return newMethods;
}
function decorate(octokit, scope, methodName, defaults, decorations) {
  const requestWithDefaults = octokit.request.defaults(defaults);
  function withDecorations(...args) {
    let options = requestWithDefaults.endpoint.merge(...args);
    if (decorations.mapToData) {
      options = Object.assign({}, options, {
        data: options[decorations.mapToData],
        [decorations.mapToData]: void 0
      });
      return requestWithDefaults(options);
    }
    if (decorations.renamed) {
      const [newScope, newMethodName] = decorations.renamed;
      octokit.log.warn(
        `octokit.${scope}.${methodName}() has been renamed to octokit.${newScope}.${newMethodName}()`
      );
    }
    if (decorations.deprecated) {
      octokit.log.warn(decorations.deprecated);
    }
    if (decorations.renamedParameters) {
      const options2 = requestWithDefaults.endpoint.merge(...args);
      for (const [name, alias] of Object.entries(
        decorations.renamedParameters
      )) {
        if (name in options2) {
          octokit.log.warn(
            `"${name}" parameter is deprecated for "octokit.${scope}.${methodName}()". Use "${alias}" instead`
          );
          if (!(alias in options2)) {
            options2[alias] = options2[name];
          }
          delete options2[name];
        }
      }
      return requestWithDefaults(options2);
    }
    return requestWithDefaults(...args);
  }
  return Object.assign(withDecorations, requestWithDefaults);
}

// node_modules/@octokit/plugin-rest-endpoint-methods/dist-src/index.js
function restEndpointMethods(octokit) {
  const api = endpointsToMethods(octokit);
  return {
    rest: api
  };
}
restEndpointMethods.VERSION = VERSION7;
function legacyRestEndpointMethods(octokit) {
  const api = endpointsToMethods(octokit);
  return {
    ...api,
    rest: api
  };
}
legacyRestEndpointMethods.VERSION = VERSION7;

// node_modules/@octokit/rest/dist-src/version.js
var VERSION8 = "21.1.1";

// node_modules/@octokit/rest/dist-src/index.js
var Octokit2 = Octokit.plugin(requestLog, legacyRestEndpointMethods, paginateRest).defaults(
  {
    userAgent: `octokit-rest.js/${VERSION8}`
  }
);

// src/extension/octokitProvider.ts
var vscode4 = __toESM(require("vscode"), 1);
var OctokitProvider = class {
  constructor() {
    this._onDidChange = new vscode4.EventEmitter();
    this.onDidChange = this._onDidChange.event;
    this._octokit = new Octokit2();
    this._isAuthenticated = false;
  }
  async lib(createIfNone) {
    const oldIsAuth = this._isAuthenticated;
    try {
      const session = await vscode4.authentication.getSession("github", ["repo"], { createIfNone });
      if (session) {
        this._octokit = new Octokit2({ auth: session.accessToken });
        this._isAuthenticated = true;
      }
    } catch (err) {
      this._isAuthenticated = false;
      console.warn("FAILED TO AUTHENTICATE");
      console.warn(err);
    }
    if (oldIsAuth !== this._isAuthenticated) {
      this._onDidChange.fire(this);
    }
    return this._octokit;
  }
  get isAuthenticated() {
    return this._isAuthenticated;
  }
};

// src/extension/project.ts
var vscode5 = __toESM(require("vscode"), 1);

// src/extension/parser/parser.ts
var Parser = class {
  constructor() {
    this._scanner = new Scanner();
    this._token = { type: "EOF" /* EOF */, start: 0, end: 0 };
  }
  _accept(type) {
    if (this._token.type === "EOF" /* EOF */) {
      return void 0;
    }
    if (this._token.type === type) {
      const value = this._token;
      this._token = this._scanner.next();
      return value;
    }
  }
  _reset(token) {
    this._scanner.resetPosition(token);
    this._token = this._scanner.next();
  }
  parse(value, id = Date.now().toString()) {
    const nodes = [];
    this._scanner.reset(value);
    this._token = this._scanner.next();
    while (this._token.type !== "EOF" /* EOF */) {
      if (this._accept("Whitespace" /* Whitespace */) || this._accept("NewLine" /* NewLine */)) {
        continue;
      }
      const node = this._parseVariableDefinition() ?? this._parseQuery(true);
      if (node) {
        nodes.push(node);
      }
    }
    return {
      _type: "QueryDocument" /* QueryDocument */,
      start: 0,
      end: value.length,
      nodes,
      text: value,
      id
    };
  }
  _parseQuery(allowOR) {
    const start = this._token.start;
    const nodes = [];
    while (this._token.type !== "NewLine" /* NewLine */ && this._token.type !== "EOF" /* EOF */) {
      if (this._accept("Whitespace" /* Whitespace */) || this._accept("LineComment" /* LineComment */)) {
        continue;
      }
      const orTkn = allowOR && nodes.length > 0 && this._accept("OR" /* OR */);
      if (orTkn) {
        const anchor = this._token;
        const right = this._parseQuery(allowOR);
        if (right) {
          const left = {
            _type: "Query" /* Query */,
            start,
            end: nodes[nodes.length - 1].end,
            nodes
          };
          return {
            _type: "OrExpression" /* OrExpression */,
            or: orTkn,
            start: left.start,
            end: right?.end || orTkn.end,
            left,
            right
          };
        }
        this._reset(anchor);
        nodes.push({
          _type: "Any" /* Any */,
          tokenType: orTkn.type,
          start: orTkn.start,
          end: orTkn.end
        });
      }
      const node = this._parseQualifiedValue() ?? this._parseNumber() ?? this._parseDate() ?? this._parseVariableName() ?? this._parseLiteral() ?? this._parseAny(this._token.type);
      if (!node) {
        continue;
      }
      nodes.push(node);
    }
    if (nodes.length === 0) {
      return void 0;
    }
    return {
      _type: "Query" /* Query */,
      start,
      end: nodes[nodes.length - 1].end,
      nodes
    };
  }
  _parseAny(type) {
    const token = this._accept(type);
    if (token) {
      return {
        _type: "Any" /* Any */,
        start: token.start,
        end: token.end,
        tokenType: token.type
      };
    }
  }
  _parseLiteralOrLiteralSequence() {
    const literal = this._parseLiteral();
    if (!literal) {
      return literal;
    }
    let comma = this._accept("Comma" /* Comma */);
    if (!comma) {
      return literal;
    }
    const nodes = [literal];
    do {
      const next = this._parseLiteral();
      if (!next) {
        break;
      }
      nodes.push(next);
      comma = this._accept("Comma" /* Comma */);
    } while (comma);
    return {
      _type: "LiteralSequence" /* LiteralSequence */,
      start: literal.start,
      end: nodes[nodes.length - 1].end,
      nodes
    };
  }
  _parseLiteral() {
    const token = this._accept("Literal" /* Literal */) || this._accept("QuotedLiteral" /* QuotedLiteral */);
    if (!token) {
      return void 0;
    }
    return {
      _type: "Literal" /* Literal */,
      start: token.start,
      end: token.end,
      value: this._scanner.value(token)
    };
  }
  _parseNumberLiteral() {
    let tk = this._accept("Number" /* Number */);
    if (!tk) {
      return void 0;
    }
    let value = this._scanner.value(tk);
    let end = tk.end;
    while (this._token.type !== "Whitespace" /* Whitespace */ && this._token.type !== "EOF" /* EOF */) {
      value += this._scanner.value(this._token);
      end = this._token.end;
      this._accept(this._token.type);
    }
    if (end === tk.end) {
      return {
        _type: "Number" /* Number */,
        start: tk.start,
        end,
        value: Number(this._scanner.value(tk))
      };
    }
    return {
      _type: "Literal" /* Literal */,
      start: tk.start,
      end,
      value
    };
  }
  _parseNumber() {
    const tk = this._accept("Number" /* Number */);
    if (!tk) {
      return void 0;
    }
    return {
      _type: "Number" /* Number */,
      start: tk.start,
      end: tk.end,
      value: Number(this._scanner.value(tk))
    };
  }
  _parseDate() {
    const tk = this._accept("Date" /* Date */) || this._accept("DateTime" /* DateTime */);
    if (!tk) {
      return void 0;
    }
    return {
      _type: "Date" /* Date */,
      start: tk.start,
      end: tk.end,
      value: this._scanner.value(tk)
    };
  }
  _parseCompare() {
    const cmp2 = this._accept("LessThan" /* LessThan */) ?? this._accept("LessThanEqual" /* LessThanEqual */) ?? this._accept("GreaterThan" /* GreaterThan */) ?? this._accept("GreaterThanEqual" /* GreaterThanEqual */);
    if (!cmp2) {
      return;
    }
    const value = this._parseDate() ?? this._parseNumber() ?? this._parseVariableName() ?? this._createMissing(["Number" /* Number */, "Date" /* Date */]);
    return {
      _type: "Compare" /* Compare */,
      start: cmp2.start,
      end: value.end,
      cmp: this._scanner.value(cmp2),
      value
    };
  }
  _parseRange() {
    const anchor = this._token;
    const open = this._parseDate() ?? this._parseNumber() ?? this._parseVariableName();
    if (!open) {
      return;
    }
    if (!this._accept("Range" /* Range */)) {
      this._reset(anchor);
      return;
    }
    const close = this._parseDate() ?? this._parseNumber() ?? this._parseVariableName() ?? this._createMissing(["Number" /* Number */, "Date" /* Date */]);
    return {
      _type: "Range" /* Range */,
      start: open.start,
      end: close.end,
      open,
      close
    };
  }
  _parseRangeFixedEnd() {
    const tk = this._accept("RangeFixedEnd" /* RangeFixedEnd */);
    if (!tk) {
      return;
    }
    const close = this._parseDate() ?? this._parseNumber() ?? this._parseVariableName() ?? this._createMissing(["Number" /* Number */, "Date" /* Date */]);
    return {
      _type: "Range" /* Range */,
      start: tk.start,
      end: close.end,
      open: void 0,
      close
    };
  }
  _parseRangeFixedStart() {
    const anchor = this._token;
    const value = this._parseDate() ?? this._parseNumber();
    if (!value) {
      return;
    }
    const token = this._accept("RangeFixedStart" /* RangeFixedStart */);
    if (!token) {
      this._reset(anchor);
      return void 0;
    }
    return {
      _type: "Range" /* Range */,
      start: value.start,
      end: token.end,
      open: value,
      close: void 0
    };
  }
  _parseQualifiedValue() {
    const anchor = this._token;
    const not = this._accept("Dash" /* Dash */);
    const qualifier = this._parseLiteral();
    if (!qualifier || !this._accept("Colon" /* Colon */)) {
      this._reset(anchor);
      return;
    }
    const value = this._parseCompare() ?? this._parseRange() ?? this._parseRangeFixedStart() ?? this._parseRangeFixedEnd() ?? this._parseDate() ?? this._parseNumberLiteral() ?? this._parseVariableName() ?? this._parseLiteralOrLiteralSequence() ?? this._parseAny("SHA" /* SHA */) ?? this._createMissing(["Any" /* Any */], true);
    return {
      _type: "QualifiedValue" /* QualifiedValue */,
      start: not?.start ?? qualifier.start,
      end: value.end,
      not: Boolean(not),
      qualifier,
      value
    };
  }
  _parseVariableName() {
    const token = this._accept("VariableName" /* VariableName */);
    if (!token) {
      return void 0;
    }
    return {
      _type: "VariableName" /* VariableName */,
      start: token.start,
      end: token.end,
      value: this._scanner.value(token)
    };
  }
  _parseVariableDefinition() {
    const anchor = this._token;
    const name = this._parseVariableName();
    if (!name) {
      return;
    }
    this._accept("Whitespace" /* Whitespace */);
    if (!this._accept("Equals" /* Equals */)) {
      this._reset(anchor);
      return;
    }
    const value = this._parseQuery(false) ?? this._createMissing(["Query" /* Query */]);
    return {
      _type: "VariableDefinition" /* VariableDefinition */,
      start: name.start,
      end: value.end,
      name,
      value
    };
  }
  _createMissing(expected, optional) {
    return {
      _type: "Missing" /* Missing */,
      start: this._token.start,
      end: this._token.start,
      expected,
      optional
    };
  }
};

// src/extension/project.ts
var Project = class {
  constructor() {
    this._nodeToUri = /* @__PURE__ */ new WeakMap();
    this._cached = /* @__PURE__ */ new Map();
    this._parser = new Parser();
    this.symbols = new SymbolTable();
  }
  getOrCreate(doc) {
    let value = this._cached.get(doc.uri.toString());
    if (!value || value.versionParsed !== doc.version) {
      const text = doc.getText();
      value = {
        node: this._parser.parse(text, doc.uri.toString()),
        versionParsed: doc.version,
        doc
      };
      this._cached.set(doc.uri.toString(), value);
      this.symbols.update(value.node);
      Utils.walk(value.node, (node) => this._nodeToUri.set(node, doc.uri));
    }
    return value.node;
  }
  has(doc) {
    return this._cached.has(doc.uri.toString());
  }
  delete(doc) {
    this._cached.delete(doc.uri.toString());
    this.symbols.delete(doc.uri.toString());
  }
  all() {
    return this._cached.values();
  }
  _lookUp(node, uri) {
    if (!uri) {
      uri = this._nodeToUri.get(node);
    }
    if (!uri) {
      throw new Error("unknown node");
    }
    const entry = this._cached.get(uri.toString());
    if (!entry) {
      throw new Error("unknown file" + uri);
    }
    return entry;
  }
  rangeOf(node, uri) {
    const entry = this._lookUp(node, uri);
    return new vscode5.Range(entry.doc.positionAt(node.start), entry.doc.positionAt(node.end));
  }
  textOf(node, uri) {
    const { doc } = this._lookUp(node, uri);
    const range = new vscode5.Range(doc.positionAt(node.start), doc.positionAt(node.end));
    return doc.getText(range);
  }
  getLocation(node) {
    const data = this._lookUp(node);
    return new vscode5.Location(
      data.doc.uri,
      new vscode5.Range(data.doc.positionAt(node.start), data.doc.positionAt(node.end))
    );
  }
  queryData(queryNode) {
    const variableAccess = (name) => this.symbols.getFirst(name)?.value;
    function fillInQuery(node) {
      let sort;
      let order;
      const textWithSortBy = Utils.print(node, queryNode.text, variableAccess);
      const query = textWithSortBy.replace(/sort:([\w-+\d]+)-(asc|desc)/g, function(_m, g1, g2) {
        sort = g1 ?? void 0;
        order = g2 ?? void 0;
        return "";
      }).trim();
      result.push({
        q: query,
        sort,
        order
      });
    }
    function fillInQueryData(node) {
      switch (node._type) {
        case "Query" /* Query */:
          fillInQuery(node);
          break;
        case "OrExpression" /* OrExpression */:
          fillInQuery(node.left);
          fillInQueryData(node.right);
      }
    }
    const result = [];
    queryNode.nodes.forEach(fillInQueryData);
    return result;
  }
};
var ProjectContainer = class {
  constructor() {
    this._onDidRemove = new vscode5.EventEmitter();
    this.onDidRemove = this._onDidRemove.event;
    this._onDidChange = new vscode5.EventEmitter();
    this.onDidChange = this._onDidChange.event;
    this._disposables = [];
    this._associations = /* @__PURE__ */ new Map();
    this._disposables.push(vscode5.workspace.onDidOpenNotebookDocument((notebook) => {
      if (notebook.notebookType !== "github-issues") {
        return;
      }
      if (this._associations.has(notebook)) {
        throw new Error(`Project for '${notebook.uri.toString()}' already EXISTS. All projects: ${[...this._associations.keys()].map((nb) => nb.uri.toString()).join()}`);
      }
      const project = new Project();
      this._associations.set(notebook, project);
      try {
        for (const cell of notebook.getCells()) {
          if (cell.kind === vscode5.NotebookCellKind.Code) {
            project.getOrCreate(cell.document);
          }
        }
      } catch (err) {
        console.error("FAILED to eagerly feed notebook cell document into project");
        console.error(err);
      }
      this._onDidChange.fire(project);
    }));
    this._disposables.push(vscode5.workspace.onDidCloseNotebookDocument((notebook) => {
      const project = this._associations.get(notebook);
      if (project) {
        this._associations.delete(notebook);
        this._onDidRemove.fire(project);
      }
    }));
    this._disposables.push(vscode5.workspace.onDidChangeNotebookDocument((e) => {
      let project = this.lookupProject(e.notebook.uri, false);
      if (!project) {
        return;
      }
      for (let change of e.contentChanges) {
        for (let cell of change.removedCells) {
          project.delete(cell.document);
        }
        for (const cell of change.addedCells) {
          if (cell.kind === vscode5.NotebookCellKind.Code) {
            project.getOrCreate(cell.document);
          }
        }
      }
      this._onDidChange.fire(project);
    }));
  }
  lookupProject(uri, fallback = true) {
    for (let [notebook, project] of this._associations) {
      if (notebook.uri.toString() === uri.toString()) {
        return project;
      }
      for (let cell of notebook.getCells()) {
        if (cell.document.uri.toString() === uri.toString()) {
          return project;
        }
      }
    }
    if (!fallback) {
      return void 0;
    }
    console.log("returning AD-HOC project for " + uri.toString());
    return new Project();
  }
  all() {
    return this._associations.values();
  }
};

// src/extension/extension.ts
function activate(context) {
  const octokit = new OctokitProvider();
  const projectContainer = new ProjectContainer();
  context.subscriptions.push(new IssuesNotebookKernel(projectContainer, octokit));
  context.subscriptions.push(vscode6.notebooks.registerNotebookCellStatusBarItemProvider("github-issues", new IssuesStatusBarProvider()));
  context.subscriptions.push(vscode6.workspace.registerNotebookSerializer("github-issues", new IssuesNotebookSerializer(), {
    transientOutputs: true,
    transientCellMetadata: {
      inputCollapsed: true,
      outputCollapsed: true
    }
  }));
  context.subscriptions.push(registerLanguageProvider(projectContainer, octokit));
  context.subscriptions.push(registerCommands(projectContainer, octokit));
}
//# sourceMappingURL=extension-web.cjs.map
