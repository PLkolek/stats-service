export interface CourseLifetimeStatistics {
  totalModulesStudied: number;
  // if there are no sessions, there is no average
  // null (not undefined) to keep the field in JSON
  averageScore: number | null;
  timeStudied: number;
}
