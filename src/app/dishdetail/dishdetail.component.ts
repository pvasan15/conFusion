import { Component, OnInit, Input } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DISHES } from '../shared/dishes';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})

export class DishdetailComponent implements OnInit {

    dish: Dish;
    dishIds: string[];
    prev: string;
    next: string;
    feedbackForm: FormGroup;
    stars: number;
    name: string;
    comment: string;
    date: string=Date();

    formErrors = {
      'name': '',
      'comment': '',
    }

    validationMessages = {
      'name': {
        'required': 'Author Name is required.',
        'minlength': 'Author Name must be at least 2 characters long.'
      },
      'comment': {
        'required': 'Comment is required.',
      }
    }

  constructor(private dishService: DishService, private route: ActivatedRoute, private location: Location, private fb: FormBuilder) { 
    this.createForm();
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      comment: ['', Validators.required]
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
        if(control && (control.dirty && !control.valid) || control.untouched) {
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
    this.route.params.pipe(switchMap((params: Params) => this.dishService.getDish(params['id'])))
      .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); });
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length+index-1)%this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length+index+1)%this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }

  updateRating(rating: number) {
    this.stars = rating;
  }

  saveComments() {
    this.comment = this.comment.charAt(0).toUpperCase() + this.comment.substring(1);
    this.name = this.name.charAt(0).toUpperCase() + this.name.substring(1);
    let commentDetails =
    {
    "rating":this.stars,
    "comment":this.comment,
    "author":this.name,
    "date":this.date
    }
    DISHES.map(dish => dish.comments.push(commentDetails));
  }

}
