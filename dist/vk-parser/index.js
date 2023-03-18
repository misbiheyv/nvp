"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostsInTimeRange = void 0;
const promises_1 = __importDefault(require("node:fs/promises"));
const node_fs_1 = __importDefault(require("node:fs"));
const vkApi = __importStar(require("vk-io"));
const dayjs_1 = __importDefault(require("dayjs"));
const vk = new vkApi.VK({
    token: 'a8af6beaa8af6beaa8af6bea19abbc6901aa8afa8af6beacca416d3183207a40b2d74dc'
});
async function getPostsInTimeRange() {
    const [startTime, endTime] = [getNearestThursday(), getNearestFriday()];
    const fileName = `./${startTime}-${endTime}.json`;
    if (!node_fs_1.default.existsSync(fileName)) {
        const response = await vk.api.procedure('getPostsInTimeRange', { startTime, endTime });
        await Promise.allSettled([
            writeErrors(response.errors),
            writeResponse(response.response, fileName),
        ]);
    }
    try {
        const buffer = await promises_1.default.readFile(fileName);
        return JSON.parse(buffer.toString());
    }
    catch {
        console.log('err');
    }
}
exports.getPostsInTimeRange = getPostsInTimeRange;
function writeErrors(errors) {
    if (errors.length > 0) {
        promises_1.default.appendFile('./errors.json', Buffer.from(`${JSON.stringify(errors)}\n`));
    }
    return Promise.resolve(0);
}
async function writeResponse(response, filePath) {
    const res = response.filter(el => {
        return el.text.includes('НОВИНКИ ПЯТНИЦЫ');
    });
    if (res.length > 0) {
        await promises_1.default.writeFile(filePath, Buffer.from(JSON.stringify(res[0])));
    }
    return Promise.resolve(0);
}
function getNearestFriday(date = new Date()) {
    const y = (0, dayjs_1.default)(date).get('year');
    const m = (0, dayjs_1.default)(date).get('month');
    const d = (0, dayjs_1.default)(date).get('date') + [-2, -3, -4, -5, -6, 0, -1][(0, dayjs_1.default)(date).get('day')];
    return new Date(y, m, d).setHours(0, 0, 0, 0);
}
function getNearestThursday(date = new Date()) {
    const y = (0, dayjs_1.default)(date).get('year');
    const m = (0, dayjs_1.default)(date).get('month');
    const d = (0, dayjs_1.default)(date).get('date') + [-3, -4, -5, -6, 0, -1, -2][(0, dayjs_1.default)(date).get('day')];
    return new Date(y, m, d).setHours(0, 0, 0, 0);
}
