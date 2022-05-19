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
    const spinner = ora();
    let table1 = new Table({
        head: ['提交人', '最后提交时间', '相对时间', '提交次数']
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
        if (item[0]) {
            let theDate = dayjs(item[0].date);
            lastDate = theDate.format('YYYY-MM-DD HH:mm:ss');
            relativeData = theDate.fromNow();
        }
        logsGroup.push({
            author_name: key,
            count: item.length,
            lastDate: lastDate,
            relativeData: relativeData
        });
    });
    let logsGroupSort = _.orderBy(logsGroup, ['count'], ['desc']);

    _.forEach(logsGroupSort, (item) => {
        table1.push([item.author_name, item.lastDate, item.relativeData, item.count + ' 次']);
    });

    console.log(table1.toString());

    spinner.succeed('处理完毕');
}
