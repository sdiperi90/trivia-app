import React, { Component } from "react";

import "../stylesheets/App.css";
import Question from "./Question";
import Search from "./Search";
import $ from "jquery";

class QuestionView extends Component {
  constructor() {
    super();
    this.state = {
      questions: [],
      page: 1,
      totalQuestions: 0,
      categories: {},
      currentCategory: null
    };
  }

  componentDidMount() {
    this.getQuestions();
  }

  getQuestions = () => {
    $.ajax({
      url: `http://localhost:5000/api/questions?page=${this.state.page}`, //TODO: update request URL
      type: "GET",
      success: result => {
        console.log("TESTAPI", result.data);
        this.setState({
          questions: result.data.questions,
          totalQuestions: result.data.total_questions,
          categories: result.data.categories,
          currentCategory: result.data.current_category
        });

        return;
      },
      error: error => {
        alert("Unable to load questions. Please try your request again");
        return;
      }
    });
  };

  selectPage(num) {
    this.setState({ page: num }, () => this.getQuestions());
  }

  createPagination() {
    let pageNumbers = [];
    let maxPage = Math.ceil(this.state.totalQuestions / 10);

    for (let i = 1; i <= maxPage; i++) {
      pageNumbers.push(
        <span
          key={i}
          className={`page-num ${i === this.state.page ? "active" : ""}`}
          onClick={() => {
            this.selectPage(i);
          }}
        >
          {i}
        </span>
      );
    }
    console.log("SPAN", pageNumbers);
    return pageNumbers;
  }

  getByCategory = id => {
    $.ajax({
      url: `http://localhost:5000/api/categories/${id}/questions`, //TODO: update request URL
      type: "GET",
      success: result => {
        this.setState({
          questions: result.questions,
          totalQuestions: result.total_questions,
          currentCategory: result.current_category
        });
        return;
      },
      error: error => {
        alert("Unable to load questions. Please try your request again");
        return;
      }
    });
  };

  submitSearch = searchTerm => {
    $.ajax({
      url: `http://localhost:5000/api/questions/searchQuestions`, //TODO: update request URL
      type: "POST",
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify({ searchTerm: searchTerm }),
      crossDomain: true,
      success: result => {
        this.setState({
          questions: result.questions,
          totalQuestions: result.total_questions,
          currentCategory: result.current_category
        });
        return;
      },
      error: error => {
        alert("Unable to load questions. Please try your request again");
        return;
      }
    });
  };

  questionAction = id => action => {
    if (action === "DELETE") {
      if (window.confirm("are you sure you want to delete the question?")) {
        $.ajax({
          url: `http://localhost:5000/api/questions/${id}`, //TODO: update request URL
          type: "DELETE",
          success: result => {
            console.log("THIS FUNCTION RAN");
            this.getQuestions();
          },
          error: error => {
            alert("Unable to load questions. Please try your request again");
            return;
          }
        });
      }
    }
  };

  render() {
    let { categories } = this.state;
    this.state.totalQuestions && console.log(this.state);
    console.log("STATE", this.state);
    return (
      <div className="question-view">
        <div className="categories-list">
          <h2
            onClick={() => {
              this.getQuestions();
            }}
          >
            Categories
          </h2>
          {categories.hasOwnProperty ? (
            <ul>
              {Object.keys(this.state.categories).map(id => (
                <li
                  key={id}
                  onClick={() => {
                    this.getByCategory(id);
                  }}
                >
                  {this.state.categories[id]}
                  <img
                    className="category"
                    src={`${this.state.categories[id]}.svg`}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <h1>Loading</h1>
          )}
          <Search submitSearch={this.submitSearch} />
        </div>
        {this.state.questions.length > 0 ? (
          <div className="questions-list">
            <h2>Questions</h2>
            {this.state.questions.map((q, ind) => (
              <Question
                key={q.id}
                question={q.question}
                answer={q.answer}
                category={this.state.categories[q.category]}
                difficulty={q.difficulty}
                questionAction={this.questionAction(q.id)}
              />
            ))}

            <div className="pagination-menu">{this.createPagination()}</div>
          </div>
        ) : (
          <h1>Loading</h1>
        )}
      </div>
    );
  }
}

export default QuestionView;
