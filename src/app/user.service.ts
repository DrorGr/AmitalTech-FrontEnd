import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { User } from './configs/declerations';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  private usersSource = new BehaviorSubject<string[]>([]);
  currentUsers = this.usersSource.asObservable();

  private userAddedSubject = new Subject<void>();

  userAdded$ = this.userAddedSubject.asObservable();

  private users: User[] = []; // New property to store the Users array

  constructor() { }

  addUser(user: string) {
    const currentValue = this.usersSource.value;
    const updatedValue = [...currentValue, user];
    this.usersSource.next(updatedValue);
  }

  notifyUserAdded() {
    this.userAddedSubject.next();
  }

  setUsers(users: User[]) {
    this.users = users;
  }

  getUsers() {
    return this.users;
  }
}
