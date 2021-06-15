import { Component, OnInit, Input, Inject, ViewChildren } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators, ControlContainer } from '@angular/forms';
import { Comment } from '../shared/comment';
import { visibility, flyInOut, expand } from '../animations/app.animation';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [ visibility(), flyInOut(), expand() ]
})

export class DishdetailComponent implements OnInit {

    dish: Dish;
    errMess: string;
    dishIds: string[];
    prev: string;
    next: string;
    stars: number;
    name: string;
    dishcopy: Dish;
    comment: Comment;
    feedbackForm: FormGroup;
    authorPattern: string;
    visibility = 'shown';

    formErrors = {
      'author': '',
      'comment': '',
      'rating': ''
    }

    validationMessages = {
      'author': {
        'required': 'Author Name is required.',
        'minlength': 'Author Name must be at least 2 characters long.',
        'pattern': 'Author Name must contain only letters.'
      },
      'comment': {
        'required': 'Comment is required.',
      }
    }

  constructor(private dishService: DishService, private route: ActivatedRoute, private location: Location, private fb: FormBuilder,
    @Inject('BaseURL') public BaseURL) { 
    this.createForm();
  }

  createForm() {
    this.authorPattern = '^[a-zA-Z]+$';
    this.feedbackForm = this.fb.group({
      rating: [],
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern(this.authorPattern)]],
      comment: ['', Validators.required],
    })

    this.feedbackForm.valueChanges.subscribe(data => this.onValueChanged());

    this.onValueChanged();
  }

  onValueChanged() {
    if(!this.feedbackForm) { 
      return; 
    }
    const form = this.feedbackForm;
      for (const field in this.formErrors) {
      if(this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        const control = form.get(field);
        if(control && ((control.dirty && !control.valid) || control.untouched)) {
          const messages = this.validationMessages[field];
          for(const key in control.errors) {
            if(control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  ngOnInit() {
    this.dishService.getDishIds()
      .subscribe((dishIds) => this.dishIds = dishIds);
    this.route.params.pipe(switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishService.getDish(params['id']); }))
      .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; },
        errmess => this.errMess = <any>errmess);
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length+index-1)%this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length+index+1)%this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }

  onSubmit() {
    this.comment = this.feedbackForm.value;
    this.comment.author = this.comment.author.replace(/^./, this.comment.author[0].toUpperCase());
    this.comment.date = new Date().toISOString();
    this.dishcopy.comments.push(this.comment);
    this.dishService.putDish(this.dishcopy)
      .subscribe(dish => {
        this.dish = dish; 
        this.dishcopy = dish;
      },
      errmess => { this.dish = null; this.dishcopy = null; this.errMess = <any>errmess; });
  }

}
