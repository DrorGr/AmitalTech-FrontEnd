import { UserService } from '../user.service';
import { ApiService } from '../api/api.service';
import { Component, OnInit } from '@angular/core';
import { Task } from '../configs/declerations';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];

  constructor(
    private userService: UserService,
    private ApiService: ApiService
  ) { }

  ngOnInit(): void {
    this.fetchTasks();
    this.userService.userAdded$.subscribe(() => {
      this.fetchTasks();
    });
  }

  fetchTasks() {
    this.ApiService.get('/api/Main/GetTasks').subscribe((tasks) => {
      this.tasks = tasks;
      this.replaceUserIdsWithNames();
    });
  }

  replaceUserIdsWithNames() {
    const users = this.userService.getUsers();
    this.tasks.forEach((task) => {
      const matchingUser = users.find((user) => user.id === task.userId);
      if (matchingUser) {
        task.userName = matchingUser.name;
      }
    });
  }
}
