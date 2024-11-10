import { Component, OnInit, ViewChild } from '@angular/core';
import { FeedbackService } from '../../../services/feedback.service';
import { SnackbarComponent } from '../../admin/snackbar/snackbar.component';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  @ViewChild(SnackbarComponent) snackbar!: SnackbarComponent;

  questions: string[] = [];
  feedback = {
    userId: '',
    userType: '',
    responses: {
      q1: 0,
      q2: 0,
      q3: 0,
      q4: 0,
      q5: 0,
      q6: 0,
      q7: 0,
      q8: 0,
      q9: 0,
      q10: 0,
    }
  };
  formSubmitted = false;

  constructor(private feedbackService: FeedbackService) {}

  ngOnInit(): void {
    this.fetchQuestions();
  }

  fetchQuestions(): void {
    this.feedbackService.getQuestions().subscribe(
      (questions) => {
        this.questions = questions.map((q: any) => q.question_text);
      },
      (error) => {
        console.error('Error fetching questions:', error);
        this.snackbar.showMessage('Failed to load questions');
      }
    );
  }

  detectUserType(userId: string): string {
    if (/^\d{4}-\d{5}-TG-0$/.test(userId)) {
      return 'student';
    } else if (/^FA\d{4}TG\d{4}$/.test(userId)) {
      return 'faculty';
    } else if (/^\d{5}$/.test(userId)) {
      return 'employee';
    } else {
      return 'visitor';
    }
  }

  validateForm() {
    const isUserIdEmpty = !this.feedback.userId;
    let allQuestionsAnswered = true;

    for (let i = 1; i <= 10; i++) {
      if (this.feedback.responses[`q${i}`] === 0) {
        allQuestionsAnswered = false;
        break;
      }
    }

    if (isUserIdEmpty && !allQuestionsAnswered) {
      this.snackbar.showMessage('Please fill in the User ID and answer all questions.');
      return false;
    } else if (isUserIdEmpty) {
      this.snackbar.showMessage('User ID is required.');
      return false;
    } else if (!allQuestionsAnswered) {
      this.snackbar.showMessage('Please answer all questions.');
      return false;
    }

    return true;
  }

  submitFeedback() {
    this.formSubmitted = true;
  
    if (!this.validateForm()) {
      return;
    }
  
    this.feedback.userType = this.detectUserType(this.feedback.userId);
  
    this.feedbackService.submitFeedback(this.feedback).subscribe(
      (response) => {
        if (response.status === 'success') {
          this.snackbar.showMessage('Feedback submitted successfully');
        } else if (response.status === 'updated') {
          this.snackbar.showMessage('Your feedback has been updated');
        } else {
          this.snackbar.showMessage(response.message);
        }
        
        this.formSubmitted = false;
        this.feedback = { userId: '', userType: '', responses: { q1: 0, q2: 0, q3: 0, q4: 0, q5: 0, q6: 0, q7: 0, q8: 0, q9: 0, q10: 0 }};
      },
      (error) => {
        console.error('Error submitting feedback', error);
        this.snackbar.showMessage('Error submitting feedback');
      }
    );
  }  
}