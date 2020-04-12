import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';

import {UsersService} from '../../shared/services/users.service';
import {User} from '../../shared/models/user.model';
import {Message} from '../../shared/models/message.model';
import {AuthService} from '../../shared/services/auth.service';
import {fadeStateTrigger} from '../../shared/animations/fade-animation';
import {Meta, Title} from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [fadeStateTrigger]
})
export class LoginComponent implements OnInit {

  constructor(private userService: UsersService,
              private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private title: Title,
              private meta: Meta) {
    title.setTitle('Log-in');
    meta.addTags([
      {name: 'keywords', content: 'Login to system/dashboard'},
      {name: 'description', content: 'Page log-int to the system'}
    ]);
  }

  form: FormGroup;
  message: Message;

  ngOnInit() {

    this.message = new Message('danger', '');


    // Show message after registration with text
    this.route.queryParams
      .subscribe((params: Params) => {
        // Check if queryParams has params nowCanLogin that was send after registration
        if (params['nowCanLogin']) {
          this.showMessage({
            text: 'Now you can LogIn in to Dashboard',
            type: 'success'
          });
        } else if (params['accessDenied']) {
          this.showMessage({
            text: 'You should be authorized',
            type: 'warning'
          });
        }
      });



    // Check form validation
    this.form = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6)]),
    });
  }



  private showMessage (message: Message) {
    this.message = message;
    window.setTimeout( () => {
      this.message.text = '';
    }, 4000);
  }



  onSubmit() {
    const formData = this.form.value;

    this.userService.getUserByEmail(formData)
      .subscribe((user: User) => {

        if (user) {
          if (user.password === formData['password']) {
            this.message.text = '';
            window.localStorage.setItem('user', JSON.stringify(user));
            this.authService.login();

            this.router.navigate(['/system', 'bill']);

          } else  {
            this.showMessage({
              text: 'Incorrect password',
              type: 'danger'
            });
          }
        } else {
          this.showMessage({
            text: 'User not found or not exist',
            type: 'danger'
          });
        }

      });
  }

}
