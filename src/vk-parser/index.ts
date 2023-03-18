import fsp from 'node:fs/promises';
import fs from 'node:fs'
import * as vkApi from 'vk-io';
import dayjs from 'dayjs';
import { ExecuteError } from 'vk-io';

const vk = new vkApi.VK({
	token: 'a8af6beaa8af6beaa8af6bea19abbc6901aa8afa8af6beacca416d3183207a40b2d74dc'
});

export async function getPostsInTimeRange() {
	const [startTime, endTime] = [getNearestThursday(), getNearestFriday()];
	const fileName = `./${startTime}-${endTime}.json`;

	if (!fs.existsSync(fileName)) {
		const response = await vk.api.procedure('getPostsInTimeRange', { startTime, endTime })

		await Promise.allSettled([
			writeErrors(response.errors),
			writeResponse(response.response, fileName),
		])
	}

    try {
        const buffer = await fsp.readFile(fileName);
        return JSON.parse(buffer.toString());
    } catch {
        console.log('err');
    }
}

function writeErrors(errors: ExecuteError[]) {
	if (errors.length > 0) {
		fsp.appendFile('./errors.json', Buffer.from(`${JSON.stringify(errors)}\n`))
	}

	return Promise.resolve(0);
}

async function writeResponse(response: {text: string}[], filePath: string) {
	const res = response.filter(el => {
		return el.text.includes('НОВИНКИ ПЯТНИЦЫ')
	});

	if (res.length > 0) {
		await fsp.writeFile(filePath, Buffer.from(JSON.stringify(res[0])))
	}

	return Promise.resolve(0);
}

function getNearestFriday(date = new Date()) {
	const y = dayjs(date).get('year');
	const m = dayjs(date).get('month');
	const d = dayjs(date).get('date') + [-2, -3, -4, -5, -6, 0, -1][dayjs(date).get('day')];

	return new Date(y, m, d).setHours(0,0,0,0);
}

function getNearestThursday(date = new Date()) {
	const y = dayjs(date).get('year');
	const m = dayjs(date).get('month');
	const d = dayjs(date).get('date') + [-3, -4, -5, -6, 0, -1, -2][dayjs(date).get('day')];

	return new Date(y, m, d).setHours(0,0,0,0);
}