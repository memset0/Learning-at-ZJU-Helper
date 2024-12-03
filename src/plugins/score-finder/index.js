import '@ui5/webcomponents-fiori/dist/Timeline.js';
import '@ui5/webcomponents-fiori/dist/TimelineItem.js';
import '@ui5/webcomponents-icons/dist/away.js';
import '@ui5/webcomponents-icons/dist/accelerated.js';
import '@ui5/webcomponents-icons/dist/document-text.js';

import { app } from 'hyperapp';

export const name = '成绩嗅探';
export const description = '通过 API 显示学在浙大中已被登记但尚未公开的成绩。';

export const namespace = '学在浙大';
export const route = '/course/<course_id:int>/<panel>';

export async function load({ params, logger, panelInitialize }) {
  require('./style.less');

  const courseId = params.course_id;
  logger.debug('当前课程:', courseId);

  const activityReadsPromise = fetch(`https://courses.zju.edu.cn/api/course/${courseId}/activity-reads-for-user`);
  const homeworkActivitiesPromise = fetch(`https://courses.zju.edu.cn/api/course/${courseId}/homework-scores?fields=id,title`);
  const examsActivitiesPromise = fetch(`https://courses.zju.edu.cn/api/courses/${courseId}/exams`);

  const [activityReadsResponse, homeworkActivitiesResponse, examsActivitiesResponse] = await Promise.all((await Promise.all([activityReadsPromise, homeworkActivitiesPromise, examsActivitiesPromise])).map((response) => response.json()));
  if (!activityReadsResponse || !activityReadsResponse.activity_reads) {
    logger.warn('活动阅读数据获取失败！');
  }
  if (!homeworkActivitiesResponse || !homeworkActivitiesResponse.homework_activities) {
    logger.warn('作业数据获取失败！');
  }
  if (!examsActivitiesResponse || !examsActivitiesResponse.exams) {
    logger.warn('考试数据获取失败！');
  }
  const activityReads = activityReadsResponse.activity_reads;
  const homeworkActivities = homeworkActivitiesResponse.homework_activities;
  const examsActivities = examsActivitiesResponse.exams;

  logger.debug('活动阅读数据:', activityReads);
  logger.debug('作业数据:', homeworkActivities);
  logger.debug('考试数据:', examsActivities);

  const titleMap = new Map();
  homeworkActivities.forEach((homework) => titleMap.set(homework.id, homework.title));
  examsActivities.forEach((exam) => titleMap.set(exam.id, exam.title));
  activityReads.forEach((activityRead) => {
    if (titleMap.has(activityRead.activity_id)) {
      activityRead.title = titleMap.get(activityRead.activity_id);
    } else {
      activityRead.title = '未知活动';
    }
  });
  logger.info('合并后的活动数据:', activityReads);

  app({
    node: panelInitialize(),
    view: () => {
      if (activityReads.length === 0) {
        return <span>没有检测到作业或考试。</span>;
      }
      const items = [];
      for (const activity of activityReads) {
        let icon = null;
        let link = null;
        let content = '';

        if (activity.activity_type === 'learning_activity') {
          icon = 'document-text';
          link = `https://courses.zju.edu.cn/course/${courseId}/learning-activity#/${activity.activity_id}`;
          if (activity.title != '未知活动') {
            if (activity.data.score === undefined) {
              content = '未评分';
            } else {
              content = `得分：${activity.data.score}`;
            }
          } else {
            if (Object.keys(activity.data).length === 0) {
              content = '缺少数据';
            } else {
              content = JSON.stringify(activity.data);
            }
          }
        } else if (activity.activity_type === 'exam_activity') {
          link = `https://courses.zju.edu.cn/course/${courseId}/learning-activity#/exam/${activity.activity_id}`;
          icon = 'away';
          content = `得分：${activity.data.score}`;
        } else {
          icon = 'accelerated';
          content = '缺少数据';
        }

        logger.debug('活动:', activity);
        const timestamp = activity.last_visited_at ? Date.parse(activity.last_visited_at) : Date.now();

        items.push(
          <ui5-timeline-item title-text={activity.title} timestamp={timestamp} icon={icon} nameClickable={link !== null}>
            <div class="score-finder-item-content">{content}</div>
          </ui5-timeline-item>
        );
      }
      logger.debug('活动组件:', items);
      return <ui5-timeline>{items}</ui5-timeline>;
    },
  });
}
