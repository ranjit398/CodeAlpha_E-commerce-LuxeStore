/**
 * pages/RegisterPage.jsx — Redirects to LoginPage in register mode
 */
import React from 'react';
import LoginPage from './LoginPage';

export default function RegisterPage() {
  return <LoginPage mode="register" />;
}
