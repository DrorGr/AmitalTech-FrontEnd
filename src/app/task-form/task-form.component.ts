import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UserService } from '../user.service';
import { ApiService } from '../api/api.service';
import { Observable, map, startWith } from 'rxjs';
import { User } from '../configs/declerations';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
})
export class TaskFormComponent implements OnInit {
  userForm: FormGroup = new FormGroup({});
  Users: User[] = [];
  myControl = new FormControl();
  filteredOptions: Observable<string[]> | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private myApiService: ApiService
  ) { }

  ngOnInit() {
    this.userForm = this.formBuilder.group({
      subject: ['', Validators.required],
      userId: [null, Validators.required],
      targetDate: ['', Validators.required],
      isCompleted: [false],
    });

    this.myControl.valueChanges.subscribe((selectedUser) => {
      const matchingUser = this.Users.find(
        (user) => user.name === selectedUser
      );
      if (matchingUser) {
        this.userForm.get('userId')?.setValue(matchingUser.id);
      }
    });

    this.fetchUsers();
  }

  isNullOrUndefined(value: unknown): boolean {
    return value === null || value === undefined;
  }

  saveUserData() {
    const formData = this.userForm.value;
    this.myApiService.create('/api/Main/AddTask', formData).subscribe({
      next: (_response) => {
        this.userService.notifyUserAdded();
        this.resetForm();
      },
      error: (_response) => {
        if (_response.status === 400) {
          alert(_response.error.errors);
          console.log(_response)
        } else {
          alert('Task added successfully');
          console.log(_response)
        }
      },
    });
  }

  resetForm() {
    this.userForm.reset();
    this.userForm.markAsPristine();
    this.userForm.markAsUntouched();
    this.myControl.reset();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    if (filterValue === '') {
      return this.Users.map((user) => user?.name);
    }

    return this.Users.filter((option) =>
      option?.name.toLowerCase().includes(filterValue)
    ).map((option) => option?.name);
  }

  fetchUsers() {
    this.myApiService.get('/api/Main/GetUsers').subscribe((users) => {
      this.Users = users;
      this.userService.setUsers(users);
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value || ''))
      );
    });
  }
}
