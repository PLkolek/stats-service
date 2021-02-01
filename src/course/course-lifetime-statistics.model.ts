export interface CourseLifetimeStatistics {
  totalModulesStudied: number;
  //TODO: use undefined
  averageScore: number | null; // if there are no sessions, there is no average
  timeStudied: number;
}
