import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import * as userService from "./../services/userService";
import { toast } from "react-toastify";
import { loginWithJwt, getCurrentUser } from "../services/authService";
import { Redirect } from "react-router-dom";
class RegisterForm extends Form {
  state = { data: { username: "", password: "", name: "" }, errors: {} };

  schema = {
    username: Joi.string()
      .email()
      .required()
      .label("Username"),
    password: Joi.string()
      .min(6)
      .required()
      .label("Password"),
    name: Joi.string()
      .required()
      .label("Name")
  };

  doSubmit = async () => {
    try {
      const { headers } = await userService.register(this.state.data);
      loginWithJwt(headers["x-auth-token"]);
      window.location = "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        toast.error("Error: Can't register with the following info");
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    if (getCurrentUser()) return <Redirect to="/" />;
    return (
      <div>
        <form className="form-register" onSubmit={this.handleSubmit}>
          <h1 className="h3 text-left">Register</h1>
          {this.renderInput("Username", "text", "username", true)}
          {this.renderInput("Password", "password", "password")}
          {this.renderInput("Name", "text", "name")}

          {this.renderSubmitForm("Register")}
        </form>
      </div>
    );
  }
}

export default RegisterForm;
