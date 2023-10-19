

export default class TaskEngine {
  // valiable to contain today's date in india
  private today = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });

  // contains tasks to be run
  taskArray: Function[] = [];

  // constructor
  constructor() {
  }

  // add task to task array
  addTask(task: Function) {
    this.taskArray.push(task);
  }

  // remove task from task array
  removeTask(task: Function) {
    this.taskArray = this.taskArray.filter(t => t !== task);
  }

  // run all tasks in task array
  async runTasks() {
    for (const task of this.taskArray) {
      try {
        await task();
        this.removeTask(task);
      } catch (error) {
        console.error(error)
      }
    }
  }

  // run all tasks in task array at a specific time
  async runTasksAtTime(hour: number, minute: number) {
    // check if time is same as current time
    if (new Date().getHours() === hour && new Date().getMinutes() === minute) {
      await this.runTasks();
    }
  }

}