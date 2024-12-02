export const name = '成绩查找';
export const description = '通过 API 显示学在浙大中已被登记但尚未公开的成绩。';

export const namespace = '学在浙大';
export const route = '/course/<course_id:int>/<panel>';

export async function load({ params, logger }) {
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
  homeworkActivities.forEach((homework) => {
    titleMap.set(homework.id, homework.title);
  });
  examsActivities.forEach((exam) => {
    titleMap.set(exam.id, exam.title);
  });
  activityReads.forEach((activityRead) => {
    activityRead.title = titleMap.get(activityRead.activity_id) || 'Unknown';
  });
  logger.info('合并后的活动数据:', activityReads);
}
