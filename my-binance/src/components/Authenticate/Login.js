import React from 'react';
import { Container } from 'react-bootstrap';

const Login = () => {
  return (
    <Container>
      <h1 className="display-1 text-center">Login</h1>
      <div className="row">
        <form action="/login" method="POST" class="col-lg-6 offset-lg-3 validated-form" novalidate>
          <div class="form-group">
            <label class="col-form-label" for="username">Username</label>
            <input name="username" type="text" class="form-control" id="username" placeholder="Enter Username" required>
          </div>
          <div class="form-group">
            <label class="col-form-label" for="password">Password</label>
            <input name="password" type="password" class="form-control" id="password" placeholder="Enter Password"
              required>
          </div>
          <button class="btn btn-success mt-3">Submit</button>
        </form>
      </div>
    </Container>
  )
}