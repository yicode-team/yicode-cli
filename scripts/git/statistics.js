import simpleGit from 'simple-git';
import dayjs from 'dayjs';
import Table from 'cli-table3';
import ora from 'ora';
import * as _ from 'lodash-es';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import 'dayjs/locale/zh-cn.js';
dayjs.locale('zh-cn');
dayjs.extend(relativeTime);

export async function statistics(options) {
    try {
        const spinner = ora();
        let table1 = new Table({
            head: ['提交人', '最后提交时间', '相对时间', '提交次数', '今日提交时间', '今日提交总次数', '昨日提交时间', '昨日总次数']
        });
        let table2 = new Table({
            head: ['最新提交人', '最新提交邮箱', '最新提交时间', '提交总次数']
        });
        let git = simpleGit();

        let logs = await git.log();

        table2.push([logs.latest.author_name, logs.latest.author_email, dayjs(logs.latest.date).format('YYYY-MM-DD HH:mm:ss'), logs.total]);
        console.log(table2.toString());

        let logsGroup = [];

        _.forOwn(_.groupBy(logs.all, 'author_name'), (item, key) => {
            let lastDate = '';
            let relativeData = '';
            let todayCount = 0;
            let todayLastDate = '';
            let yesterdayCount = 0;
            let yesterdayLastDate = '';
            let todayDate = dayjs();
            let yesterdayDate = dayjs().subtract(1, 'day');
            let isToday = false;
            let isYesterdayDate = false;
            let dateFormat = 'YYYY-MM-DD HH:mm:ss';
            _.forEach(item, (row, index) => {
                let theDate = dayjs(row.date);
                let theDataFormat = theDate.format(dateFormat);
                if (index === 0) {
                    lastDate = theDataFormat;
                    relativeData = theDate.fromNow();
                }

                // 如果是今天
                if (theDate.isSame(todayDate, 'day')) {
                    if (isToday === false) {
                        todayLastDate = theDataFormat;
                        isToday = true;
                    }
                    todayCount += 1;
                }
                // 如果是昨天
                if (theDate.isSame(yesterdayDate, 'day')) {
                    if (isYesterdayDate === false) {
                        yesterdayLastDate = theDataFormat;
                        isYesterdayDate = true;
                    }
                    yesterdayCount += 1;
                }
            });
            logsGroup.push({
                author_name: key,
                count: item.length,
                lastDate: lastDate,
                relativeData: relativeData,
                todayCount: todayCount,
                todayLastDate: todayLastDate,
                yesterdayCount: yesterdayCount,
                yesterdayLastDate: yesterdayLastDate
            });
        });
        let logsGroupSort = _.orderBy(logsGroup, ['count'], ['desc']);

        _.forEach(logsGroupSort, (item) => {
            table1.push([
                //
                item.author_name,
                item.lastDate,
                item.relativeData,
                item.count + ' 次',
                item.todayLastDate,
                item.todayCount + ' 次',
                item.yesterdayLastDate,
                item.yesterdayCount + ' 次'
            ]);
        });

        console.log(table1.toString());
    } catch (err) {
        console.log('🚀 ~ file: statistics.js ~ line 97 ~ statistics ~ err', err);
    }
}
